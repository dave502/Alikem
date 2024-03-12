import React, { useState, useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import { IconButton, Tooltip } from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useTranslation } from "react-i18next";

const CANCEL_FRIENDSHIP_QUERY = gql`
  mutation UpdateUsers($uid:String!, $newFriendID: String!) {
    updateUsers(
      where: { uid: $uid },
      disconnect: {
        friends: [
          {
            where: {
              node: {
                uid: $newFriendID
              }
            }
          }
        ]
      }
    )
    {
      users{
        uid
      }
      info {
        relationshipsDeleted
      }
    }
  }
`



export default function CancelFriendsRequestFromList(props){
    
    const {currentUid, otherUid, deleteFriend, initiator, mode} = props;
    const [deletedUserUid, setDeletedUserUid] = useState();
    const [gqlCancelFriendRequest, { data, loading, error }] = useMutation(CANCEL_FRIENDSHIP_QUERY);
    const { t } = useTranslation();
    const tooltips = {
      'friends': t("delete_friend"),
      'friends_in': t("reject_request"),
      'friends_out': t("cancel_request")
    }
      
    useEffect(() => {
      if (data?.updateUsers.info.relationshipsDeleted){
        deleteFriend(deletedUserUid, mode);
      }
    }, [data, loading, error ]);
      
    const cancelFriendsRequest = () => {
        var recipient = (currentUid === initiator)? otherUid : currentUid
        gqlCancelFriendRequest({ variables: 
            { uid: initiator, 
              newFriendID: recipient
            }})
            
        setDeletedUserUid(otherUid);   
    }
    
    return(
        <Tooltip hasArrow label={tooltips[mode]} bg='red.200'>
          <SmallCloseIcon onClick={cancelFriendsRequest} colorScheme='green'  size={"lg"}/>
          {/* <IconButton
              variant='ghost'
              colorScheme='green'
              aria-label='Chat'
              icon={<SmallCloseIcon />}
              size={"lg"}
              onClick={cancelFriendsRequest}
              />  */}
        </Tooltip>
    )

}