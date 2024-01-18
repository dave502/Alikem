//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2
//https://firebase.google.com/docs/auth/web/google-signin?hl=ru

import React, { Component, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { Navigate, Link } from 'react-router-dom';
import { EditIcon, CloseIcon, ExternalLinkIcon, ArrowRightIcon, } from '@chakra-ui/icons';
import ButtonGoogleAuth from './Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from './Elements/ButtonEmailAuth/ButtonMailAuth';
import { signOut, getRedirectResult, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';

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
  Image,
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

const GET_USER_QUERY = gql`
  query GetUser($social: String!, $uid: String){
    users(where: {socialIDs_SINGLE:{social: $social, uid: $uid}}) {
      userId
      approved
    }
  }
`;

const TEST = gql`
  query GetUser{
    User {
      name
    }
  }
`;

const ADD_USER_QUERY = gql`
  # Add user
  mutation CreateUser($social: String!, $uid: String!) {
    createUsers(input: [
      {
        socialIDs: {
          create: [
            {
              node: {
                social: $social,
                uid: $uid
              }
            }
          ]
        }
      }
    ]) {
      userId
    }
  }
`;


function Register(props) {

  const { auth, user } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/dogood/');
  const [token, setToken] = useState('');
  const [readyToMoveOn, setReadyToMoveOn] = useState(false);
  const [resultEmailReg, setResultEmailReg] = useState(localStorage.getItem("email_confirmation"));
  const [resultGoogleReg, setResultGoogleReg] = useState();
  const [social, setSocial] = useState(localStorage.getItem("social_type"));
  
  const timerIdRef = useRef(null);
  const telegramWrapperRef = useRef(null);
  
  const { loading: gqlUserLoading, 
          error: gqlUserError, 
          data: gqlUserData, 
          refetch: gqlGetUser} = 
        useQuery(GET_USER_QUERY, 
          {
            variables: { social: social, uid: user.email || user.uid },
          });
          
  const [gqlAddUser, { data, loading, error }] = useMutation(ADD_USER_QUERY);
  
  // const [getUser, { called, loading, data }] = useLazyQuery(
  //   GET_USER_QUERY,
  //   { variables: { social: social, username: user?.email || user?.uid } }
  // );
  // if ("user"){

  //   console.log("data: ", data);
  //   if (!data && social && (user.email || user.uid)){
  //     const { loading, error, data } = useQuery(ADD_USER_QUERY, {
  //         variables: { social: social, username: user.email || user.uid },
  //       });
  //   }
  // }
    
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

  const getLoggedTelegramUser = (e) => {

    // const tg_user = localStorage.getItem('userData')

    if (e.value) {
      const tg_user = e.value
      //setUserData(item)

      // data_check_string = ...
      // secret_key = SHA256(<bot_token>)
      // if (hex(HMAC_SHA256(data_check_string, secret_key)) == hash) {
      //   // data is from Telegram
      // }

      const additionalClaims = {
        displayName: tg_user.first_name,
        userName: tg_user.username,
        photoURL: tg_user.photo_url,
      };

      //axios.get("/get-jwt", {params: {uid: String(tg_user.id)}})
      axios.post("/auth/get-jwt", {
        "uid": String(tg_user.id), "data": additionalClaims
      })//
        .then(res => {
          signInWithCustomToken(auth, res.data.token)
            .then((userCredential) => {
              // Signed in
              // const user = userCredential.user;

              setSocial("telegram")
              localStorage.setItem("social_type", "telegram");

              const additionalUserInfo = {
                displayName: tg_user.first_name,
                emailVerified: true,
                photoURL: tg_user.photo_url,
              };
              axios.post("/auth/edit-user", {
                "uid": String(tg_user.id), "data": additionalUserInfo
              })
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(error.message)
            });
        })
        .catch((error) => {
          console.log('Error creating custom token:', error.message);
        });
    }
  }

  useEffect(() => {

    // https://medium.com/@alexawesome/telegram-oauth-authorization-for-your-site-6d527fe212ab

    const scriptElement1 = document.createElement('script');
    scriptElement1.src = 'https://telegram.org/js/telegram-widget.js?22';
    scriptElement1.setAttribute('data-telegram-login', 'my100friends_bot');
    scriptElement1.setAttribute('data-size', 'large');
    scriptElement1.setAttribute('data-radius', '6');
    scriptElement1.setAttribute('data-onauth', 'onTelegramAuth(user)');
    scriptElement1.setAttribute('data-request-access', 'write');
    scriptElement1.async = true;

    var f = function onTelegramAuth(user) {
      // userData:"{"id":180328814,"first_name":"Dave","last_name":"D","username":"dvtian","photo_url":"https://t.me/i/userpic/320/WomQcUiPJbED2F5gqoslqxg_p2BQ4IsRmjtDQavDgiM.jpg","auth_date":1705412178,"hash":"ccca7316c251f43c553270e4e4a4ab2adcd44abaa8215eaa3fd47440b97cff62"}"
      window.tg_username = user.first_name
      console.log('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
      //console.log(user.first_name)
      //localStorage.setItem("userData", JSON.stringify(user));

      const event = new Event('tg_user_logged');
      event.key = "user";
      event.value = user;
      document.dispatchEvent(event);
    }
    const scriptElement2 = document.createElement('script');
    scriptElement2.type = 'text/javascript'
    scriptElement2.innerHTML = f;
    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement1);
      telegramWrapperRef.current.appendChild(scriptElement2);
    }

    document.addEventListener("tg_user_logged", getLoggedTelegramUser, false);
  }, [user]);

  
  // //! listener for neo user
  // useEffect(() => {  
    
  //   if (called && loading)  console.log("Loading ...")
    
  //   console.log("loading", loading)
  //   console.log("called", called)
  //   console.log("data", data)
    
  //   if (!data){
      
  //   } 
    
  // }, [called, loading, data])
  
  useEffect(() => {
    setReadyToMoveOn(user?.emailVerified)
  }, [user?.emailVerified])


  const pollingCallback = () => {
    console.log('Polling...');
    if (auth.currentUser) {
      auth.currentUser.reload()
        .then(user => {
          console.log('emailVerified', auth.currentUser);
          if (auth.currentUser.emailVerified) {
            setResultEmailReg("verified")
            setSocial("email")
            localStorage.setItem("social_type", "email");
          }
        });
    }
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
        localStorage.removeItem("email_confirmation")
        setReadyToMoveOn(true)
        break;
      case "cancelled":
        stopPolling();
        setMessage("")
        localStorage.removeItem("email_confirmation")
        break;
      default:
        setMessage(resultEmailReg)
    }
  }, [resultEmailReg])


  useEffect(() => {
    
    // const { loading, error, data } = useQuery(TEST);
    // console.log(data)

    const google_redirected = localStorage.getItem("catchGoogleRedirect");
    if (google_redirected) {

      console.log("getRedirectResult start 111 !!!", auth);

      getRedirectResult(auth)
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
    if (social === "email") setResultEmailReg("cancelled")
    localStorage.removeItem("social_type")
    setSocial(null)
    signOut(auth)
  }

  const nextStep = async e => {
    e.preventDefault();

    
    // const { loading, error, data } = useQuery(GET_USER_QUERY, {
    //   variables: { social: social, username: user.email || user.uid },
    // });
    // getUser()
    gqlGetUser({ variables: { social: social, uid: user.email || user.uid }});
    gqlAddUser({ variables: { social: social, uid: user.email || user.uid }})
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    });
    
    // setRedirect(true);
    // setRedirectTo(redirectTo);
  }

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
            {user ?
              <Center>
                <Stack mb="5">
                <Center>
                    <Stack direction='row' mb="5">
                      {user.photoURL &&
                        <Image
                          borderRadius='full'
                          boxSize='36px'
                          src={user.photoURL}
                          alt=""
                        />}
                      <Text>{user.email || user.displayName + " (" + user.uid + ")"}</Text>
                      <CloseButton
                        size="md"
                        ml={3}
                        onClick={ResetUser}
                      ></CloseButton>
                    </Stack>
                  </Center>
                  {(user.email && !user.emailVerified) &&
                    <Alert status='success' size="sm">
                      <AlertIcon />
                      <AlertDescription fontSize='md'>
                        {message}
                      </AlertDescription>
                    </Alert>}
                </Stack>
              </Center>
              :
              <>
                <Center >
                  <div ref={telegramWrapperRef}></div>
                </Center>
                <Center >
                  <ButtonGoogleAuth auth={auth} mode="signup" setUser={setUsername} setResult={setResultGoogleReg} />
                </Center>
                <Center >
                  <ButtonMailAuth auth={auth} mode="signup" setUser={setUsername} setResult={setResultEmailReg} />
                </Center>
                <Divider />
              </>
            }

            <Center >
              <Link to="/register">
                <Button
                  size="lg"
                  rightIcon={<ArrowRightIcon />}
                  colorScheme="green"
                  isDisabled={!readyToMoveOn}
                  isLoading={resultEmailReg === "wait" ? true : false}
                  loadingText='Waiting...'
                  onClick={nextStep}
                >
                  Дальше
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
