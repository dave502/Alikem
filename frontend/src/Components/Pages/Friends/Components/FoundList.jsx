import { VStack, Text } from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { gql, useQuery, useLazyQuery, useReactiveVar } from "@apollo/client";
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useEffect, useState } from 'react';


const GET_USERS_QUERY = gql`
  query GetUser($uid:String!, $cityID:Int, $minAge:Date, $maxAge:Date, $gender:Gender ){
    users(where: {  
        NOT: {uid: $uid}
        cityID: $cityID
        gender: $gender
        birthday_GTE: $maxAge 
        birthday_LTE: $minAge 
    }) 
    {
      uid
      name
      img
      city
      cityID
      birthday
      gender
      score(uid: $uid)
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


function FoundList(props){
    
  const { searchFilter, uid } = props; 
  
    useEffect(() => {
      if (searchFilter) {
        getUsers({ variables: {uid, ...searchFilter } });
      }
    }, [searchFilter]);
  
    const [getUsers, { loading, error, data }] = useLazyQuery(GET_USERS_QUERY, {
      variables: { uid, ...searchFilter },
      fetchPolicy: 'no-cache',
      fetchPolicy: "network-only",
      // pollInterval: 500,
    });
  
    
    if (loading) return (
      <VStack>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </VStack>
    );
    
    if (error) return `Error! ${error}`;
    
   return (
    <VStack>
        {data && data.users.length ? data.users.map((user) => (
            <UserListItem currentUid={uid} user={user} mode="search" key={user.uid}/>
        )):(
              <Text>Пользователи с такими критериями не найдены.</Text> 
          )
        }
    </VStack>
   );
 }
 
 export default FoundList;