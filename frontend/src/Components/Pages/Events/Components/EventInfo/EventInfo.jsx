import React, { useState, useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import BeatLoader from "react-spinners/BeatLoader";
import { useTranslation } from "react-i18next";
import {
    Container,
    FormControl,
    Textarea,
    Box,
    Progress,
    Stack,
    Button,
    Center,
  } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

function EventInfo(props) {
    
  const { setReady, uid, isDisabled } = props;
  const [wordsCount, setWordsCount] = useState(0);
  const [words, setWords] = useState('');
  const [isWordsEnough, setWordsEnough] = useState(false);
  const { t } = useTranslation();
  
 
  
  return (
    <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
  
  </Container>
  );
}

export default EventInfo;
