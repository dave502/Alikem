import { VStack, Text, Box } from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { t } from "i18next";

// const GET_FRIENDS_QUERY = gql`
// query Users($where: UserWhere) {
//   users(where: $where) {
//     friendedConnection {
//       edges {
//         directChatID
//         greetings
//         initiator
//         node {
//           name
//           uid
//         }
//       }
//     }
//     friendsConnection {
//       edges {
//         confirmed
//         directChatID
//         initiator
//         node {
//           uid
//           name
//         }
//       }
//     }
//   }
// }
// `;

const GET_FRIENDS_QUERY = gql`
  query GetFriends($uid:String!){
    users( where: {uid: $uid} )
    {
      friendedConnection {
        edges {
          confirmed
          node {
            uid
            name
            score(uid:$uid)
          }
          initiator
          directChatID
          greetings
        }
      }
      friendsConnection {
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
// location{
//     latitude
//     longitude
//   }

// <VStack>
// <SkeletonCircle size='10' />
// <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
// </VStack>


function FriendsList(props){
    
  const { uid, update } = props; 
  
  const [sentOutRequests, setSentOutRequests] = useState([]);
  const [sentInRequests, setSentInRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const [gqlGetFriends, { data, loading, error }] = useLazyQuery(GET_FRIENDS_QUERY,  {
    fetchPolicy: 'network-only',
  });
  
  useEffect(() => {

    if (data?.users.length){

      let friends = [];
      let sentOutRequests = [];
      let sentInRequests = [];

      let all_getted_friends = [...data.users[0].friendsConnection.edges, ...data.users[0].friendedConnection.edges];

      for (const person of all_getted_friends){
        if (person.confirmed)  friends.push(person);
        else if (person.initiator === uid) sentOutRequests.push(person);
        else sentInRequests.push(person);
      }
      setFriends(friends);
      setSentInRequests(sentInRequests);
      setSentOutRequests(sentOutRequests);
    }
  }, [data, loading, error, uid ]);
  
  
  useEffect(() => {
    if (update){
      gqlGetFriends( {variables: { uid: uid }} );
    }
  }, [update]);
  
  const deleteFriendFromArray = (del_friend, mode) => {
    var updatedRequests;
    switch (mode) {
      case "friends_in":
        updatedRequests = sentInRequests.filter((item) => item.node.uid !== del_friend)
        setSentInRequests(updatedRequests)
        break;
      case "friends_out":
        updatedRequests = sentOutRequests.filter((item) => item.node.uid !== del_friend)
        setSentOutRequests(updatedRequests)
        break;   
      case "friends":
        updatedRequests = friends.filter((item) => item.node.uid !== del_friend)
        setFriends(updatedRequests)
        break;   
      default:
        break; 
    }
  }
  
  const acceptFriendInArrays = (friend) => {
    var updatedRequests;
    const idx = sentInRequests.findIndex((item) => item.node.uid === friend);
    setFriends((prev)=>[sentInRequests[idx], ...prev]);
    setSentInRequests.splice(idx, 1);
  }
    
   return (
    <VStack>
        
      {sentInRequests.length && 
        <Box borderColor='rgb(255, 219, 88)' borderWidth='1px' mb='10px'>
         <Text fontSize='md' color='green' background='rgb(255, 219, 88)' m='0'> {t("in requests")}</Text>
          {sentInRequests.map((friend) => 
            <UserListItem 
              currentUid={uid} 
              user={friend.node} 
              confirmed={friend.confirmed} 
              initiator={friend.initiator}
              directChatID={friend.directChatID}
              acceptFriend={acceptFriendInArrays}
              deleteFriend={deleteFriendFromArray}
              mode="friends_in"
            />)
          }
        </Box>
      }
      
      {sentOutRequests.length && 
        <Box borderColor='lightgrey' borderWidth='1px' mb='10px'>
          <Text fontSize='md' color='green' background='lightgrey'  m='0'> {t("out_requests")} </Text>
          {
          sentOutRequests.map((friend) => 
            <UserListItem 
              currentUid={uid} 
              user={friend.node} 
              confirmed={friend.confirmed} 
              initiator={friend.initiator}
              deleteFriend={deleteFriendFromArray}
              mode="friends_out"
            />)
          }
        </Box>
      }
      
      {friends.length && 
          friends.map((friend) => 
            <UserListItem 
              currentUid={uid} 
              user={friend.node} 
              confirmed={friend.confirmed} 
              initiator={friend.initiator}
              deleteFriend={deleteFriendFromArray}
              mode="friends"/>)
      }
      
      {(!friends.length && !sentOutRequests.length && !sentInRequests.length) &&
        <Text>{t("no_friends")}</Text> 
      } 

    {loading && 
      <VStack>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </VStack>
    }
    
    </VStack>
   );
 }
 
 export default FriendsList;