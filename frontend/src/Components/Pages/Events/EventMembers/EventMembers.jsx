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
  HStack,
} from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { Menu as Panel } from 'uiw';
import { LinkBox, Input, InputGroup, Avatar, Box, useColorModeValue, chakra } from '@chakra-ui/react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, RepeatClockIcon } from '@chakra-ui/icons'
// import AddChatMembers from './AddChatMembers'
// import DeleteChatMemberBtn from './DeleteChatMemberBtn'

export default function EventMembers(props) {
  
  const { chatID, setGlobalMembersList } = props;
  
  const [showAdd, setShowAdd] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [membersInfo, setMembersInfo] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const refMembersNavBar = useRef();
  
  
  const GET_GROUP_USERS = gql`
    query Groups($groupID: ID!)
    {
      groups( where: {groupID: $groupID} )
      {
        users {
          img
          name
          name_id
          privateProfile
          uid
        }
      }
    }
    `;
    
    const { data, loading, error } = useQuery(GET_GROUP_USERS, {
      variables: { groupID: chatID },
      fetchPolicy: 'no-cache',
      fetchPolicy: "network-only",
    });
    
    const scrollToChatsNavBar = () => {
      refMembersNavBar.current?.scrollIntoView({ behavior: "smooth" })
    }  
    
    useEffect(() => {
      setMembersList([]);
      setShowAdd(false);
    }, [chatID]);  
  
    useEffect(() => {
      if (data?.groups.length) {  
        setMembersList(data.groups[0].users.filter((user)=>user.uid != currentUser.uid)) 
        const mapMembers = new Map(data.groups[0].users.map(user => {return [user.uid, user]}),);
        setGlobalMembersList(mapMembers)
      } 
    }, [data]);

    const onClickChatMember = (e) => {

    }
    
    const toggleShowAdd = (e) => {
      setShowAdd(!showAdd)
    }

    const bgChatListBar = useColorModeValue('green.50', 'darkslategrey')
    
    const txtColor = useColorModeValue('darkslategrey', 'green.200')

  return(
    !showAdd ?
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
                  icon={<AddIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={toggleShowAdd}
                />
                {/* <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='del'
                  fontSize='15px'
                  icon={<DeleteIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  // onClick={toggleShowDel}
                  // isDisabled={ !selectedChat } 
                />  */}
        </Flex> 
        {error && <Text color='tomato' m='3'>{error.message}</Text>}
        {loading && <Flex direction='column' height='full' justify='center' alignItems='center'>
                      <Spinner color='green' size='xl'/>
                    </Flex>
        }
          <Container  p={0} overflowY='scroll' color='green'>
                <div ref={refMembersNavBar}></div>
 
                {membersList && membersList
                  .filter((user)=>user.uid != currentUser.uid)
                  .map(member =>  

                    <HStack px='3' py='1' borderBottom="1px solid #2f855a50" key={member.uid}>
                      <Avatar size='md' name={member.name} src='default_avatar.jpeg' />
                      <Text color={txtColor}  fontSize='sm' m='0'>{member.name}</Text>
                      {/* <Spacer/>
                      <Menu>
                        <MenuButton 
                            as={IconButton} 
                            icon={<BsThreeDotsVertical />} 
                            colorScheme='green'
                            variant='ghost' 
                            size={"lg"}/>
                        <MenuList minW='48px' width="max-content" p='0' m='0' aria-orientation='horizontal'>
                            <MenuItem p='0' m='0' >
                                <DeleteChatMemberBtn 
                                    currentUid={currentUser.uid} 
                                    memberUid={member.uid}
                                    chatID={chatID}
                                    setMembersList={setMembersList}
                                    />
                            </MenuItem>
                        </MenuList>
                      </Menu> */}
                    </HStack>
                )}
            </Container>
        
      </>
      :
      // <AddChatMembers 
      //   chatID={chatID} 
      //   setShowAdd={setShowAdd} 
      //   membersList={membersList}
      //   setMembersList={setMembersList}/>
  );
}
