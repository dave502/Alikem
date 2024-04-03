import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileForm from './Components/ProfileForm';
import Signout from  '../../Elements/Header/Signout';
import { useAuth } from '../../Auth/AuthContext';
import { varNeoUser } from '../../../variables';
import { gql, useQuery, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { Center, Flex, VStack } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";
import { Tabs, TabList, TabPanels, Tab, TabPanel, useToast, useColorModeValue } from '@chakra-ui/react'
import WordsArea from '../../Elements/Words/WordsArea';


function Profile(props) {

  // const [userData, setUserData] = useState(); 
  // const [params, setParams] = useSearchParams();
  // const neoUser = useReactiveVar(varNeoUser);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const newUser = true;
  
  useEffect(() => {
    if (!currentUser) {
        navigate("/login");
        return;
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
                      $interestIDs: [String],
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
        interests: [{connect: {where: {node: {interestID_IN: $interestIDs}}}}],
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
    
    console.log("updateUserProfile starts")
    
    console.log("updateUserProfile values", values)
    
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
                  user={currentUser}
                  updateUserProfile={updateUserProfile}/>
              }
            </VStack>
          </TabPanel>
          <TabPanel>
            { currentUser?.uid&&
              <WordsArea uid={currentUser.uid} setReady={swowWordsSavedMessage} isDisabled={true}/>
            }
          </TabPanel>
          <TabPanel>
            {t("settings")}
          </TabPanel>
        </TabPanels>
      </Tabs>

    </>
  );
}

export default Profile;
