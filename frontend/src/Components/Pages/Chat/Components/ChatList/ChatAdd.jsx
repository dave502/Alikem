import React, { useState, useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import { Progress } from '@chakra-ui/react'
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useTranslation } from "react-i18next";

export default function ChatAdd(props) {
  
  const { updateList, uid, setShowAdd } = props;
  const [newChatName, setNewChatName] = useState("")
  const { t } = useTranslation();
  
  const CREATE_GROUP = gql`
  # add group
    mutation createGroup($uid: String!, $name: String!) {
      createGroups(input: 
        {
          groupName: $name
          creatorUid: $uid
          users: { connect: [{ where: { node:{ uid: $uid }}}]}
        }
      ) 
      {
        groups {
            groupID
            groupName
        }
        info {
          nodesCreated
        }
      }
    }
  `;
  
  const [gqlCreateGroup, { data, loading, error }] = useMutation(CREATE_GROUP); 
   
  const addChat = (e) => {
    gqlCreateGroup({variables: { uid: uid,  name: newChatName}})
    .catch((error) => {
      console.log(error)
    });  
  }
  
  const validateChatName =(text) => {
    //,...
    setNewChatName(text)
  }

  useEffect(() => {
    if (data) {       
        const newChat = data.createGroups.groups[0]
        updateList((prev)=>[newChat, ...prev])
        setShowAdd(false)
    }
 
  }, [error, loading, data]);
  

  return(
 
    <InputGroup>
        <Input 
            placeholder={t("new_group_name_hint")}
            _placeholder={{ color: 'green.300' }}
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
                onClick={addChat}
            /> 
        </InputRightElement>
        {loading && <Progress size='xs' isIndeterminate />}
        {data && <Progress size='xs' value={100} colorScheme='green' />}
    </InputGroup>
    
  );
}
