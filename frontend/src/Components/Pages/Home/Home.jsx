import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { gql, useQuery } from "@apollo/client";
import { useNavigate, useLocation  } from 'react-router-dom';


import { Container, Box, Input, Button, Link, HStack } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter,  SimpleGrid, Heading, Text, Spacer, Flex} from '@chakra-ui/react'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { websocket } from './Tools/websocket.js';  
import PostInput from './Components/PostInput/PostInput';
import PostLine from './Components/PostLine/PostLine';


function Home(props) {
  
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState();
  const [jwtToken, setJwtToken] = useState("");
  const [newPost, setNewPost] = useState("");
  const navigate = useNavigate();

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
    setSocket(websocket(setNewPost, jwtToken));
    // chatSocket.onmessage = (e) => {
    //   var data = JSON.parse(e.data)
    //   // ...
    // }
    // return function cleanup() {
    //   // de-register the socket event
    // }
  }, [])

  return (
    currentUser &&
    <Container maxW="2xl" marginTop="0rem" centerContent>
      <Container marginBlockStart={5} textAlign={'left'} maxW="2xl">
        {/* New Post Input Field */}
        <PostInput uid={currentUser.uid} socket={socket}/>
        {/* Friends' Posts */}
        <PostLine uid={currentUser.uid} newPost={newPost} setNewPost={setNewPost}/>

      </Container>
    </Container>
  );
}

export default Home;
