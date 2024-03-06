import React from 'react';

import { Box, Heading, Center, Flex } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Logo from "./Logo" 
import NeoUser from '../../Auth/NeoUser';

function Header(props) {

  return (
    <Box textAlign="right">
      <NavBar/>
    </Box>
  );
}

export default Header;
