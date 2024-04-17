import React, {useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/Auth/AuthContext';
import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from './theme';
import "./i18n";

import Header from './Components/Elements/Header/Header';
import Register from './Components/Pages/Register/Register';
import Login from './Components/Pages/Login/Login';
import Chat from './Components/Pages/Chat/Chat';
import Footer from './Components/Elements/Footer/Footer';
import Words from './Components/Pages/Register/Words';
import DoGood from './Components/Pages/Register/DoGood';
import Profile from './Components/Pages/Profile/Profile';
import Friends from './Components/Pages/Friends/Friends';
import ViewProfile from './Components/Pages/Friends/Components/ViewProfile';
import CookieConsentBottom from "./Tools/cookie_consent"
import Events from './Components/Pages/Events/Events';
import Foundations from './Components/Pages/Foundations/Foundations';


// import auth from './Configs/firebase';
// import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
// import NeoUser from './Components/Elements/Header/NeoUser';
// theme.styles.global['font-family'] = 'roboto';

function App() {
  
  // const [user, setUser] = useState('');
 
  // const google_redirected = localStorage.getItem("catchGoogleRedirect");
  // if (google_redirected){
  //   console.log("App google_redirected");
  //   getRedirectResult(firebaseAuth)
  //   .then((result) => {
  //     console.log("App test result", result);
  //     const user = result.user;
  //     console.log("App test user", user);
  //   })
  //   .catch((error) => {
  //     console.log("App test error", error);
  //     // // Handle Errors here.
  //     // const errorCode = error.code;
  //     // const errorMessage = error.message;
  //     // // The email of the user's account used.
  //     // const email = error.customData.email;
  //     // // The AuthCredential type that was used.
  //     // const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   })
  //   .finally(() => {
  //     console.log("getRedirectResult finally called");
  //  });
  // }
  
  // onAuthStateChanged(firebaseAuth, (user) => {
  //   setUser(user)
  // });  
  const user = null;
  const firebaseAuth = null;
  
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
      <Box textAlign="center" fontSize="xl">
        <BrowserRouter>
          <Header auth={firebaseAuth} user={user}/>
          <CookieConsentBottom/>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace/>}/>
            <Route path="/register" element={<Register auth={firebaseAuth} user={user}/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/words" element={<Words user={user}/>} />
            <Route path="/dogood" element={<DoGood user={user}/>} />
            <Route path="/profile" element={<Profile auth={firebaseAuth} user={user}/>} />
            <Route path="/friends" element={<Friends auth={firebaseAuth} user={user}/>} />
            <Route path="/viewprofile" element={<ViewProfile/>} />
            <Route path="/events" element={<Events/>} />
            <Route path="/foundations" element={<Foundations/>} />
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </Box>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
