import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { useAuth } from '../../../../Auth/AuthContext';
import {
  Spinner,
  Button,
  Divider,
  SkeletonText,
  SkeletonCircle,
  VStack,
  Container,
  Text,
  Flex,
  Spacer, 
  IconButton,
} from '@chakra-ui/react';
import { Menu as Panel } from 'uiw';
import { LinkBox, Input, InputGroup, InputRightElement, Box, useColorModeValue } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, RepeatClockIcon } from '@chakra-ui/icons'
import ChatAdd from './ChatAdd'
import ChatRename from './ChatRename';
import ChatDelete from './ChatDelete';

export default function ChatList(props) {
  
  const { handleGroupClicked } = props;
  
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [chatsList, setChatsList] = useState([]);
  const [chatsInfo, setChatsInfo] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const refChatsNavBar = useRef();
  
  
  const GET_USER_GROUPS = gql`
    query Groups($uid: String!)
    {
      users( where: {uid: $uid} )
      {
        groups {
          groupID
          groupName
          creatorUid
          directChat
        }
      }
    }
    `;
    const { data, loading, error } = useQuery(GET_USER_GROUPS, {
      variables: { uid: currentUser.uid },
    });
    
 
    const scrollToChatsNavBar = () => {
      refChatsNavBar.current?.scrollIntoView({ behavior: "smooth" })
    }  
  
    
    useEffect(() => {
      if (data) { 
        let chats_info = Object.assign({}, ...data.users[0].groups.map((gr)=>({[gr.groupID]:{...gr}})));
        setChatsInfo(chats_info)   
        setChatsList(data.users[0].groups) 
      }
    }, [data]);
      
    const onClickGroup = (e) => {
      setSelectedChat(chatsInfo[e.target.value]);
      handleGroupClicked({GroupName: e.target.textContent, GroupID: e.target.value})
    }
    
    const toggleShowAdd = (e) => {
      setShowAdd(!showAdd)
      setShowEdit(false)
      setShowDel(false)
    }
    
    const toggleShowEdit = (e) => {
      setShowEdit(!showEdit)
      setShowAdd(false)
      setShowDel(false)
    }
    
    const toggleShowDel = (e) => {
      setShowDel(!showDel)
      setShowEdit(false)
      setShowAdd(false)
    }
    
    const bgChatListBar = useColorModeValue('green.50', 'darkslategrey')

    return(

      <>
        <Flex
              as="nav"
              wrap="wrap"
              w="100%"
              maxH='40px'
              bg={bgChatListBar}
              px='3'
              py='1'            
            >
              <Spacer/>
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='add'
                  fontSize='15px'
                  icon={showAdd?<RepeatClockIcon />: <AddIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={()=>{scrollToChatsNavBar(); toggleShowAdd();}}
                />
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='edit'
                  fontSize='15px'
                  icon={showEdit?<RepeatClockIcon />: <EditIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={toggleShowEdit}
                  isDisabled={ !selectedChat }
                /> 
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='del'
                  fontSize='15px'
                  icon={showDel?<RepeatClockIcon />: <DeleteIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={toggleShowDel}
                  isDisabled={ !selectedChat }
                /> 
        </Flex> 
        {error && <Text color='tomato' m='3'>{error.message}</Text>}
        {loading && <Flex direction='column' height='full' justify='center' alignItems='center'>
                      <Spinner color='green' size='xl'/>
                    </Flex>
        }
        {data && 
        <Container  p={0} overflowY='scroll' color='green'>
              <div ref={refChatsNavBar}></div>
              {showAdd && 
                <ChatAdd 
                  uid={currentUser.uid} 
                  updateList={setChatsList} 
                  setShowAdd={setShowAdd}/>
              }
              {showEdit && 
                <ChatRename 
                  uid={currentUser.uid} 
                  chat={selectedChat} 
                  chatsList={chatsList}
                  updateList={setChatsList} 
                  setShowEdit={setShowEdit}/>
              }
               {showDel && 
                <ChatDelete 
                  chat={selectedChat} 
                  updateList={setChatsList} 
                  setShowDel={setShowDel}/>
              }
            <Box width='full' height='calc(100vh - 120px)'>
            {/* {chatRooms.length === 0 ? (
              <div className="alert alert-danger">Нет доступных чатов</div>
            ) : ( */}
                {chatsList && chatsList.map(group => 
                  <Button 
                    justifyContent="left"
                    width='full'
                    borderBottom="1px solid #2f855a50"
                    colorScheme='green' 
                    pt='3' 
                    pb='3' 
                    pl='3' 
                    variant={ (selectedChat?.GroupID===group.groupID) ?  'solid' :'ghost'}
                    size="xl" 
                    key={group.groupID}
                    value={group.groupID}
                    onClick={onClickGroup}
                    fontSize='md'>
                     {group.groupName}
                  </Button>
                )}

            </Box>
          </Container>
        }
      </>
  );
}
