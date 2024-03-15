import React, { useState, useSize, useEffect, useRef } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import EventMembers from './Components/EventMembers/EventMembers.jsx';
import EventInfo from './Components/EventInfo/EventInfo.jsx';
import EventList from './Components/EventList/EventList.jsx';
// https://uiwjs.github.io/react-split/
import { Button as BarButton, DateInput, Split } from 'uiw';

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
import AlertBox from '../../../AlertBox/AlertBox.jsx';


export default function Events(props) {

  const [currentEventID, setCurrentEventID] = useState(null);
  const [currentEventMembers, setCurrentEventMembers] = useState();
  const [leftPanelWidth, setLeftPanelWidth] = useState('15%');
  const [alertText, setAlertText] = useState('');

  
  const refLastMessage = useRef();
  const navigate = useNavigate();
  const { currentUser, setError } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  
  // const scrollToLastMessage = () => {
  //   refLastMessage.current?.scrollIntoView({ behavior: "smooth" })
  // }  
 
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    return
  }, [currentUser, navigate]);
  

  useEffect(() => {
    const {state} = location;
    if (state) {
        setCurrentEventID(state.eventID);
      } 
  }, [location]) 

  
  const handleEventClicked = ({ EventID }) => {
    setCurrentEventID(EventID)
    navigate(location.pathname, {}); // to clear Location state with chat ID
  }
  
  const ToggleGroupListPanel = () => {
    setLeftPanelWidth(leftPanelWidth === 0 ? '15%' : 0)
  }
  
  const bgMsgListBar = useColorModeValue('green.50', 'darkslategrey');
 
  return (
    currentUser&&
    <Box  style={{ height: 'calc(100vh - 64px)'}}>
        <Split 
          lineBar visible={leftPanelWidth !== 0}
          renderBar={({ onMouseDown, ...props }) => {
            return (
              <div {...props} style={{ maxWidth:'2px', boxShadow: 'none', background: 'transparent', zIndex:'1000'}}>
                <div onMouseDown={onMouseDown} style={{ backgroundColor: '#2f855a', boxShadow: 'none' }} />
              </div>
            );
          }}
          style={{ height: "100hv", borderBottom: '3px solid #2F855A', borderRadius: 3 }}
          
        >
         
          <Box style={{ width: leftPanelWidth, minWidth: leftPanelWidth, overflow: 'hidden' }}>
            <EventList handleEventClicked={handleEventClicked} />
          </Box>
          <Box style={{ flex: 1, minWidth: 900 }}>
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
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label='Options'
                  icon={<HamburgerIcon />}
                  variant='outline'
                />
              </Menu>
            </Flex>
            { (currentEventID !== null) &&
              <VStack  style={{ height: 'calc(100vh - 110px)'}}>
                <AlertBox alertText={alertText}/>
                <EventInfo 
                  currentUserUid={currentUser.uid} 
                  eventID={currentEventID} 
                  eventMembers={currentEventMembers}
                  />
                {/* <Spacer />
                <Button /> */}
              </VStack>
            } 
          </Box>
          { currentEventID !== null &&
          <Box style={{ width: leftPanelWidth, minWidth: leftPanelWidth, overflow: 'hidden' }}>
            <EventMembers eventID={currentEventID}/>
          </Box>
          } 
        </Split>
        </Box>
    );
  }
