import React, { Component } from "react";
import { useColorModeValue, Avatar, AvatarBadge, Text, Box, Flex, Spacer, VStack, HStack } from '@chakra-ui/react'


export default function Message(props) { 
  
  const { Message, fromUser, currentUserUid } = props;
  
  const bgMessage = useColorModeValue('green.50', 'darkslategrey')

  return (
    Message.author === currentUserUid 
    ?
    <Flex direction='row' spacing={4} flex={"end"}  m="3" gap='2'>
      <Spacer/>
      <Box maxW={['xs', 'sm']} borderWidth='1px' borderRadius='lg' 
          bg={bgMessage} alignSelf="start" pl='3' pr='3'>
        <Text fontSize='md' textAlign='left' m='0' mb='1'>{Message.text}</Text>
        <Text fontSize='2xs' textAlign='right' mb='0' color='darkgrey'>{new Date(Message.updated_at).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</Text>
      </Box>
      <Avatar>
        {/* <AvatarBadge boxSize='1.25em' bg='green.500' /> */}
      </Avatar>
    </Flex>
    :
    <Flex direction='row' spacing={4} flex={"end"} alignSelf="start" m="3" gap='2' textAlign='left'>
        <Flex direction='column' justify='end'>
          <Avatar />
        </Flex>
      <VStack alignItems='start'>
        <Text as='b' fontSize='md' >{fromUser?.name}</Text>
        <Box maxW={['xs', 'sm']} borderWidth='1px' borderRadius='lg' 
            bg={bgMessage} alignSelf="start" pl='3' pr='3'>
          <Text fontSize='md' textAlign='left' m='0' mb='1'>{Message.text}</Text>
          
          <Text fontSize='2xs' textAlign='left' mb='0' color='darkgrey'>{new Date(Message.updated_at).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</Text>
        </Box>
      </VStack>
      

      
       <Spacer/>
    </Flex>
  );

}
