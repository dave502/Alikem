//import React, { Component, useState, useRef, useEffect } from 'react';
import { useState, useEffect } from 'react';
import IconMailSvg from "./IconMailSvg";
import { useAuth } from '../../Auth/AuthContext';
import {
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Box,
    Input,
    Button,
    Center,
  } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function ButtonMaillAuth(props) {
  
    const { mode, setResult} = props;
  
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalid, setIsInvalid] = useState('');
    const [message, setMessage] = useState('');
    const [visibleLogin, setVisibleLogin] = useState(false);
    
    const { login, register, verifyEmail, error } = useAuth();
    const { t } = useTranslation();  
    
    useEffect(() => {
      setVisibleLogin(false)
    }, [])
    
    useEffect(() => {
      if (error){
        setMessage(error)
      }
    }, [error])
    
    // const endpoint = 'http://localhost:8080/register';
    
    // on change of input, set the value to the message state
    const onChange = event => {
      if (event.target.name === "userEmail") {
        setUserEmail(event.target.value);
      }
      if (event.target.name === "password") {
        setPassword(event.target.value);
      }
    };

    const onSubmit = async e => {
      e.preventDefault();

      switch (mode) {
        case "signup":
          // https://firebase.google.com/docs/auth/custom-email-handler
          register(userEmail, password)
          .then((userCredential) => {
            // Signed up           
            verifyEmail()
            .then(() => {
              console.log("confirmation email is sent")
              setResult("wait")
              localStorage.setItem("email_confirmation", "wait") ;
            })
            .catch(function(error) {
              console.log("sendEmailVerification error", error)
            });
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use"){
              setMessage(t("email_exist"))
            }
            console.log(error.message)
            setIsInvalid(true)
          });
          break;
        case "signin":
          
          setError("");
          login(userEmail, password)
          .catch((error) => {
            if (error.message === "INVALID_EMAIL"){
              setMessage(t("invalid email"))
            }
            setIsInvalid(true)
          });
          break;
      }
    };
    
    const onChangeVisibleLogin = event => {
      setVisibleLogin(!visibleLogin)
    };
    
    return (
      <Container>
        <Center>
        <Button
            size="lg"
            minW='280px'
            leftIcon={<IconMailSvg/>}
            colorScheme="green"
            variant="outline"
            type="button"
            // height='48px'
            // width='200px'      
            // fontSize='16px' 
            
            onClick={onChangeVisibleLogin}
        >   
    
          {mode === "signup"? t("signup_via_email") : t("signin_via_email")}
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
                <FormLabel>{t("password")}</FormLabel>
              </Center>
              <Input
                type="password"
                placeholder={t("password")}
                name="password"
                value={password}
                onChange={onChange}
              />
              {/* <FormHelperText> hint </FormHelperText> */}
            </FormControl>  
            <Center pt="20px">
            <Button
              size="s"
              p='2'
              colorScheme="green"
              variant="solid"
              type="submit"
              onClick={onSubmit}
              fontSize='smaller'
            >
              {mode === "signup"? t("checking") : t("signin")}
              
            </Button>
            </Center>
          </Box>
        }
      </Container>
        
    );
}


export default ButtonMaillAuth;