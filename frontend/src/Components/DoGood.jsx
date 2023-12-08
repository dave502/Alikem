import React, { Component, useState } from 'react';
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
import { Link } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter,  SimpleGrid, Heading, Text, Spacer, Flex} from '@chakra-ui/react'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Navigate } from 'react-router-dom';



function Register() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const endpoint = 'http://localhost:8080/register';
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/words?u='); 
  const [cardsFilter, setCardsFilter] = useState('')
  
    
  const steps = [
    { title: ' 👋', description: 'Написать имя' },
    { title: '💖', description: 'Сделать добро' },
    { title: '💯', description: 'Написать слова' },
    { title: '🤗', description: 'Найти друзей!' },
  ]
  
  const organisations = [
    {name: "Биосфера Балтики", description: "Центр реабилитации и реинтродукции диких животных", url: "https://balticbiosphere.ru"},
    {name: "Подари жизнь", description: "Благотворительный Фонд Помощи Детям.", url: "https://podari-zhizn.ru"},
    {name: "География Добра", description: "Благотворительный Фонд.", url: "https://geografiyadobra.ru/"},
    {name: "WorldVita", description: "Благотворительный Фонд Помощи Детям.", url: "https://worldvita.ru"},
  ]
  
  const { activeStep } = useSteps({
    index: 2,
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
    
  const handleCardsFilter = (event) => setCardsFilter(event.target.value.toLowerCase())
  
  const nextStep = async e => {
    e.preventDefault();

    // try {
    //   const res = await axios.post(endpoint, {
    //     username: username,
    //     password: password,
    //   });

    //   console.log('register', res);
    //   if (res.data.status) {
        setRedirect(true);
        setRedirectTo(redirectTo + username);
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
                active={<StepNumber />}
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
        <Input
          mb={3}
          value={cardsFilter}
          onChange={handleCardsFilter}
          placeholder='Поиск'
          _placeholder={{ color: 'seagreen' }}
        />
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {
          organisations
          .filter(({name}) => {
            const lcName = name.toLowerCase();
            return lcName.includes(cardsFilter) // || description.includes
          })
          .map(org => 
            <Card>
            <CardHeader>
              <Heading size='md'>{org.name}</Heading>
               <Link py='2' pos="bottom" fontSize="sm" href={org.url} isExternal>
                  {org.url} <ExternalLinkIcon mx='1px' />
               </Link>
            </CardHeader>
            <CardBody>
              <Flex>
                <Text fontSize='md'>{org.description}</Text>
                <Spacer />
              </Flex>
            </CardBody>
            <CardFooter>
              <Button onClick={nextStep}>Помочь</Button>
            </CardFooter>
          </Card>)
          // organisations.forEach(element => {
          //               <Card>
          //               <CardHeader>
          //                 <Heading size='md'>Подари жизнь</Heading>
          //               </CardHeader>
          //               <CardBody>
          //                 <Text fontSize='md'>Благотворительный Фонд Помощи Детям.</Text>
          //               </CardBody>
          //               <CardFooter>
          //                 <Button>View here</Button>
          //               </CardFooter>
          //             </Card>
          //   });
          }
        </SimpleGrid>
      </Container>
    </Container>
  );
}

export default Register;
