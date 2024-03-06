import React, { useState, useRef, useEffect } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button, Text} from '@chakra-ui/react'


const _REQUEST_FRIENDSHIP_QUERY = gql`
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

const REQUEST_FRIENDSHIP_QUERY = gql`
  mutation UpdateUsers($uid:String!, $newFriendID: String!) {
    updateUsers(
      where: { uid: $uid },
      update: {
        friends: [
          {
            connect: [
              {
                edge: {
                  confirmed: false
                  initiator: $uid
                },
                where: {
                  node: {
                    uid: $newFriendID
                  }
                }
              }
            ]
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


export default function SendFriendsRequestFromPage(props){
    
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
        <Button 
          colorScheme='green' 
          variant='solid'
          onClick={sendFriendsRequest}
          >
          Добавить в друзья
        </Button>
        :
        <Text>Запрос отправлен</Text>

    )

}