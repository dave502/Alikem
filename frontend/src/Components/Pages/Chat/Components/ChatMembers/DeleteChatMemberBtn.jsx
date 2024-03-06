import React, { useState, useRef, useEffect } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BiMailSend } from "react-icons/bi";
import { IconButton, Tooltip } from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next';

const DELETE_MEMBERS_FROM_GROUP_QUERY = gql`
mutation UpdateGroups($groupID:ID!, $userUids:[String!]) {
  updateGroups(
    where: {groupID: $groupID}
    disconnect: {
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
      relationshipsDeleted
    }
  }
}
`;     



export default function DeleteChatMemberBtn(props){
    
    const {currentUid, memberUid, setMembersList, chatID} = props;
    const [gqlDeleteUserFromChat, { data, loading, error }] = useMutation(DELETE_MEMBERS_FROM_GROUP_QUERY);
    const { t } = useTranslation();  
    
    
    useEffect(() => {
      if (data?.updateGroups.info.relationshipsDeleted > 0){
        setMembersList((prev) => prev.filter(user => user.uid != memberUid))
      }
      }, [data, loading, error ]);
      
    const Delete = () => {
      gqlDeleteUserFromChat({ variables: 
          { groupID: chatID, 
            userUids: [memberUid]
          }})
    }
    
    return(
        <Tooltip hasArrow label={t("delete_from_group")} bg='red.200'>
          <IconButton
              variant='ghost'
              colorScheme='green'
              aria-label='Chat'
              icon={<SmallCloseIcon />}
              size={"lg"}
              onClick={Delete}
              /> 
        </Tooltip>
    )

}