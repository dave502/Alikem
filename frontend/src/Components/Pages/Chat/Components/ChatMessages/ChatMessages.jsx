import React, { Component } from "react";
import Message from "./Message";
import { VStack, Button, Text, Container, Flex, Box, FormControl, FormLabel, Input, Spinner, useToast} from "@chakra-ui/react";
import AlertBox from './AlertBox.jsx';

export default function ChatMessages(props) {
  
  const { chatHistory, chatMembers, currentUserUid, refLastMessage, alertText } = props
  let messages = chatHistory.slice(-50);
  // FIX TO SHOW ALL MESSAGES DURING SCROLLNG 
  
  return ((messages)  &&
    <Box width='full' maxHeight='full' overflowY='auto' >
      { alertText && <AlertBox descritption={alertText} /> }
      {messages.map((msg) => 
         <Message Message={msg} currentUserUid={currentUserUid} fromUser={chatMembers?.get(msg.author)} key={msg.msg_id}/>    
      )}
      <div ref={refLastMessage} ></div>
    </Box>
  );
}


