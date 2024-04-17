import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { gql, useQuery } from "@apollo/client";
import { useNavigate, useLocation  } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { Container, Box, Input, Button, Link } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter,  SimpleGrid, Heading, Text, Spacer, Flex} from '@chakra-ui/react'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import Contribution from '../../Elements/Contribution/Contribution';

function Foundations(props) {

  const [cardsFilter, setCardsFilter] = useState('')
  const [contributeTo, setContributeTo] = useState()
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const GET_FOUNDATIONS_QUERY = gql`
    query getFoundations($country: String!) {
      funds(where: { country: $country })
      {
        fundID
        name
        site
        picture
        description
      }
    }
  `;
  
const { data, loading, error } = useQuery(GET_FOUNDATIONS_QUERY, { variables: { country: i18n.language }});


//   const organisations = [
//     {name: "Биосфера Балтики", country: "ru", description: "Центр реабилитации и реинтродукции диких животных", url: "https://balticbiosphere.ru"},
//     {name: "Реабилитационный центр морских млекопитающих «Тюлень»", country: "ru", description: "Первый в России центр спасения тюленей и других морских млнеопитающих", url: "https://largahelp.com"},
//     {name: 'WWF',  country: "en", description: "The leading organization in wildlife conservation and endangered species.", url: "https://protect.worldwildlife.org/page/63250/donate/1"},
//   ]
  useEffect(() => {
    if (data) {
        console.log("data funds", data.funds)
      }
      
    if (error) {
      console.log("GET_FOUNDATIONS_QUERY error ", error.message)
    }
    
  }, [data, loading, error]);
  

  const handleCardsFilter = (event) => setCardsFilter(event.target.value.toLowerCase())
  
  const Contribute = async e => {
    console.log(e)
    setContributeTo(e.target.value)
  };
  

  return (
    
    <Container maxW="2xl" marginTop="3rem" centerContent>
      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
        {/* Search Field */}
        <Input
          mb={3}
          value={cardsFilter}
          onChange={handleCardsFilter}
          placeholder={t("search")}
          _placeholder={{ color: 'seagreen' }}
        />
        {/* Cards of Funds */}
        {data &&
          <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
          {
            data.funds
          //   .filter(({country}) => {
          //     return country === i18n.language 
          //   })
            .filter(({name}) => {
              const lcName = name.toLowerCase();
              return lcName.includes(cardsFilter) // || description.includes
            })
            .map(org => 
              <Card
                key={org.name}>
              <CardHeader>
                <Heading size='md'>{org.name}</Heading>
                <Link py='2' pos="bottom" fontSize="sm" href={org.url} isExternal>
                    {org.url} <ExternalLinkIcon mx='1px' />
                </Link>
              </CardHeader>
              <CardBody>
                <Flex>
                  <Text fontSize='md'>{org.description}</Text>
                  <Spacer />
                </Flex>
              </CardBody>
              <CardFooter justifyContent="center">
                  <Contribution fundID={org.fundID}/>
              </CardFooter>
            </Card>)
            }
          </SimpleGrid>
        }
      </Container>
    </Container>
  );
}

export default Foundations;
