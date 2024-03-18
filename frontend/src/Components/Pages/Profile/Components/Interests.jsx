import React, { useState } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'
  
import { MdSend } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

const toggleInterest = (e) => {
  console.log("Tag click")
}


export default function Interests(props) { 
  
  const { send, chatID } = props;
  
  const [msgText, setMsgText] = useState("")
  
  return (
    <HStack spacing={4}>
    {['Music', 'Sport', 'Painting'].map((interest) => (
        <Tag size='md' key={interest} variant='solid' colorScheme='green' style={{ cursor: 'pointer' }} onClick={toggleInterest}>
        {interest}
        </Tag>
    ))}
    </HStack>  
  );
};


