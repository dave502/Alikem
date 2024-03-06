import React, { useState } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import { MdSend } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";


export default function ChatInput(props) { 
  
  const { send, chatID } = props;
  
  const [msgText, setMsgText] = useState("")
  
  const validkMsg = (text) => {
    let clearText = String(text.replace(/^\s+|\s+$/g, ''));
    if (clearText.length === undefined || clearText.length === 0) {
      setMsgText("")
      return false
    } 
    return true
  }
  
  const sendMessageByButton = () => {
    if (validkMsg(msgText)) {
      send(msgText, chatID)
      setMsgText("")
    }
  }
  
  const sendMessageByKeyboard = e => {
    if (e.key === "Enter" && e.shiftKey) { // ctrlKey
      e.preventDefault();
      if (validkMsg(msgText)) {
        send(msgText, chatID)
        setMsgText("")
      }
    }
  };
  
  return (
    <InputGroup>
      <HStack w="full">
      {/* style={{position: "fixed", bottom: "0"}} */}
      <Textarea
           minHeight="3vh"
           focusBorderColor='green.600' 
           css={{
            '&::-webkit-scrollbar': {
              width: '30',
            },
            '&::-webkit-scrollbar-track': {
              width: '60px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: "green",
              borderRadius: '24px',
            },
          }}
            size='md'
            resize='none'
            value={msgText}
            onChange={(input)=>setMsgText(input.target.value)}
            placeholder={`Сообщение`}
            maxRows={8}
            // minRows={1}
            ml='2'
            as={ResizeTextarea}
            onKeyDown={sendMessageByKeyboard}
          />
      {/* <Input
        pr='4.5rem'
        placeholder='Сообщение...'
        onKeyDown={handleSubmit}
        onChange={(input)=>setMsgText(input.target.value)}
        value={msgText}
      /> */}
        <HStack>
          <Button h='2.5rem' size='sm' onClick={sendMessageByButton} mr='2'>
            <MdSend />
          </Button>
        </HStack>
      </HStack>
    </InputGroup>    
    
  );
};


