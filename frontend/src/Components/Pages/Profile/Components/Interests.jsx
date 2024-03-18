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
  query Interests {
    interests {
      interestID
      interestName
    }
}
`; 
  
//


export default function Interests(props) { 
  
  const { field, setFieldValue } = props;
  const [allInterests, setAllInterests] = useState(['Music', 'Sport', 'Painting']);
  const [activeInterests, setActiveInterests] = useState(field.value || []);
  
  const { data, loading, error } = useQuery(GET_ALL_INTERESTS);
  
  useEffect(() => {
    if (data) { 
      console.log("data interests", data)
      setAllInterests(data.interests)
    }
  }, [data, loading, error]);
  
  useEffect(() => {
    if(field.value) {setActiveInterests(field.value)}
  }, [field.value]);
    
  const toggleInterest = (e) => {
    if (e.target.classList.contains("active")){
      e.target.classList.remove("active")
      setActiveInterests(activeInterests.filter(i => i !== e.target.textContent))
    } else {
      console.log("activeInterests", activeInterests)
      e.target.classList.add('active')
      setActiveInterests([e.target.textContent, ...activeInterests])
    }
    setFieldValue("interests", activeInterests)
  }
  
  return (
    <HStack spacing={4}>
    {allInterests.map(({interestID, interestName}) => (
        <Tag 
          size='md' 
          key={interestID} 
          variant={activeInterests?.includes(interestName)?'solid' :'outline'} 
          colorScheme='green'
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          className={activeInterests?.includes(interestName)?'active':'noactive'}
        >
        {interestName}
        </Tag>
    ))}
    </HStack>  
  );
};


