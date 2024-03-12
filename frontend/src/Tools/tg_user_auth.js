
import axios from 'axios';
import { useAuth } from '../Components/Auth/AuthContext';

function TgUserAuth(tg_user) {
    
    const { currentUser, signInWithToken, logout } = useAuth();
    
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
}

export default TgUserAuth;