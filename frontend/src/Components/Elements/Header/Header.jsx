import React from 'react';

import { Box } from '@chakra-ui/react';

import NavBar from './NavBar';


function Header(props) {

  return (
    <Box textAlign="right">
      <NavBar/>
    </Box>
  );
}

export default Header;
