//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2

import React, { Component, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gql, useQuery } from "@apollo/client";
import { Navigate,   Link } from 'react-router-dom';
import { onAuthStateChanged} from "firebase/auth";
import { EditIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ButtonGoogleAuth from './Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from './Elements/ButtonEmailAuth/ButtonMailAuth';
import {
  Container,
  Divider,
  Box,
  Stack,
  Button,
  Center,
} from '@chakra-ui/react';


const GET_USER_QUERY = gql`
  {
    users(where: {socialIDs_SINGLE:{social: $social, username: $username}}) {
      name
    }
  }
`;

   
function Login(props) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const endpoint = 'http://localhost:8080/register';
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/dogood?u='); 
  const [token, setToken] = useState(''); 
  const [googleUser, setGoogleUser] = useState('');
  const [error, setError] = useState('');
  
  const telegramWrapperRef = useRef(null);
  
  const {auth} = props;
  
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

    telegramWrapperRef.current.appendChild(scriptElement1);
    telegramWrapperRef.current.appendChild(scriptElement2);
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
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log("Name", user.getDisplayName())
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // const uid = user.uid;
      // console.log("user", user)
      setGoogleUser(user)
      // ...
    } else {
      console.log("not user")
      //setUserAuthorized(false)
    }
  });

  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
{/*       
      {redirect && (
        <Navigate to={redirectTo} replace={true}></Navigate>
      )} */}

      

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
        
        
        <Box borderRadius="lg" padding={10} borderWidth="2px">
          
          <Stack spacing={5}>
            <Center >
              <div ref={telegramWrapperRef}></div>
            </Center>
            <Center >
              <ButtonGoogleAuth auth={auth} setUser={setGoogleUser} setToken={setToken} setError={setError}/>
            </Center>
            <Center >
              <ButtonMailAuth/>    
            </Center> 
            <div>User: {googleUser}</div>
            <div>Token: {token}</div>
            <div>Error: {error}</div>
            <Divider />
            <Center >
              <Link to="/register">
                <Button
                    size="lg"
                    leftIcon={<EditIcon/>}
                    colorScheme="green"
                    //variant="solid"
                    //type="button"
                    // height='48px'
                    // width='200px'      
                    // fontSize='16px' 
                    //onClick={GoogleToggleSignIn}
                >  Register
                </Button>
              </Link>          
            </Center>
          </Stack>

        </Box>
      </Container>
    </Container>
  );
}

export default Login;
