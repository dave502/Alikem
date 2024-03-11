import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { useTranslation } from "react-i18next";

import {
  Container,
  Box,
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
  
} from '@chakra-ui/react'


import { ArrowRightIcon, EditIcon } from '@chakra-ui/icons';
import { Navigate } from 'react-router-dom';
import WordsArea from '../../Elements/Words/WordsArea';


function Words(props) {

  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/profile'); 
  const navigate = useNavigate(); 
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();


  const steps = [
    { title: '👋'},
    { title: '💚'},
    { title: '💯'},
    { title: '💬'},
  ]
  
  const { activeStep } = useSteps({
    index: 2,
    count: steps.length,
  })
  
  useEffect(() => {
    if (!currentUser) {
      if (socket != null) {
        socket.close()
      }
      navigate("/login");
    }
    return
  }, [currentUser, navigate]);

  
  return (
    <Container maxW="3xl" marginTop="3rem" centerContent>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator sx={{'--stepper-accent-color': 'colors.green.500'}}>
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

        <WordsArea setReady={setRedirect} uid={currentUser.uid}/>
        
    </Container>
  );
}

export default Words;
