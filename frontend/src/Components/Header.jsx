import React from 'react';

import { Box, Heading, Center } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Box paddingBottom={5}>
      <Center>
        <Link to="/">
          <Heading size="2xl">
            {/* <ChatIcon></ChatIcon> */}
             100 Friends 🤗
          </Heading>
        </Link>
      </Center>
    </Box>
  );
}

export default Header;
