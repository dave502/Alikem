import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithCustomToken,
} from "firebase/auth";
import { varNeoUser } from '../../variables';
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import axios from 'axios';

import auth from '../../Configs/firebase';

const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const neoUser = useReactiveVar(varNeoUser);
  
   
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  
  const READ_USER_POFILE = gql`
    query Users($uid: String!)
    {
    users( where: {uid: $uid} )
    {
        name
        gender
        birthday
        city
        cityID
        img    
    }
    }
    `;
  const { refetch: gqlReadUserProfile } = useQuery(READ_USER_POFILE, 
      {
      variables: { uid: currentUser?.uid },
      });


  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function verifyEmail() {
    return sendEmailVerification(auth.currentUser);
  }
  
  function signInWithToken(token) {
    return signInWithCustomToken(auth, token);
  }
  
  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      gqlReadUserProfile({ uid: userCredential.uid })
      .then((resp) => {
        var neo_user = new Object();
        Object.entries(resp.data.users[0]).forEach(v => neo_user[v[0]] = v[1] || undefined)
        varNeoUser(neo_user)
      })
      .catch((error) => {
        setError("gqlReadUserProfile error: " + error.message)
      });
    })
    .catch((error) => {
      setError("signInWithEmailAndPassword error: " + error.message)
    });
  }

  function logout() {
    varNeoUser(null)
    setCurrentUser(null)
    return signOut(auth);
  }

  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }
  
  
  function tgUserAuth(tg_user) {
       
    const additionalClaims = {
        displayName: tg_user.first_name,
        userName: tg_user.username,
        photoURL: tg_user.photo_url,
        userID: tg_user.id,
    };

    //axios.get("/get-jwt", {params: {uid: String(tg_user.id)}})
    axios.post("/auth/get-jwt", {
    "uid": String("tg#"+tg_user.id), "data": additionalClaims
    })//
    .then(res => {
        console.log("res.data.token", res.data.token)
        signInWithToken(res.data.token)
        .then((userCredential) => {
            // Signed in
            // const user = userCredential.user;

            const additionalUserInfo = {
              displayName: tg_user.first_name,
              emailVerified: true,
              photoURL: tg_user.photo_url,
            };
            axios.post("/auth/edit-user", {
              "uid": String("tg#"+tg_user.id), "data": additionalUserInfo
            })
            .then( ()=>{
              if(currentUser) currentUser.reload()
            })
            // ...
        })
        .catch((error) => {
            console.log("signIn with token failed:", error.message)
        });
    })
    .catch((error) => {
        console.log('Error creating custom token:', error.message);
    });

  const value = {
    currentUser,
    neoUser,
    error,
    setError,
    login,
    register,
    logout,
    verifyEmail,
    updateUserProfile,
    signInWithToken,
    tgUserAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
