import React, { useState, useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import { HStack, Progress } from '@chakra-ui/react'
import { Input, InputGroup, InputRightElement, IconButton, Text } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'


export default function ChatRename(props) {
  
  const { setShowEdit, chatsList, updateList, uid, chat } = props;
  const [newChatName, setNewChatName] = useState(chat.groupName)

  const EDIT_CHAT_NAME = gql`
  # edit chat name
    mutation editGroupName($name: String!, $groupID: ID!) {
      updateGroups(
        where: { groupID: $groupID }
        update: { groupName: $name }
      ) 
      {
        groups {
            groupID
            groupName
        }
      }
    }
  `;
  
  const [gqlEditChatName, { data, loading, error }] = useMutation(EDIT_CHAT_NAME); 
  
  
  const editChatName = (e) => {
    gqlEditChatName({variables: { uid: uid,  name: newChatName, groupID: chat.groupID}})
    .catch((error) => {
      console.log(error)
    });  
  }
  
  const validateChatName = (text) => {
    //,...
    setNewChatName(text)
  }

  
  useEffect(() => {
    if (data) {       
      const renamedChat = data.updateGroups.groups[0]
      var updatedChatList = [...chatsList];
      var prevChat = updatedChatList.find((i) => i.groupID === renamedChat.groupID)
      var idx = updatedChatList.indexOf(prevChat);
      updatedChatList[idx] = renamedChat;
      updateList(updatedChatList);
      setShowEdit(false);
  }
 
  }, [error, loading, data]);
  
  return(
    <HStack>
      <InputGroup>
          <Input 
              value={newChatName} 
              onChange={(input)=>validateChatName(input.target.value)}
              focusBorderColor='green.500'
              autoFocus
          />
          <InputRightElement>
              <IconButton
                  isRound={false}
                  colorScheme='green'
                  aria-label='ok'
                  fontSize='12px'
                  icon={<CheckIcon/>}
                  mr='3'
                  variant='outline'
                  size='sm'
                  onClick={editChatName}
              /> 
          </InputRightElement>
      </InputGroup>
      {loading && <Progress size='xs' isIndeterminate />}
      {data && <Progress size='xs' value={100} colorScheme='green' />}
      {error && <Text color='tomato' m='3'>{error.message}</Text>}
    </HStack>
  );
}
