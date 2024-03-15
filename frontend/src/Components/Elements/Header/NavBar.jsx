import React from 'react';
import { Box, Text, Flex, Stack, HStack, Container } from "@chakra-ui/react"
import { CgMenuGridR as MenuIcon, CgCloseR as CloseIcon, 
  CgProfile as Profile, CgEventbrite as Event } from "react-icons/cg";
import { RiChatSmile3Line as Chat } from "react-icons/ri";
import { FaUserFriends as Friends } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';

const Logo = (props) => {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold">
        ALIKEM
      </Text>
    </Box>
  )
}

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle} minH="36px" minW="36px">
      {isOpen ? <CloseIcon size='2em'/> : 
                <MenuIcon  size='2em'/>}
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
      bg={["green.600", "green.600", "green.600", "green.600"]}
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
        justify={["center", "center", "center", "center"]}
        direction={["row", "row", "row", "row"]}
        pt={[0, 0, 0, 0]}
      >
        <MainMenuItem to="/profile" Icon={Profile} decription="profile"/>
        <MainMenuItem to="/chat" Icon={Chat} decription="chat"/>
        <MainMenuItem to="/friends" Icon={Friends} decription="chat"/>
        <MainMenuItem to="/events" Icon={Event} decription="events"/>
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
        <LanguageSwitcher style={{position:"absolute", right: 50, top: 5}}/>
        <ColorModeSwitcher style={{position:"absolute", right: 5, top: 5}}/>    
      </NavBarContainer>

      </Box>  
    )
  }
  

export default NavBar;