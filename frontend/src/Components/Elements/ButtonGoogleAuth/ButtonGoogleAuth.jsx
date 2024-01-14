import { getAuth, createUserWithEmailAndPassword, signInWithPopup, signOut,
    signInWithRedirect, getRedirectResult, EmailAuthProvider, GoogleAuthProvider  } from "firebase/auth";
import { Button } from '@chakra-ui/react';
import IconGoogleSvg from "./IconGoogleSvg"
    
function ButtonGoogleAuth(props) {
    
  const { auth, mode, setResult} = props;
  
  const google_auth_provider = new GoogleAuthProvider();
  google_auth_provider.addScope('profile');
  google_auth_provider.addScope('email');
  //google_auth_provider.addScope('https://www.googleapis.com/auth/plus.login');

  const GoogleSignIn = async() => {

    //await signOut(auth);
    console.log("auth2222222222222222: ", auth)
    
    try{
      localStorage.setItem("catchGoogleRedirect", true);
      
      await signInWithRedirect(auth, google_auth_provider);
      console.log("auth233333333333333333: ", auth)
    } catch (error) {
      console.log(error)
      setResult(error)
    }
      
      // console.log("signInWithRedirect")
      // setResult("signInWithRedirect");
      /*getRedirectResult(auth)
      .then((result) => {
        setResult("result")
        // // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // // The signed-in user info.
        // const user = result.user;
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
      }).catch((error) => {
        setResult("error")
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      
      // try {
      //   const result = await getRedirectResult(auth);
      //   setResult("result")
      //   if (result) {
      //       // This gives you a Google Access Token. You can use it to access Google APIs.
      //       const credential = GoogleAuthProvider.credentialFromResult(result);
      //       if (credential) {
      //         setResult("logged")
      //       //   // This gives you a Google Access Token. You can use it to access the Google API.
      //       //   const token = credential?.accessToken;
      //       //   setToken(token ?? '');
      //       // } else {
      //       //   setToken('null');
      //       }
      //       setResult("result1")
      //       // // The signed-in user info.
      //       // const user = result.user;
            
      //       // setUser(user)
      //       // // IdP data available using getAdditionalUserInfo(result)
      //       // // ...
      //   }
      // } catch (error) {
      //   setResult("error") // Debug errors from redirect response
      // }
        // }).catch((error) => {
        //   // Handle Errors here.
        //   const errorCode = error.code;
        //   const errorMessage = error.message;
        //   // The email of the user's account used.
        //   const email = error.email;
        //   // The firebase.auth.AuthCredential type that was used.
        //   const credential = error.credential;
        //   if (errorCode === 'auth/account-exists-with-different-credential') {
        //     alert(
        //       'You have already signed up with a different auth provider for that email.',
        //     );
        //     // If you are using multiple auth providers on your app you should handle linking
        //     // the user's accounts here.
        //   } else {
        //     console.error(error);
        //   }
        //   setError(error)
        //   // ...
        // });
    // }  else {
    //   setError("signOut")
    //   signOut(auth);
    // }*/
    //}
  }

  
  return (
    <Button
        size="lg"
        leftIcon={<IconGoogleSvg/>}
        colorScheme="google"
        variant="outline"
        type="button"
        // height='48px'
        // width='200px'      
        // fontSize='16px' 
        
        onClick={GoogleSignIn}
    >   
        {mode === "signup"? "Sign up with Google" : "Sign in with Google"}
         
    </Button>
  );
}

export default ButtonGoogleAuth;