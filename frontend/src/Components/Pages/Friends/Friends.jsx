import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext.jsx';
import { useTranslation } from "react-i18next";
import { Center, VStack } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react';
import SearchForm from"./Components/SearchForm.jsx";
import FriendsList from './Components/FriendsList.jsx';
import RecommendedList from './Components/RecommendedList.jsx';
import FoundList from './Components/FoundList.jsx';

function Friends(props) {
  
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/profile'); 
  const [userAuthorized, setUserAuthorized] = useState(true);
  const [searchFilter, setSearchFilter] = useState();
  const [tabIndex, setTabIndex] = useState(0)
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
        navigate("/login");
      }
  }, [currentUser, navigate]);
  
  const newUser = true;
  
  const tabs = ["friends", "recommendations", "search"]
  
  const bgFriendsTabBar = useColorModeValue('green.50', 'darkslategrey')
    
  return (
     

      <Tabs defaultIndex={0} 
        colorScheme="green" 
        onChange={(index) => setTabIndex(index)}
        isLazy
      >
          <Center  bg={bgFriendsTabBar}>
          <TabList>
            <Tab>{t("friends")}</Tab>
            <Tab>{t("recommendations")}</Tab>
            <Tab>{t("search")}</Tab>
          </TabList>
          </Center>

        <TabPanels>
          <TabPanel>
              {currentUser?.uid && <FriendsList uid={currentUser.uid} update={tabIndex===0}/>}
          </TabPanel>
          <TabPanel>
              {currentUser?.uid && <RecommendedList uid={currentUser.uid} update={tabIndex===1}/>}
          </TabPanel>
          <TabPanel>
            <VStack>
              <SearchForm setSearchFilter={setSearchFilter}/>
              {searchFilter && <FoundList searchFilter={searchFilter} uid={currentUser.uid} update={tabIndex===2}/>}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
  );
}

export default Friends;
