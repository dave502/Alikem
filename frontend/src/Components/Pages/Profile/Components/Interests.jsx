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
  
  const [activeInterests, setActiveInterests] = useState([])
    
  const toggleInterest = (e) => {
    console.log("Tag click", e.target.textContent)
    setActiveInterests((prev)=>[e.target.textContent, ...prev])
  }
  
  return (
    <HStack spacing={4}>
    {['Music', 'Sport', 'Painting'].map((interest) => (
        <Tag 
          size='md' 
          key={interest} 
          variant='solid' 
          colorScheme={activeInterests.includes(interest)?'green':'grey'} 
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          class='interestActive'
        >
        {interest}
        </Tag>
    ))}
    </HStack>  
  );
};


