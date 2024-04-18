import React, { useState } from 'react';
import { InputGroup, Input, InputRightElement, Button, Textarea, HStack } from '@chakra-ui/react'
import { MdSend } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";
import { useTranslation } from "react-i18next";



const Post = {
  text: '',
	chat_id: '',
  forwarded_from_chat_id: '',
  replied_to_msg_id: 0,
  author: '',
	created_at: '',
	updated_at: '',
	msg_id: 0,
  new: function (text, 
                chat_id, 
                user,
                forwarded_from_chat_id=null,
                replied_to_msg_id=null,) {
    const new_msg = Object.create(this);
    new_msg.text = text;
    new_msg.chat_id = chat_id;
    if (forwarded_from_chat_id) {
      new_msg.forwarded_from_chat_id = forwarded_from_chat_id;
    }
    if (replied_to_msg_id) {
      new_msg.replied_to_msg_id = replied_to_msg_id;
    }
    new_msg.author = user;
    new_msg.created_at = new Date();
    new_msg.updated_at = new Date();
    return new_msg;
  }
};


export default function PostInput(props) { 
  
  const { uid, socket } = props;
  const { t, i18n } = useTranslation();
  const [contentText, setContentText] = useState("")
  const [alertText, setAlertText] = useState("")
  
  const validText = (text) => {
    let clearText = String(text.replace(/^\s+|\s+$/g, ''));
    if (clearText.length === undefined || clearText.length === 0) {
      setContentText("")
      return false
    } 
    return true
  }
  
  const sendMessageByKeyboard = e => {
    if (e.key === "Enter" && e.shiftKey) { // ctrlKey
      e.preventDefault();
      sendPost();
    }
  };
  
  const sendPost = () => {
    
    if (!validText(contentText)) return;
    
    var post = Post.new(contentText, uid);
    
    try {
      if (socket.readyState === 3) {
        alert("WebSocket is already in CLOSING or CLOSED state.")
        return
      }
      socket.send(JSON.stringify(post))
    } catch (error) {
      setAlertText("Пост не удалось отправить. Обрыв соединения с сервером.")
    }

  }
  
  return (
    <InputGroup mb="20px">
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
            value={contentText}
            onChange={(input)=>setContentText(input.target.value)}
            placeholder={t("post")}
            _placeholder={{ color: 'seagreen' }}
            
            
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
          <Button h='2.5rem' size='sm' onClick={sendPost} mr='2'>
            <MdSend />
          </Button>
        </HStack>
      </HStack>
    </InputGroup>    
    
  );
};


