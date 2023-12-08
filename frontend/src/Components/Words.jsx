import React, { Component, useState } from 'react';
import axios from 'axios';
import ResizeTextarea from "react-textarea-autosize";
import BeatLoader from "react-spinners/BeatLoader";
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

import {
  Textarea
} from '@chakra-ui/react'

import { Progress } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { Navigate } from 'react-router-dom';



function Words() {
  
  const [wordsCount, setWordsCount] = useState(0);
  const [words, setWords] = useState('');
  const [isReady, setIsReady] = useState(false);
  const endpoint = 'http://localhost:8080/register';
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/chat?u='); 
  

  
  const steps = [
    { title: ' 👋', description: 'Написать имя' },
    { title: '💖', description: 'Сделать добро' },
    { title: '💯', description: 'Написать слова' },
    { title: '🤗', description: 'Найти друзей!' },
  ]
  
  const { activeStep } = useSteps({
    index: 3,
    count: steps.length,
  })

  // on change of input, set the value to the message state
  // const onChange = event => {
  //   console.log(event.target.name )
  //   if (event.target.name === "username") {
  //     setUsername(event.target.value);
  //   }
  //   if (event.target.name === "password") {
  //     setPassword(event.target.value);
  //   }

    //setState({ [event.target.name]: event.target.value });
    //setMessage(event.target.value)
  //};

  const onSubmit = async e => {
    e.preventDefault();

    // try {
    //   const res = await axios.post(endpoint, {
    //     username: username,
    //     password: password,
    //   });

    //   console.log('register', res);
    //   if (res.data.status) {
    //     const redirectTo = redirectTo + username;
    //     setRedirect(true);
    //     setRedirectTo('');
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
    
  // on change of input, set the value to the message state
  const countWords = e => {
    console.log(wordsCount)
    let words_count = e.target.value.split(';').filter(s => s).length

    // var arr = str.split(",").map(function(item) {
    //   return item.trim();
    // });
    setWordsCount(words_count)
    setIsReady(words_count >= 100)
    setWords(e.target.value)
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
            <Progress colorScheme='green' size='sm' value={wordsCount} />
            <FormControl>
              <Textarea
                size='md'
                resize='vertical'
                value={words}
                onChange={countWords}
                placeholder='Напиши не меньше ста слов, разделяя их точкой с запятой'
                minRows={10}
                as={ResizeTextarea}
              />
            </FormControl>

            <Button
              {...(isReady ? {} : { isLoading: true })}
              loadingText={`${wordsCount}`}
              size="lg"
              leftIcon={<EditIcon />}
              colorScheme="green"
              variant="solid"
              type="submit"
              onClick={onSubmit}
              spinner={<BeatLoader size={8} color='white' />}
            >
              Готово
            </Button> 
            {/* <FormControl isInvalid={isInvalid}>
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
            </Button> */}
          </Stack>
        </Box>
      </Container>
    </Container>
  );
}

export default Words;
