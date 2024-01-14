import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import Header from './Components/Header';
import Landing from './Components/Landing';
import Register from './Components/Register';
import Login from './Components/Login';
import Chat from './Components/Chat/Chat';
import Footer from './Components/Footer';
import Words from './Components/Words';
import DoGood from './Components/DoGood';
import Home from './Components/Home';

import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// theme.styles.global['font-family'] = 'roboto';
function App() {
  
  const [user, setUser] = useState('');
  
  const firebaseConfig = {
    apiKey: "AIzaSyCJ2L2s2-0ucV5nGe8SNW1LXjIMGuqotWc",
    authDomain: "friends-a2c14.firebaseapp.com",
    projectId: "friends-a2c14",
    storageBucket: "friends-a2c14.appspot.com",
    messagingSenderId: "161615978886",
    appId: "1:161615978886:web:e4788c9464ebae7a5d4c07",
    measurementId: "G-X8DKXH3C45"
  };

  
  const firebaseApp = initializeApp(firebaseConfig);
  const analytics = getAnalytics(firebaseApp);
  const firebaseAuth = getAuth(firebaseApp);
  //connectAuthEmulator(firebaseAuth, "http://localhost:3000");
  firebaseAuth.languageCode = 'ru';
  // auth.useDeviceLanguage();
  onAuthStateChanged(firebaseAuth, (user) => {
    setUser(user)
    console.log("AuthStateChanged", user)
  });  
  
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="right">
        <ColorModeSwitcher justifySelf="flex-end" />
      </Box>
      <Box textAlign="center" fontSize="xl">
        <BrowserRouter>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Home auth={firebaseAuth}/>} />
            <Route path="/register" element={<Register auth={firebaseAuth} user={user}/>} />
            <Route path="/login" element={<Login auth={firebaseAuth} user={user}/>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/words" element={<Words />} />
            <Route path="/dogood" element={<DoGood />} />
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
