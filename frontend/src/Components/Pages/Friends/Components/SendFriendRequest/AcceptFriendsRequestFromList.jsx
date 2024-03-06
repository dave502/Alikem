import React, { useState, useRef, useEffect } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BiMailSend } from "react-icons/bi";
import { IconButton, Tooltip } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

const ACCEPT_FRIENDSHIP_QUERY = gql`
  mutation UpdateUsers($uid:String!, $newFriendID: String!) {
    updateUsers(
      where: { uid: $uid },
      connect: {
        friends: [
          {
            where: {
              node: {
                uid: $newFriendID
              }
            },
            edge: {
              confirmed: true
              initiator: $uid
            }
          }
        ]
      }
    )
    {
      users {
        uid
      }
    }
  }
`

export default function AcceptFriendsRequestFromList(props){
    
    const {currentUid, otherUid, AddFriend, initiator, mode} = props;
    const [addedUserUid, setAddedUserUid] = useState();
    const [gqlAcceptFriendRequest, { data, loading, error }] = useMutation(ACCEPT_FRIENDSHIP_QUERY);
    
    const acceptFriendsRequest = () => {

        var recipient = (currentUid === initiator)? otherUid : currentUid
        
        gqlAcceptFriendRequest({ variables: 
            { uid: initiator, 
              newFriendID: recipient
            }})
            
            setAddedUserUid(otherUid);   
    }
    
    useEffect(() => {
      if (data?.updateUsers.info.relationshipsDeleted){
        AddFriend(addedUserUid, mode);
      }
    }, [data, loading, error ]);
      
    
    return(
        
        // data &&
        <Tooltip hasArrow label='Accept request' bg='green.200'>
          <IconButton
              variant='ghost'
              colorScheme='green'
              aria-label='Chat'
              icon={<CheckIcon />}
              size={"lg"}
              onClick={acceptFriendsRequest}
              /> 
          </Tooltip>

    )

}