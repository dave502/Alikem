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


export default function Interests(props) { 
  
  const { send, chatID } = props;
  
  const [msgText, setMsgText] = useState("")
  
  return (
    <HStack spacing={4}>
    {['sm', 'md', 'lg'].map((size) => (
        <Tag size={size} key={size} variant='solid' colorScheme='green' onClick={console.log("Tag click")}>
        Interest
        </Tag>
    ))}
    </HStack>  
  );
};


