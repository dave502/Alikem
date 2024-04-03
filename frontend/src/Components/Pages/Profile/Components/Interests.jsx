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
      interestName
    }
}
`; 
  

export default function Interests(props) { 
  
  const { field, setFieldValue } = props;
  const [allInterests, setAllInterests] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  
  const { data, loading, error } = useQuery(GET_ALL_INTERESTS);
  
  console.log("Interests prop field", field.value)
  console.log("Interests allInterests", allInterests)
  
  useEffect(() => {
    if (data) { 
      setAllInterests(data.interests)
    }
  }, [data, loading, error]);
  
  useEffect(() => {
    if (field.value) { 
      const userInterestsIds = field.value.map(i => i.interestName)
      console.log("field.value", field.value)
      console.log("userInterestsIds", userInterestsIds)
      setUserInterests(userInterestsIds)
    }
  }, [field.value]);
  
  
  const toggleInterest = (e) => {
    if (e.target.classList.contains("active")){
      e.target.classList.remove("active")
      setFieldValue('interests', field.value.filter(i => i.interestName !== e.target.attributes.value.value))
    } else {
      e.target.classList.add('active')
      setFieldValue('interests', [
        allInterests.filter(i => i.interestName === e.target.attributes.value.value), ...field.value
      ])
      console.log([
        allInterests.filter(i => i.interestName === e.target.attributes.value.value), ...field.value
      ])
    }
  }
  
  return (
    <Wrap justify="center">
    {allInterests.map(({interestName}) => (
      <WrapItem>
        <Tag 
          size='md' 
          key={interestName} 
          value={interestName} 
          variant={userInterests.includes(interestName)?'solid' :'outline'} 
          colorScheme='green'
          style={{ cursor: 'pointer' }} 
          onClick={toggleInterest}
          className={userInterests.includes(interestName)?'active':''}
        >
        {interestName}
        </Tag>
        </WrapItem>
    ))}
    </Wrap>  
  );
};


