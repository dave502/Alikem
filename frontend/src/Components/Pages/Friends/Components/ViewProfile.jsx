
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../Auth/AuthContext.jsx';
import { gql, useQuery, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { Container, Text, Grid, GridItem, VStack } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import SendFriendsRequestFromPage from './SendFriendRequest/SendFriendsRequestFromPage.jsx'

// const [userAuthorized, setUserAuthorized] = useState(true);



function ViewProfile(props) {
  
    const [userData, setUserData] = useState(); 
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams()
    const { currentUser } = useAuth();
    
    const profileOwnersID = params.get("id")
  
    const READ_USER_POFILE = gql`
    query Users($uid: String!)
    {
      users( where: {uid: $uid} )
      {
        name
        gender
        birthday
        city
        cityID
        img    
      }
    }
    `;
    const { data, loading, error } = useQuery(READ_USER_POFILE, { variables: { uid: profileOwnersID },});
      
      
    return (
        data?
      <Container maxW='1200px' padding='20px'>

           
        <Grid
            h='200px'
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(5, 10fr)'
            gap={4}
        >
            <GridItem rowSpan={2} colSpan={1} alignContent="end" alignItems="end" ali>
                <Image boxSize='200px' 
                    src={data.users[0].avatar}
                    fallbackSrc='https://via.placeholder.com/150' alignSelf="end"/>  
            </GridItem>
            <GridItem colSpan={4}>
                <VStack align="start">
                    <Text mb="5px">{data.users[0].name} </Text> 
                    <Text>{data.users[0].city} </Text> 
                </VStack>
            </GridItem>
            <GridItem colSpan={2} textAlign="left">
                <SendFriendsRequestFromPage 
                    currentUid={currentUser.uid} 
                    otherUid={profileOwnersID}/>
            </GridItem>
            <GridItem colSpan={2} />

        </Grid>
      </Container>
      :
      <></>
    );
  }
  
  export default ViewProfile;
  