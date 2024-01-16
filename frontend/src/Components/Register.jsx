//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2

import React, { Component, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gql, useQuery } from "@apollo/client";
import { Navigate,   Link } from 'react-router-dom';
import { EditIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ButtonGoogleAuth from './Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from './Elements/ButtonEmailAuth/ButtonMailAuth';
import { signOut, getRedirectResult, GoogleAuthProvider , getAuth } from 'firebase/auth';

import {
  Container,
  Divider,
  Box,
  Stack,
  Button,
  CloseButton,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from '@chakra-ui/react';

import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'

import { initializeApp } from "firebase/app";

const GET_USER_QUERY = gql`
  {
    users(where: {socialIDs_SINGLE:{social: $social, username: $username}}) {
      name
    }
  }
`;
  
function Register(props) {
  
  //const { auth, user } = props;
  const { firebaseConfig } = props;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const endpoint = 'http://localhost:8080/register';
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/dogood/'); 
  const [token, setToken] = useState(''); 
  const [error, setError] = useState('');
  const [readyToMoveOn, setReadyToMoveOn] = useState(false);
  const [resultEmailReg, setResultEmailReg] = useState();
  const [resultGoogleReg, setResultGoogleReg] = useState();
  
  const [auth, setAuth] = useState();
  
  
  const timerIdRef = useRef(null);
  const telegramWrapperRef = useRef(null);
  
  const steps = [
    { title: ' 👋', description: 'Написать имя' },
    { title: '💖', description: 'Сделать добро' },
    { title: '💯', description: 'Написать слова' },
    { title: '🤗', description: 'Найти друзей!' },
  ]
  
  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  
  // useEffect(() => {
  //   const firebaseApp = initializeApp(firebaseConfig);
  //   //const analytics = getAnalytics(firebaseApp);
  //   const firebaseAuth = getAuth(firebaseApp);
  //   firebaseAuth.languageCode = 'ru';
  //   setAuth(firebaseAuth)
  //   //console.log("firebaseApp", auth);
  //   //connectAuthEmulator(firebaseAuth, "http://localhost:3000");
  // }, []);
  const user = null;
  
  useEffect(() => {
    
    const scriptElement1 = document.createElement('script');
    scriptElement1.src = 'https://telegram.org/js/telegram-widget.js?22';
    scriptElement1.setAttribute('data-telegram-login', 'my100friends_bot');
    scriptElement1.setAttribute('data-size', 'large');
    scriptElement1.setAttribute('data-radius', '6');
    scriptElement1.setAttribute('data-onauth', 'onTelegramAuth(user)');
    scriptElement1.setAttribute('data-request-access', 'write');
    scriptElement1.async = true;
    
    var f = function onTelegramAuth(user) {

      window.tg_username = user.first_name
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
      console.log(user.first_name)
      localStorage.setItem("userData", JSON.stringify(user));
      
    }
    const scriptElement2 = document.createElement('script');
    scriptElement2.type = 'text/javascript'
    scriptElement2.innerHTML = f;
    if (telegramWrapperRef.current){
      telegramWrapperRef.current.appendChild(scriptElement1);
      telegramWrapperRef.current.appendChild(scriptElement2);
    }
  }, []);
  
  //! listener for local storage
  // useEffect(() => {
  //   function checkUserData() {
  //     const item = localStorage.getItem('userData')
  
  //     if (item) {
  //       setUserData(item)
  //     }
  //   }
  
  //   window.addEventListener('storage', checkUserData)
  
  //   return () => {
  //     window.removeEventListener('storage', checkUserData)
  //   }
  // }, [])
  
  useEffect(() => {
    setReadyToMoveOn(user?.emailVerified)
    console.log("user.emailVerified", user?.emailVerified)
  }, [user?.emailVerified])
  
  
  const pollingCallback = () => {
    // Your polling logic here
    console.log('Polling...');

    user.reload()
    .then(user => {
      console.log('emailVerified', auth.currentUser);
      if (auth.currentUser.emailVerified){
        setResultEmailReg("verified")
        setReadyToMoveOn(true)
      }
    });
  };
  
  const startPolling = () => {
    timerIdRef.current = setInterval(pollingCallback, 2000);
  };

  const stopPolling = () => {
    clearInterval(timerIdRef.current);
  };
  
  useEffect(() => {

    switch (resultEmailReg) {
      case "wait":    
        setMessage("Ожидание подтверждения email")
        startPolling();
        break;
      case "verified":    
        stopPolling();
        setMessage("Подтверждение получено")
        break;
      default:
        setMessage(resultEmailReg)
    }
    // switch (resultGoogleReg) {
    //   case "logged":    
    //     setMessage("Ожидание подтверждения email")
    //     startPolling();
    //     break;
    //   case "verified":    
    //     stopPolling();
    //     setMessage("Подтверждение получено")
    //     break;
    //   case "google_redirected":    
    //     //setMessage("Подтверждение получено")
    //     console.log('!!!!!!!!!!!!!!!!!!!!!');
    //     break;  
    //   default:
    //     setMessage(resultGoogleReg)
    // }
    // console.log("resultGoogleReg!!!!!!!!!!!!", resultGoogleReg)
  }, [resultEmailReg])
  
  
  useEffect(() => {
    
    const firebaseApp = initializeApp(firebaseConfig);
    //const analytics = getAnalytics(firebaseApp);
    const firebaseAuth = getAuth(firebaseApp);
    firebaseAuth.languageCode = 'ru';
    setAuth(firebaseAuth)
    
    const google_redirected = localStorage.getItem("catchGoogleRedirect");
    if (google_redirected){

      console.log("getRedirectResult start 111 !!!", firebaseApp);

      getRedirectResult(firebaseApp)
      .then((result) => {
        console.log("getRedirectResult result", result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        //const details = getAdditionalUserInfo(result)
        console.log("getRedirectResult credential", credential);

        const user = result.user;
        console.log("getRedirectResult user", user);
      })
      .catch((error) => {
        setMessage(error)
        console.log("getRedirectResult error", error);
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      //localStorage.removeItem("catchGoogleRedirect")
    }
    
  
        //console.log('result.user', result.user);
        // // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // // The signed-in user info.
        // const user = result.user;
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
      
  }, [])
  
  function ResetUser() {
    signOut(auth)
  }
  
  const nextStep = async e => {
    e.preventDefault();

    // if (!user.emailVerified){
    //   user.reload()
    //   .then(user => {
    //     console.log('emailVerified', user);
    //   });
    // try 
    //   const res = await axios.post(endpoint, {
    //     username: username,
    //     password: password,
    //   });

    //   console.log('register', res);
    //   if (res.data.status) {

    //   } else {
    //     // on failed
    //     setMessage(res.data.message)
    //     setIsInvalid(true)
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setMessage('something went wrong')
    //   setIsInvalid(true)
    // }
    // } else {
      setRedirect(true);
      setRedirectTo(redirectTo);
        
      //};
      console.log(user);
    }


  
  //console.log("auth.currentUser", auth.currentUser)
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
      
      {redirect && (
        <Navigate to={redirectTo} replace={true}></Navigate>
      )}
      
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<EditIcon />}
              />
            </StepIndicator>

            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
        <Box borderRadius="lg" padding={10} borderWidth="2px">
          <Stack spacing={5}>

           { user ? 
            <Box>
                <Stack direction='row' mb="5">
                  <Text>{ user.email }</Text>
                  <CloseButton
                    size="sm"            
                    ml={5}
                    onClick={ResetUser}
                  ></CloseButton>
                </Stack>

                {!user.emailVerified && 
                <Alert status='success' size="sm">
                  <AlertIcon />
                  <AlertDescription fontSize='md'>
                    {message}
                  </AlertDescription>
                </Alert>}
              </Box>
            :
              <>
                <Center >
                  <div ref={telegramWrapperRef}></div>
                </Center>
                <Center >
                  <ButtonGoogleAuth auth={auth} mode="signup" setUser={setUsername} setResult={setResultGoogleReg}/>
                </Center>
                <Center >
                  <ButtonMailAuth auth={auth} mode="signup" setUser={setUsername} setResult={setResultEmailReg}/>    
                </Center> 
                <Divider />
              </>
            }
            <Center >
              <Link to="/register">
                <Button
                    size="lg"
                    leftIcon={<EditIcon/>}
                    colorScheme="green"
                    isDisabled={!readyToMoveOn}
                    isLoading={resultEmailReg === "wait" ? true:false}
                    loadingText='Waiting...'
                    onClick={nextStep}
                >  
                Sign up
                </Button>
              </Link>          
            </Center>
          </Stack>
            
            
        </Box>
      </Container> 
    </Container>
  );
}

export default Register;
