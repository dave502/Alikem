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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
