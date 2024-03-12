//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2
//https://firebase.google.com/docs/auth/web/google-signin?hl=ru

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { Navigate, Link } from 'react-router-dom';
import { EditIcon, ArrowRightIcon, } from '@chakra-ui/icons';
import ButtonGoogleAuth from '../../Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from '../../Elements/ButtonEmailAuth/ButtonMailAuth';
import { useAuth } from '../../Auth/AuthContext';
import { useTranslation } from "react-i18next";

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
  query GetUser($uid: String){
    users(where: { uid : $uid }) {
      uid
      approved
    }
  }
`;

const ADD_USER_QUERY = gql`
  # Add user
  mutation CreateUser( $uid: String!) {
    createUsers(input: 
      {
         uid: $uid
      }
    ) {
      info {
        nodesCreated
        },
      users {
        uid
      }
    }
  }
`;


function Register() {

  const { currentUser, signInWithToken, logout } = useAuth();

  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/dogood');
  const [readyToMoveOn, setReadyToMoveOn] = useState(false);
  const [resultEmailReg, setResultEmailReg] = useState(localStorage.getItem("email_confirmation"));
  const [resultGoogleReg, setResultGoogleReg] = useState();
  const [social, setSocial] = useState(localStorage.getItem("social_type"));
  
  const timerIdRef = useRef(null);
  const telegramWrapperRef = useRef(null);
  const { t } = useTranslation();
  
  const { loading: gqlUserLoading, 
          error: gqlUserError, 
          data: gqlUserData, 
          refetch: gqlGetUser} = 
        useQuery(GET_USER_QUERY, 
          {
            variables: { uid: currentUser?.uid },
          });
          
  const [gqlAddUser, { data, loading, error }] = useMutation(ADD_USER_QUERY);
    
  const steps = [
    { title: ' 👋' },
    { title: '💖' },
    { title: '💯' },
    { title: '🤗' },
  ]

  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const getLoggedTelegramUser = (e) => {

    // const tg_user = localStorage.getItem('userData')

    if (e.value) {
      const tg_user = e.value

      const additionalClaims = {
        displayName: tg_user.first_name,
        userName: tg_user.username,
        photoURL: tg_user.photo_url,
        userID: tg_user.id,
      };

      //axios.get("/get-jwt", {params: {uid: String(tg_user.id)}})
      axios.post("/auth/get-jwt", {
        "uid": String("tg::"+tg_user.id), "data": additionalClaims
      })//
        .then(res => {
          console.log("res.data.token", res.data.token)
          signInWithToken(res.data.token)
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
                "uid": String("tg::"+tg_user.id), "data": additionalUserInfo
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

    var f = function onTelegramAuth(currentUser) {
      // userData:"{"id":11111111,"first_name":"Name","last_name":"LN","username":"user",
      // "photo_url":"https://t.me/i/userpic/320/iii.jpg","auth_date":1705412178,
      //"hash":"ccca7316c251f430003270e4e4a4ab2adcd44abaa8215eaa3fd47440b97cff62"}"
      window.tg_username = currentUser.first_name
 
      const event = new Event('tg_user_logged');
      event.key = "user";
      event.value = currentUser;
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
  }, [currentUser]);

  
  useEffect(() => {
    setReadyToMoveOn(currentUser?.emailVerified)
  }, [currentUser?.emailVerified])


  const pollingCallback = () => {
    if (currentUser) {
      currentUser.reload()
        .then(user => {
          if (currentUser.emailVerified) {
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
        setMessage(t("wait_confirmation"))
        startPolling();
        break;
      case "verified":
        stopPolling();
        setMessage(t("got_confirmation"))
        localStorage.removeItem("email_confirmation")
        setReadyToMoveOn(true)
        break;
      case "cancelled":
        stopPolling();
        setMessage("");
        localStorage.removeItem("email_confirmation")
        break;
      default:
        stopPolling();
        setMessage("");
        localStorage.removeItem("email_confirmation");
    }
  }, [resultEmailReg])


  // useEffect(() => {

  //   const google_redirected = localStorage.getItem("catchGoogleRedirect");
  //   if (google_redirected) {

  //     getRedirectResult(Auth)
  //       .then((result) => {
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         //const details = getAdditionalUserInfo(result)
  //         const user = result.user;
  //       })
  //       .catch((error) => {
  //         setMessage(error)
  //         console.log("getRedirectResult error", error);
  //         // // Handle Errors here.
  //         // const errorCode = error.code;
  //         // const errorMessage = error.message;
  //         // // The email of the user's account used.
  //         // const email = error.customData.email;
  //         // // The AuthCredential type that was used.
  //         // const credential = GoogleAuthProvider.credentialFromError(error);
  //         // ...
  //       });
  //     //localStorage.removeItem("catchGoogleRedirect")
  //   }

  //   // // This gives you a Google Access Token. You can use it to access Google APIs.
  //   // const credential = GoogleAuthProvider.credentialFromResult(result);
  //   // const token = credential.accessToken;

  //   // // The signed-in user info.
  //   // const user = result.user;
  //   // // IdP data available using getAdditionalUserInfo(result)
  //   // // ...

  // }, [])

  async function ResetUser() {
    //if (social === "email") 
    setResultEmailReg("cancelled")   
    await logout()
    .catch(err => console.log("Failed to logout", JSON.stringify(err)) )
    localStorage.removeItem("social_type")
    setSocial(null)
  }

  const nextStep = async e => {
    e.preventDefault();

    gqlGetUser({ variables: { uid: currentUser.uid }})
    .then((resp) => {
      if (!resp.data.users.length){
        gqlAddUser({ variables: { uid: currentUser.uid }})
        .then((response) => {
          //console.log("gqlAddUser", response.data.createUsers.users[0])
        })
        .catch((error) => {
          console.log(error)
        });
      }
    })
    .catch((error) => {
      console.log(error)
    });
    
    setRedirect(true);
    setRedirectTo(redirectTo);
  }

  return (

    
    <Container maxW="3xl" marginTop="3rem" centerContent>
      
      {redirect && <Navigate to={redirectTo} replace={true} />}
      
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator  sx={{'--stepper-accent-color': 'colors.green.500'}}>
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
            {currentUser ?
              <Center>
                <Stack mb="5">
                <Center>
                    <Stack direction='row' mb="5">
                      {currentUser.photoURL &&
                        <Image
                          borderRadius='full'
                          boxSize='36px'
                          src={currentUser.photoURL}
                          alt=""
                        />}
                      <Text>{currentUser.email || currentUser.displayName}</Text>
                      <CloseButton
                        size="md"
                        ml={3}
                        onClick={ResetUser}
                      ></CloseButton>
                    </Stack>
                  </Center>
                  {(currentUser.email && !currentUser.emailVerified) &&
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
                  <ButtonGoogleAuth mode="signup" setUser={setUsername} setResult={setResultGoogleReg} />
                </Center>
                <Center >
                  <ButtonMailAuth mode="signup" setUser={setUsername} setResult={setResultEmailReg}/>
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
                  {t("next")}
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
