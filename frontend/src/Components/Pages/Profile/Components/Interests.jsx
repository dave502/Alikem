import React, { useState, useEffect } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'


export default function Interests(props) { 
  
  const { field, setFieldValue } = props;
  
  const [activeInterests, setActiveInterests] = useState(field.value);
  
  useEffect(() => {
    setActiveInterests(field.value)
  }, [field.value]);
    
  const toggleInterest = (e) => {
    if (e.target.classList.contains("active")){
      e.target.classList.remove("active")
      setActiveInterests(activeInterests.filter(i => i !== e.target.textContent))
    } else {
      e.target.classList.add('active')
      setActiveInterests((prev)=>[e.target.textContent, ...prev])
    }
    setFieldValue("interests", activeInterests)
  }
  
  return (
    <HStack spacing={4}>
    {['Music', 'Sport', 'Painting'].map((interest) => (
        <Tag 
          size='md' 
          key={interest} 
          variant={activeInterests.includes(interest)?'solid' :'outline'} 
          colorScheme='green'
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          className={activeInterests.includes(interest)?'active':'noactive'}
        >
        {interest}
        </Tag>
    ))}
    </HStack>  
  );
};


