//import React, { Component, useState, useRef, useEffect } from 'react';
import { useState, useEffect } from 'react';
import IconMailSvg from "./IconMailSvg";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import axios from 'axios';
import {
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Box,
    Input,
    Stack,
    Button,
    Link,
    Center,
  } from '@chakra-ui/react';


function ButtonMaillAuth(props) {
  
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalid, setIsInvalid] = useState('');
    const [message, setMessage] = useState('');
    const [visibleLogin, setVisibleLogin] = useState(false);
    // const [redirect, setRedirect] = useState(false); 
    // const [redirectTo, setRedirectTo] = useState('/dogood?u='); 
    
    const { auth, mode, setResult} = props;
    
    useEffect(() => {
      setVisibleLogin(false)
    }, [])
    
    const endpoint = 'http://localhost:8080/register';
    
    // on change of input, set the value to the message state
    const onChange = event => {
      if (event.target.name === "userEmail") {
        setUserEmail(event.target.value);
      }
      if (event.target.name === "password") {
        setPassword(event.target.value);
      }
  
      //setState({ [event.target.name]: event.target.value });
      //setMessage(event.target.value)
    };

    const onSubmit = async e => {
      e.preventDefault();

      switch (mode) {
        case "signup":
          // https://firebase.google.com/docs/auth/custom-email-handler
          createUserWithEmailAndPassword(auth, userEmail, password)
          .then((userCredential) => {
            // Signed up 
            //var actionCodeSettings = {
              //url: 'tes/registration?email=' + userEmail,
              // iOS: {
              //   bundleId: 'com.example.ios'
              // },
              // android: {
              //   packageName: 'com.example.android',
              //   installApp: true,
              //   minimumVersion: '12'
              // },
              //handleCodeInApp: false,
              // When multiple custom dynamic link domains are defined, specify which
              // one to use.
              //dynamicLinkDomain: "example.page.link"
            //};
            
            sendEmailVerification(userCredential.user)
            .then(() => {
              console.log("confirmation email is sent")
              setResult("wait")
              //setUser(userCredential.user)
            })
            .catch(function(error) {
              console.log("sendEmailVerification error", error)
            });
            // userCredential.user.
            // setUser(userCredential.user)
            // const user = userCredential.user;
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (error.code === "auth/email-already-in-use"){
              setMessage("Тcbvcxb")
            }
            console.log(error)
            setIsInvalid(true)
            //setMessage(error.code)
            // ..
          });
          break;
        case "signin":
          signInWithEmailAndPassword(auth, userEmail, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
          })
          .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            setIsInvalid(true)
            setMessage(error.code)
          });
          break;
      }
      // const userData = localStorage.getItem("userData") ;
      // console.log(userData);

      // try {
      //   const res = await axios.post(endpoint, {
      //     userEmail: userEmail,
      //     password: password,
      //   });

      //   console.log('register', res);
      //   if (res.data.status) {
      //     // const redirectTo = redirectTo + userEmail;
      //     setRedirect(true);
      //     setRedirectTo(redirectTo + userEmail);
      //     //setState({ redirect: true, redirectTo });
      //   } else {
      //     // on failed
      //     setMessage(res.data.message)
      //     setIsInvalid(true)
      //     //setState({ message: res.data.message, isInvalid: true });
      //   }
      // } catch (error) {
      //   console.log(error);
      //   setMessage('something went wrong')
      //   setIsInvalid(true)
      // }
    };
    
    const onChangeVisibleLogin = event => {
      setVisibleLogin(!visibleLogin)
    };
    
    return (
      <Container>
        <Center>
        <Button
            size="lg"
            leftIcon={<IconMailSvg/>}
            colorScheme="green"
            variant="outline"
            type="button"
            // height='48px'
            // width='200px'      
            // fontSize='16px' 
            
            onClick={onChangeVisibleLogin}
        >   
    
          {mode === "signup"? "Sign up with Email" : "Sign in with Email"}
        </Button>
        </Center>
        { visibleLogin &&
          <Box pt="20px">

            <FormControl isInvalid={isInvalid}>
              <Center>
                <FormLabel>Email</FormLabel>
              </Center>
              <Input
                type="text"
                placeholder="Email"
                name="userEmail"
                value={userEmail}
                onChange={onChange}
              />

              {!isInvalid ? (
                <></>
              ) : (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
              {/* <Center>
                <FormHelperText>use a unique userEmail</FormHelperText> 
              </Center> */}
            </FormControl>
            
            <FormControl>
              <Center>
                <FormLabel>Password</FormLabel>
              </Center>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
              {/* <FormHelperText>use a dummy password</FormHelperText> */}
            </FormControl>  
            <Center pt="20px">
            <Button
              size="lg"
              //leftIcon={<EditIcon />}
              colorScheme="green"
              variant="solid"
              type="submit"
              onClick={onSubmit}
            >
              {mode === "signup"? "Verify" : "Sign in"}
              
            </Button>
            </Center>
          </Box>
        }
      </Container>
        
    );
}


export default ButtonMaillAuth;