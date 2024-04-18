import { useState, useEffect } from "react";
import { Container, HStack, VStack, Text, Avatar, Wrap, WrapItem } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";

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

export default function (props){   
    
    const { uid, newPost, setNewPost } = props; 
    const [lastPosts, setLastsPosts] = useState([]);
    const { t, i18n } = useTranslation();
    const [friends, setFriends] = useState([]);
    
    const { data, loading, error } = useQuery(GET_FRIENDS_QUERY,  {
        fetchPolicy: 'network-only', variables: { uid: uid }
      });
      
    useEffect(() => {

    if (data?.users.length){

        let friends = [...data.users[0].friendsConnection.edges, ...data.users[0].friendedConnection.edges];
        setFriends(friends);
    }
    }, [data, loading, error, uid ]);
    
    useEffect(() => {
        // 
        setLastsPosts(["post1", "post2", "post3"])
        console.log("lastPosts", lastPosts)
    }, [])
    
    
    useEffect(() => {
        if(newPost?.data){
            console.log("useEffect newPost Info", newPost.data)
            console.log("useEffect newPost Info", newPost.data.Info)
            console.log("useEffect newPost Info", newPost.data["Info"])
            addNewPost(newPost.data)
            setNewPost(null)
        }
    }, [newPost])
    
    const addNewPost = ({post}) => {
        console.log("Post from socket", post)
        try {
          
          const objData = JSON.parse(post);
          
          if (objData.Info === undefined || objData?.Info !== "new post" ) return; 
            
          if (objData.Type === 1) {
            
            const newPost = objData.Message;
              
            setLastsPosts((prev) => [...prev, newPost])
              //scrollToLastMessage()     

          }
        } catch (error) {
          console.log(error)
        }
      }
    
    return(
      <Container maxW='container.sm' colorScheme="green">  
        {lastPosts &&
          <VStack spacing={4} align='stretch' >
          {
            lastPosts.map(post=>
                <VStack key={post} alignItems="start">
                    <HStack>
                        <Avatar size='md' name='User`s name' src=''></Avatar>
                        <WrapItem><Text fontSize='md' mb='0' ml='1rem'>User's name</Text></WrapItem>
                    </HStack>
                    <Text ml='1rem' fontSize='md'>{post}</Text>
                </VStack>
            )         
          }
          </VStack>
        }
      </Container>  
    )
}