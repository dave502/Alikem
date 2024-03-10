import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { gql, useMutation } from "@apollo/client";
import { useNavigate, useLocation  } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import {
  Container,
  Box,
  Input,
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


function DoGood(props) {

  const [cardsFilter, setCardsFilter] = useState('')
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const steps = [
    { title: ' 👋' },
    { title: '💖' },
    { title: '💯' },
    { title: '🤗' },
  ]
  
  const SET_USER_GOOD = gql`
  # add payment to user node
  mutation setUserGood($uid: String!, $fund: String!, $now: DateTime! ) {
    updateUsers(where: { uid: $uid }
                update: {
                  goodDeed: { create: { node: { 
                    fund: {connect: {where: {node: {name : $fund}}}},
                  } } }
                  goodDeedTime: $now
                }
    )
    {
      users {
        goodDeedTime
      }
    }
  }
`;
const [gqlSetUserGood, { data, loading, error }] = useMutation(SET_USER_GOOD);

  const organisations = [
    {name: "Биосфера Балтики", country: "ru", description: "Центр реабилитации и реинтродукции диких животных", url: "https://balticbiosphere.ru"},
    {name: "Дом-приют «Лохматые судьбы»", country: "ru", description: "Приют, помогающий обрести хозяев для кошек и собак", url: "https://lohmatiesudby.ru/"},
    {name: 'WWF',  country: "en", description: "The leading organization in wildlife conservation and endangered species.", url: "https://protect.worldwildlife.org/page/63250/donate/1"},
  ]
  
  const { activeStep } = useSteps({
    index: 1,
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

  // const onSubmit = async e => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post(endpoint, {
  //       username: username,
  //       password: password,
  //     });
  //     if (res.data.status) {
  //       // const redirectTo = redirectTo + username;
  //       setRedirect(true);
  //       setRedirectTo(redirectTo + username);
  //       //setState({ redirect: true, redirectTo });
  //     } else {
  //       // on failed
  //       setMessage(res.data.message)
  //       setIsInvalid(true)
  //       //setState({ message: res.data.message, isInvalid: true });
  //     }
  //   } catch (error) {
  //     setMessage('something went wrong')
  //     setIsInvalid(true)
  //   }
  // };
    
  const handleCardsFilter = (event) => setCardsFilter(event.target.value.toLowerCase())
  
  const nextStep = async e => {
    e.preventDefault();

    const today = new Date(Date.now());
    gqlSetUserGood({ variables: { uid: currentUser.uid, good: true, fund: "Биосфера Балтики", now: today}})
    .then((response) => {
      navigate("/words");
    })
    .catch((error) => {
      console.log(error)
    });
    // try {
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
  };
  
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator sx={{'--stepper-accent-color': 'colors.green.500'}}>
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

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
        <Input
          mb={3}
          value={cardsFilter}
          onChange={handleCardsFilter}
          placeholder={t("search")}
          _placeholder={{ color: 'seagreen' }}
        />
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {
          organisations
          .filter(({country}) => {
            return country === i18n.language 
          })
          .filter(({name}) => {
            const lcName = name.toLowerCase();
            return lcName.includes(cardsFilter) // || description.includes
          })
          .map(org => 
            <Card
              key={org.name}>
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
              <Button onClick={nextStep}>{t("do_good")}</Button>
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

export default DoGood;
