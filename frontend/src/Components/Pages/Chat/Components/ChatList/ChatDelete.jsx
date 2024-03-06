import React, { useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import { Progress, VStack } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";

export default function ChatDelete(props) {
  
  const { chat, setShowDel, updateList } = props;
  const toast = useToast();
  const { t } = useTranslation();

  const DELETE_CHAT = gql`
  # delete chat
    mutation deleteGroups($groupID: ID!) {
      deleteGroups(
        where: { groupID: $groupID }
      ) 
      {
        nodesDeleted
      }
    }
  `;
  
  const [gqlDeleteChat, { data, loading, error }] = useMutation(DELETE_CHAT); 
  
  
  const deleteChat = (e) => {
    gqlDeleteChat({variables: { groupID: chat.groupID}})
    .catch((error) => {
      console.log(error)
    });  
  }
  
  
  useEffect(() => {
    if (data) {  
      toast({
        duration: 2000,
        status: 'success',
        position: 'top',
        description: `Удалена ${data.deleteGroups.nodesDeleted} группа`,
      })
      
      updateList((prev) => [...(prev.filter((i) => i.groupID !== chat.groupID))])
      setShowDel(false);
  }
 
  }, [error, loading, data]);

  return(
 
    <VStack pb='5px'>
      <Text m='0' color='red'>{t("delete_group_name_hint")} "{chat.groupName}"?</Text>
      <ButtonGroup gap='4'>
        <Button colorScheme='red' variant='outline' size='sm' onClick={deleteChat}>{t("yes")}</Button>
        <Button colorScheme='green' variant='outline' size='sm'  onClick={()=>setShowDel(false)}>{t("no")}</Button>
      </ButtonGroup>      
        {loading && <Progress size='xs' isIndeterminate />}
        {data && <Progress size='xs' value={100} colorScheme='green' />}
        {error && <Text color='tomato' m='3'>{error.message}</Text>}
    </VStack>
    
  );
}
