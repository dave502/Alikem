import React, { useState, useSize, useEffect, useRef } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import ChatMessages from './Components/ChatMessages/ChatMessages.jsx';
import ChatMembers from './Components/ChatMembers/ChatMembers.jsx';
import ChatMemberInfo from './Components/ChatMembers/ChatMemberInfo.jsx'
import ChatInput from './Components/ChatInput/ChatInput.jsx';
import ChatList from './Components/ChatList/ChatList.jsx';
// https://uiwjs.github.io/react-split/
import { Button as BarButton, DateInput, Split } from 'uiw';
import { websocket } from './Tools/websocket.js';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { HamburgerIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Text, Container, Flex, Box, Center, Spacer, VStack, useColorModeValue } from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react'
import { useTranslation } from "react-i18next";



const Message = {
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


export default function Chat(props) {

  const breakpoint = 700;
  const full = window.innerWidth > breakpoint;
  const [chatHistory, setChatHistory] = useState([]);
  const [jwtToken, setJwtToken] = useState("");
  const [currentChatID, setCurrentChatID] = useState(null);
  const [currentGroupName, setCurrentGroupName] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(full?'15%':'100%');
  const [alertText, setAlertText] = useState('');
  const [socket, setSocket] = useState();
  const [newMessageData, setNewMessageData] = useState();
  const [directChat, setDirectChat] = useState(false);
  const [currentGroupMembers, setCurrentGroupMembers] = useState();
  
  const refLastMessage = useRef();
  const navigate = useNavigate();
  const { currentUser, setError } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  const wsChatURL = "/wschat"
  
  const scrollToLastMessage = () => {
    refLastMessage.current?.scrollIntoView({ behavior: "smooth" })
  }  
 
  
  useEffect(() => {
    if (!currentUser) {
      if (socket != null) {
        socket.close()
      }
      navigate("/login");
    }
    return
  }, [currentUser, navigate]);
  
  useEffect(() => {
    setSocket(websocket(setNewMessageData, jwtToken));
    scrollToLastMessage();

    // chatSocket.onmessage = (e) => {
    //   var data = JSON.parse(e.data)
    //   // ...
    // }
    // return function cleanup() {
    //   // de-register the socket event
    // }
  }, [])
  
  useEffect(() => {
    const {state} = location;
    if (state) {
      
      if (state.type === "direct"){
        setDirectChat(true);
        setCurrentChatID(state.members.join(':'));
        setCurrentGroupName(state.to);
        // setCurrentGroupMembers(new Map([['']]));
      } else {
        setDirectChat(false);
      }
    } else {
      setDirectChat(false);
    }
  }, [location]) 

  
  useEffect(() => {
    if(newMessageData){
      newMessage(newMessageData)
      setNewMessageData(null)
    }
  }, [newMessageData])
  
  useEffect(() => {
    if(currentChatID){
      setChatHistory([]);
      preloadChatHistory(currentChatID); 
      scrollToLastMessage();   
    }
    
  }, [currentChatID])
  
  // useEffect(() => {

  //   scrollToLastMessage()
  // }, [chatHistory])

  
  const handleSendMessage = (text, chatID) => {
    
    var msg = Message.new(text, chatID, currentUser.uid);
    sendMessage(msg);
  }  
  
  const handleGroupClicked = ({ GroupName, GroupID }) => {
    setCurrentChatID(GroupID)
    setCurrentGroupName(GroupName)
    navigate(location.pathname, {}); // to clear Location state with chat ID
  }

  const preloadChatHistory = (chatID) => {
    // fetch list of chats
    const apiUrl = `${wsChatURL}/v1/api/chat/messages`;
    
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        params: {
          chat_id: chatID, 
        }
      },)
      .then((response) => {
        const data = response.data;
        try {
          setChatHistory([...data.Messages])
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        setAlertText(error.message)
      });
  }

  const newMessage = ({data}) => {
    try {
      
      const objData = JSON.parse(data);
      
      if (objData.Info === undefined || objData?.Info !== "msg recieved" ) return; 
        
      if (objData.Type === 1) {
        
        const msg = objData.Message;
        if (currentChatID === msg.chat_id){
          
          setChatHistory((prev) => [...prev, msg])
          scrollToLastMessage()     
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const sendMessage = (chatMessage) => {
    
    try {
      if (socket.readyState === 3) {
        alert("WebSocket is already in CLOSING or CLOSED state.")
        return
      }
      socket.send(JSON.stringify(chatMessage))
    } catch (error) {
      setAlertText("Сообщение не удалось отправить. Обрыв соединения с сервером.")
    }

  }
  
  const ToggleGroupListPanel = () => {
    setLeftPanelWidth(leftPanelWidth === 0 ? '15%' : 0)
  }
  
  const bgMsgListBar = useColorModeValue('green.50', 'darkslategrey');
 
  
  console.log("leftPanelWidth", leftPanelWidth, (!full && leftPanelWidth === 0) )
  
  return (
    currentUser&&
    <Box  style={{ height:'calc(810 - 64px)' }}> 
      {/* //'calc(100vh - 64px)'}}>
      {showCreateChatDialog && 
        <CreateChatDialog opened={setShowCreateChatDialog} user={currentUser} setRefreshChatList={setRefreshChatList}/>
      } */}

        <Split 
          // lineBar visible={leftPanelWidth !== 0}
          // renderBar={({ onMouseDown, ...props }) => {
          //   return (
          //     <div {...props} style={{ maxWidth:'2px', boxShadow: 'none', background: 'transparent', zIndex:'1000'}}>
          //       <div onMouseDown={onMouseDown} style={{ backgroundColor: '#2f855a', boxShadow: 'none' }} />
          //     </div>
          //   );
          // }}
          // style={{ height: "100hv", borderBottom: '3px solid #2F855A', borderRadius: 3 }}
          
        >
         
          <Box style={{ width: leftPanelWidth, minWidth: leftPanelWidth, overflow: 'hidden' }}>
            <ChatList 
              // chatsList={chatsList} 
              // setChatsList={setChatsList} 
              handleGroupClicked={handleGroupClicked} 
              // resetRefresh={setRefreshChatList}
              // refresh={refreshChatList}
              />
          </Box>


          {((!full && leftPanelWidth === 0) || full) && <Box minWidth={[900, "full"]} style={{ flex: 1}}>
          <Flex
              as="nav"
              align="center"
              justify="space-between"
              wrap="wrap"
              w="100%"
              bg={bgMsgListBar}
              maxH='40px'
            >
              <BarButton type='basic' style={{ color: "green"}} onClick={ToggleGroupListPanel}>
                {leftPanelWidth ? <ArrowLeftIcon />: <ArrowRightIcon />}
              </BarButton>
              <Text alignSelf='center' m='0'>
                {currentGroupName}
              </Text>
              {/*<Menu>
                <MenuButton
                  as={IconButton}
                  aria-label='Options'
                  icon={<HamburgerIcon />}
                  variant='outline'
                />
                 <MenuList>
                  <MenuItem icon={<HamburgerIcon />} command='⌘T' onClick={() => {}}>
                    New Chat
                  </MenuItem>
                  <MenuItem icon={<HamburgerIcon />} command='⌘N'>
                    Leave chat
                  </MenuItem>
                  <MenuItem icon={<HamburgerIcon />} command='⌘⇧N'>
                    Settings
                  </MenuItem>
                  <MenuItem  command='⌘O'> 
                    Delete Chat
                  </MenuItem>
                </MenuList> 
              </Menu>*/}
            </Flex>
            {/* { (currentChatID !== null) &&
              <VStack  style={{ height: 'calc(100vh - 110px)'}}>
                <ChatMessages 
                  chatHistory={chatHistory} 
                  currentUserUid={currentUser.uid} 
                  chatID={currentChatID} 
                  refLastMessage={refLastMessage}
                  alertText={alertText}
                  chatMembers={currentGroupMembers}
                  />
                <Spacer />
                <ChatInput send={handleSendMessage} chatID={currentChatID}/>
              </VStack>
            }  */}
          </Box>}
          {/* { (currentChatID !== null && !directChat) &&
          <Box style={{ width: leftPanelWidth, minWidth: leftPanelWidth, overflow: 'hidden' }}>
            <ChatMembers chatID={currentChatID} setGlobalMembersList={setCurrentGroupMembers}/>
          </Box>
          } 
          { directChat &&
            <ChatMemberInfo uid ={currentChatID.split(":").filter(uid => uid !== currentUser.uid )[0]} />
          } */}
        </Split>
        </Box>
    );
  }
