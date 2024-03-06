import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth } from '../../../../Auth/AuthContext';
import { useCheckbox, useCheckboxGroup } from '@chakra-ui/react'

import {
  Spinner,
  Button,
  Divider,
  Avatar,
  SkeletonCircle,
  VStack,
  Container,
  Text,
  Flex,
  Spacer, 
  IconButton,
} from '@chakra-ui/react';
import { Menu as Panel } from 'uiw';
import { LinkBox, Input, InputGroup, InputRightElement, Box, useColorModeValue, chakra } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, ArrowBackIcon, CheckIcon, RepeatClockIcon } from '@chakra-ui/icons'


export default function AddChatMembers(props) {
  
  const { chatID, setShowAdd, membersList, setMembersList } = props;
  
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [proposedMembers, setProposedMembers] = useState([]);
  const [membersInfo, setMembersInfo] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const refMembersNavBar = useRef();
  const { value, getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
  })
  
  const GET_FRIENDS_QUERY = gql`
  query GetFriends($uid:String!, $exclude_uids:[String!]){
    users( where: {uid: $uid} )
    {
      friendedConnection(where: {node: {NOT:{uid_IN: $exclude_uids}}}) {
        edges {
          confirmed
          node {
            uid
            name
            img
          }
          initiator
          directChatID
          greetings
        }
      }
      friendsConnection(where: {node: {NOT:{uid_IN: $exclude_uids}}}) {
        edges {
          confirmed
          greetings
          directChatID
          initiator
          node {
            img
            name
            uid
            gender
            birthday
            city
            score(uid:$uid)
          }
        }
      } 
    }
  }
`;

const ADD_FRIENDS_TO_GROUP_QUERY = gql`
mutation UpdateGroups($groupID:ID!, $userUids:[String!]) {
  updateGroups(
    where: {groupID: $groupID}
    connect: {
      users: [
        {
          where: {
            node: {
              uid_IN: $userUids
            }
          }
        }
      ]           
    }
  ) {
    info {
      relationshipsCreated
    }
    groups {
      users {
        img
        name
        name_id
        privateProfile
        uid 
      }
    }
  }
}
`;     




const { data, loading, error } = useQuery(GET_FRIENDS_QUERY, {
  variables: { uid: currentUser.uid,  exclude_uids: membersList.map(member => member.uid)},
  fetchPolicy: 'no-cache',
  fetchPolicy: "network-only",
});

const [gqlAddFriendsToGroup, { }] = useMutation(ADD_FRIENDS_TO_GROUP_QUERY);

function FriendCheckbox(props) {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    useCheckbox(props)
  const txtColor = useColorModeValue('darkslategrey', 'green.200')

  return (
    <chakra.label
      display='flex'
      flexDirection='row'
      alignItems='center'
      gridColumnGap={2}
      width='full'
      borderBottom="1px solid #2f855a50"
      px={3}
      py={1}
      cursor='pointer'
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex
        alignItems='center'
        justifyContent='center'
        border='2px solid'
        borderColor='green.500'
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && <Box w={2} h={2} bg='green.500' />}
      </Flex>
      <Avatar size='md' name={props.name} src='default_avatar.jpeg' />
      <Text color={txtColor}  fontSize='sm' {...getLabelProps()} m='0'>{props.name}</Text>
    </chakra.label>
  )
  }
    
    useEffect(() => {
      if (data) {         
        let all_getted_friends = [...data.users[0].friendsConnection.edges, ...data.users[0].friendedConnection.edges];

        setProposedMembers(all_getted_friends.filter((member)=>
          (member.node.uid != currentUser.uid && member.confirmed))) 
      }
    }, [data]);
      

    
  const SaveAndExit = (e) => {
    
    if (value) {
      gqlAddFriendsToGroup({ variables: { groupID: chatID,  userUids:value}})
      .then((response) => {
        setMembersList(response.data.updateGroups.groups[0].users)
      })
      .catch((error) => {
        console.log(error)
      });     
    } 
    setShowAdd(false);
  }
  
  const Exit = (e) => {
    setShowAdd(false);
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
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='esc'
                  fontSize='15px'
                  icon={<ArrowBackIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                 onClick={Exit}
                />
                <Spacer/> 
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='ok'
                  fontSize='15px'
                  icon={<CheckIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={SaveAndExit}
                  // isDisabled={ !selectedChat }
                />   
        </Flex>  
        
        {error && <Text color='tomato' m='3'>{error.message}</Text>}
        {loading && <Flex direction='column' height='full' justify='center' alignItems='center'>
                      <Spinner color='green' size='xl'/>
                    </Flex>
        }
        { proposedMembers?.length > 0 &&
          <Container  p={0} overflowY='scroll' color='green'>
                {proposedMembers.map(member => 
                  <FriendCheckbox {...getCheckboxProps({ 
                    value: member.node.uid, ...member.node })} />
                )}
          </Container>
        }
      </>
  );
}
