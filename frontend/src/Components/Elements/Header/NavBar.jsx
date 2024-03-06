import React, { useEffect, useState } from 'react';
import { Box, Text, Link, Flex, Stack, HStack, Center, Container, Button, IconButton, Image } from "@chakra-ui/react"


import { CgMenuGridR as MenuIcon, CgCloseR as CloseIcon, CgProfile as Profile } from "react-icons/cg";

import { RiChatSmile3Line as Chat, RiGhostFill } from "react-icons/ri";
import { FaUserFriends as Friends } from "react-icons/fa";
//import MenuToggle from "./MenuToggleButtton"
import {  useLocation } from 'react-router-dom'; // Link
import { NavLink } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';

const Logo = (props) => {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold">
        Alikem
      </Text>
    </Box>
  )
}

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  )
}


const MainMenuItem = ({ children, isLast, Icon, text, description, to = "/", ...rest }) => {
  return (
    <NavLink to={to} className={({ isActive, isPending }) =>
      isPending ? "pending" : isActive ? "active" : ""}
      style={({ isActive }) => ({
        color: isActive ? '#ffdb58' : '#fff'
      })}>
      <HStack>
        {Icon && <Icon  size={40} />}
      </ HStack>
      {/* <Text display="block" {...rest}>
        {children}
      </Text> */}
    </NavLink>
  )
}

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      //justify="space-between"
      wrap="wrap"
      w="100%"
      //mb={1}
      p={1}
      bg={["primary.500", "primary.500", "green.600", "green.600"]}
      color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  )
}

const MenuLinks = ( {isOpen} ) => {
  return(
    <Container maxW='xl'>
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    > 
      <Stack
        spacing={8}
        align="left"
        justify={["center", "space-between", "flex-end", "center"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MainMenuItem to="/profile" Icon={Profile} decription="profile"/>
        <MainMenuItem to="/chat" Icon={Chat} decription="chat"/>
        <MainMenuItem to="/friends" Icon={Friends} decription="chat"/>
      </Stack>

    </Box>
    </Container>
  )
}



const NavBar = (props) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const toggle = () => setIsOpen(!isOpen)

    
    return (   
      <Box>  
      <NavBarContainer {...props}>
        <MenuToggle toggle={toggle} isOpen={isOpen} />
        <MenuLinks isOpen={isOpen} />
        <LanguageSwitcher style={{position:"absolute", right: 50}}/>
        <ColorModeSwitcher style={{position:"absolute", right: 5}}/>    
      </NavBarContainer>

      </Box>  
    )
  }
  

export default NavBar;