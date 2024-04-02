import React, { useState, useEffect } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import { Wrap, WrapItem } from "@chakra-ui/react"
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
  
  const { data, loading, error } = useQuery(GET_ALL_INTERESTS);
  
  useEffect(() => {
    if (data) { 
      console.log("data", data.interests)
      setAllInterests(data.interests)
    }
  }, [data, loading, error]);
  
  const toggleInterest = (e) => {
    console.log("e.target", e.target)
    console.log("e.target.value", e.target.value)
    if (e.target.classList.contains("active")){
      e.target.classList.remove("active")
      setFieldValue('interests', field.value.filter(i => i !== e.target.value))
    } else {
      e.target.classList.add('active')

      setFieldValue('interests', [e.target.value, ...field.value])
    }
  }
  
  return (
    <Wrap justify="center">
    {allInterests.map(({interestID, interestName}) => (
      <WrapItem>
        <Tag 
          size='md' 
          key={interestID} 
          value={interestID} 
          variant={field.value?.includes(interestName)?'solid' :'outline'} 
          colorScheme='green'
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          className={field.value?.includes(interestName)?'active':''}
        >
        {interestName}
        </Tag>
        </WrapItem>
    ))}
    </Wrap>  
  );
};


