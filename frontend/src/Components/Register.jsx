import React, { Component, useState, useRef, useEffect } from 'react';
import axios from 'axios';

//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2

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

import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Navigate } from 'react-router-dom';


function Register() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const endpoint = 'http://localhost:8080/register';
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/dogood?u='); 

  
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


  // on change of input, set the value to the message state
  const onChange = event => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    }
    if (event.target.name === "password") {
      setPassword(event.target.value);
    }

    //setState({ [event.target.name]: event.target.value });
    //setMessage(event.target.value)
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const userData = localStorage.getItem("userData") ;
    console.log(userData);

    try {
      const res = await axios.post(endpoint, {
        username: username,
        password: password,
      });

      console.log('register', res);
      if (res.data.status) {
        // const redirectTo = redirectTo + username;
        setRedirect(true);
        setRedirectTo(redirectTo + username);
        //setState({ redirect: true, redirectTo });
      } else {
        // on failed
        setMessage(res.data.message)
        setIsInvalid(true)
        //setState({ message: res.data.message, isInvalid: true });
      }
    } catch (error) {
      console.log(error);
      setMessage('something went wrong')
      setIsInvalid(true)
    }
  };

  
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
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
      
      {redirect && (
        <Navigate to={redirectTo} replace={true}></Navigate>
      )}

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
        <Box borderRadius="lg" padding={10} borderWidth="2px">
          <Stack spacing={5}>
            
            <div ref={telegramWrapperRef}></div>
             
            <FormControl isInvalid={isInvalid}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={onChange}
              />

              {!isInvalid ? (
                <></>
              ) : (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
              <FormHelperText>use a unique username</FormHelperText> 
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
              <FormHelperText>use a dummy password</FormHelperText>
            </FormControl> 
            <Button
              size="lg"
              leftIcon={<EditIcon />}
              colorScheme="green"
              variant="solid"
              type="submit"
              onClick={onSubmit}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Container>
    </Container>
  );
}

export default Register;
