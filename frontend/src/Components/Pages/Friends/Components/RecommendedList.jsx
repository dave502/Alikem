import { VStack, Text } from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";

const GET_SIMILAR_USERS_QUERY = gql`
  query similarUsers($uid:String!){
    similarUsers( uid: $uid)
    {
      uid
      name
      city
      birthday  
      gender      
      score
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


function RecommendedList(props){
    
  const { uid } = props; 
  
  const { t } = useTranslation();
  
  const { loading, error, data } = useQuery(GET_SIMILAR_USERS_QUERY, {
      variables: { uid: uid },
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
  {data? (
      <>
      {data.similarUsers.length ? data.similarUsers.map((obj) => (
              <UserListItem currentUid={uid} user={obj} mode="recomendations" key={obj.uid}/>
          )):(
              <Text>{t("no_recommendations")}</Text> 
          )
      }
      </>
  ):
  <Text>Поиск...</Text>
  }
  </VStack>
  );
}
 
 export default RecommendedList;