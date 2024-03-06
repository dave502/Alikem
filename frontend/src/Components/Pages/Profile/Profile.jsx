import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileForm from './Components/ProfileForm';
import Signout from  '../../Elements/Header/Signout';
import { useAuth } from '../../Auth/AuthContext';
import { varNeoUser } from '../../../variables';
import { gql, useQuery, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import {
  Grid,
  GridItem,
  Center,
  Spacer,
  Flex,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from "react-i18next";
import { Tabs, TabList, TabPanels, Tab, TabPanel, useToast, useColorModeValue } from '@chakra-ui/react'
import WordsArea from '../../Elements/Words/WordsArea';


function Profile(props) {

  const [userData, setUserData] = useState(); 
  const [params, setParams] = useSearchParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const neoUser = useReactiveVar(varNeoUser);
  const toast = useToast();
  const { t } = useTranslation();
  const newUser = true;
  
  useEffect(() => {
    if (!currentUser) {
        navigate("/login");
      }
  }, [currentUser, navigate]);
  
  
  const UPDATE_USER_POFILE = gql`
  mutation updateUser($uid: String!, 
                      $name: String,
                      $gender: Gender,
                      $birthday: Date,
                      $city: String,
                      $cityID: Int,
                      $img: String,
                      $location: PointInput,
                      )
  {
    updateUsers(
      where: {uid: $uid}
      update: {
        name: $name,
        gender: $gender,
        birthday: $birthday,
        city: $city,
        cityID: $cityID,
        img: $img,
        location: $location,
      }
    )
    {
      users{
        name
        gender
        birthday
        city
        cityID
        img
        location{
          latitude
          longitude
        }
      }
    }
  }
  `;    
  const [gqlUpdateUserProfile, { data, loading, error }] = useMutation(UPDATE_USER_POFILE);


  const updateUserProfile = (values) => {
    
    gqlUpdateUserProfile({ variables: { uid: currentUser.uid, ...values}})
    .then((response) => {
      if (response.data.updateUsers.users.length && newUser){
        varNeoUser(response.data.updateUsers.users[0])

        navigate("/friends");
      }
    })
    .catch((error) => {
      console.log("error", error)
    });
  }

  const swowWordsSavedMessage = (v) => {
    toast({ description: 'Текст сохранён',
            duration: 2000,
            isClosable: true, 
            colorScheme: "green",
          })
  }
  
  const bgTabBar = useColorModeValue('green.50', 'darkslategrey')
      
  return (
    <>
    <Tabs defaultIndex={0} colorScheme="green">
    <Center  bg={bgTabBar}>
    <TabList>
      <Tab>{t("profile")}</Tab>
      <Tab>{t("words")}</Tab>
      <Tab>{t("settings")}</Tab>
      <Flex position={"absolute"} right="5"><Signout/></Flex>
    </TabList>
    </Center>

  <TabPanels>
    <TabPanel>
      <VStack>
        { currentUser?.uid&&
        <ProfileForm 
            uid={currentUser.uid}
            updateUserProfile={updateUserProfile}/>
        }
      </VStack>
    </TabPanel>
    <TabPanel>
      { currentUser?.uid&&
        <WordsArea uid={currentUser.uid} setReady={swowWordsSavedMessage}/>
      }
    </TabPanel>
    <TabPanel>
      {t("settings")}
    </TabPanel>
  </TabPanels>
</Tabs>
    
    {/* <Grid
      templateAreas={`"header header"
                      "main main"
                      "footer footer"`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'250px 1fr'}
      h='200px'
      gap='1'
      color='blackAlpha.700'
      fontWeight='bold'
    >
      <GridItem pl='2' bg='green.50' area={'header'}>
        <Flex>
        <Spacer/>
          <Signout auth={auth} user={user}/>
        </Flex>
      </GridItem>
      <GridItem pl='2' area={'nav'}>
     
      </GridItem>
      <GridItem pl='2' area={'main'} >
        <Center>
        <ProfileForm 
          {...userData}
          updateUserProfile={updateUserProfile}/>
        </Center>
      </GridItem>
      <GridItem pl='2' area={'footer'}>

      </GridItem> 
    </Grid> */}
    </>
  );
}

export default Profile;
