//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { EditIcon } from '@chakra-ui/icons';
import ButtonGoogleAuth from '../../Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from '../../Elements/ButtonEmailAuth/ButtonMailAuth';
import { varNeoUser } from '../../../variables';
// import TgUserAuth from "../../../Tools/tg_user_auth"
import './login.css';
import {
  Container,
  Divider,
  Box,
  Stack,
  Button,
  Center,
} from '@chakra-ui/react';


const GET_USER_QUERY = gql`
  query GetUser($uid: String){
    users(where: { uid : $uid }) {
      uid
      name
      img
      city
      location{
        latitude
        longitude
      }
      cityID
      birthday
      gender
      privateProfile
      approved
      goodDeedTime
      embeddingCreationTime
      name
    }
  }
`;


   
function Login(props) {
  

  const [googleUser, setGoogleUser] = useState('');
  const [loginError, setLoginError] = useState('');
  
  
  const { currentUser, login, setError, tgUserAuth } = useAuth();
  
  const telegramWrapperRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const neoUser = useReactiveVar(varNeoUser);
  
  const {auth} = props;
  
  const { loading: gqlUserLoading, 
    error: gqlUserError, 
    data: gqlUserData, 
    refetch: gqlGetUser} = 
    useQuery(GET_USER_QUERY, 
    {
      variables: { uid: currentUser?.uid },
    });
    
  
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
      
      const event = new Event('tg_user_logged');
      event.key = "user";
      event.value = user;
      document.dispatchEvent(event);
      // tgUserAuth(user);
      // window.tg_username = user.first_name
      // localStorage.setItem("userData", JSON.stringify(user));
    }
    const scriptElement2 = document.createElement('script');
    scriptElement2.type = 'text/javascript'
    scriptElement2.innerHTML = f;
    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement1);
      telegramWrapperRef.current.appendChild(scriptElement2);
    }
    document.addEventListener("tg_user_logged", getLoggedTelegramUser, false);
  }, [currentUser]);
  
  
  const getLoggedTelegramUser = (e) => {
    if (e.value) {
      tgUserAuth(e.value)
    }
  }
  
  console.log("Login Curr User 1", currentUser)
  
  useEffect(() => {
    console.log("Login Curr User 2 useEffect", currentUser)
    if (currentUser){
      console.log("Login Curr User 2 useEffect True", currentUser)
      gqlGetUser({ variables: { uid: currentUser.uid }})
        .then((response) => {
          if (response.data.users.length){
            
            varNeoUser(response.data.users[0])
            
            if (!response.data.users[0].embeddingCreationTime){
              navigate("/dogood");
            } else if (!response.data.users[0].embeddingCreationTime){
              navigate("/words");
            } else {
              navigate("/profile"); // navigate("/");
            }
          } else {
            // user is in firebase, but is absent in neo4j
            navigate("/register");
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, [currentUser, navigate]);

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
  
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // console.log("Name", user.getDisplayName())
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     // const uid = user.uid;
  //     // console.log("user", user)
  //     setGoogleUser(user)
      
  //     // ...
  //   } else {
  //     console.log("not user")
  //     //setUserAuthorized(false)
  //   }
  // });
  


  return (
    <Container maxW="3xl" marginTop="3rem" centerContent>

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
               
        <Box borderRadius="lg" padding={10} borderWidth="2px">
          
          <Stack spacing={5}>
            <Center>
              <div ref={telegramWrapperRef}></div>
            </Center>
            <Center >
              <ButtonGoogleAuth auth={auth} setUser={setGoogleUser} setError={setLoginError}/>
            </Center>
            <Center >
              <ButtonMailAuth auth={auth} mode="signin" />    
            </Center> 
            <Divider />
            <Center >
              <Link to="/register">
                <Button
                    size="sm"
                    leftIcon={<EditIcon/>}
                    colorScheme="green"
                    variant='link'
                >  {t("register")}
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
