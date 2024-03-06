import React, { useState, useRef, useEffect } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaUserClock } from "react-icons/fa";
import { Center, Container, IconButton } from '@chakra-ui/react'

const REQUEST_FRIENDSHIP_QUERY = gql`
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
              confirmed: false
              initiator: $uid
            }
          }
        ]
      }
    )
    {
        info {
            relationshipsCreated
        }
    }
  }
`



export default function SendFriendsRequestFromList(props){
    
    const {currentUid, otherUid} = props;
    
    const [gqlSendFriendRequest, { data, loading, error }] = useMutation(REQUEST_FRIENDSHIP_QUERY);
    
    const sendFriendsRequest = () => {
        
        gqlSendFriendRequest({ variables: 
            { uid: currentUid, 
              newFriendID: otherUid
            }})
    }

    return(
        
        data === undefined 
        ? 
        <IconButton
            variant='ghost'
            colorScheme='green'
            aria-label='Chat'
            icon={<IoMdAddCircleOutline />}
            size={"lg"}
            onClick={sendFriendsRequest}
            /> 
        :
        <Container boxSize='48px' p='0'     >
          <Center w='48px' h='48px'><FaUserClock color='lightgreen'/></Center>
          
        </Container>
        


    )

}