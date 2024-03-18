import React, { useState, useEffect } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'
import { gql, useQuery } from "@apollo/client";

const GET_ALL_INTERESTS = gql`
query Interests()
{
  interests
  {
    groups {
      groupID
      groupName
      creatorUid
      directChat
    }
  }
}
`; 
  

export default function Interests(props) { 
  
  const { field, setFieldValue } = props;
  const [allInterests, setAllnterests] = useState(['Music', 'Sport', 'Painting']);
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
    {allInterests.map((interest) => (
        <Tag 
          size='md' 
          key={interest} 
          variant={activeInterests?.includes(interest)?'solid' :'outline'} 
          colorScheme='green'
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          className={activeInterests?.includes(interest)?'active':'noactive'}
        >
        {interest}
        </Tag>
    ))}
    </HStack>  
  );
};


