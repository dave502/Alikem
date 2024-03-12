import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { useAuth } from '../../../../Auth/AuthContext';
import {
  Spinner,
  VStack,
  Container,
  Text,
  Flex,
  Center,
  useColorModeValue,
  Card, CardBody, Image,
} from '@chakra-ui/react';

export default function ChatMemberInfo(props) {
  
  const { uid } = props;
  
  const [showAdd, setShowAdd] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [membersInfo, setMembersInfo] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const refMembersNavBar = useRef();
  
  
  const GET_USER_INFO = gql`
    query Users($uid: String!)
    {
      users( where: {uid: $uid} )
      {
        name
        name_id
        privateProfile
        city
        birthday
        approved
        gender
        img
      }
    }
    `;
    
    const { data, loading, error } = useQuery(GET_USER_INFO, {variables: { uid: uid },});

    // useEffect(() => {
    //   if (data?.users.length) {  
    //     setMembersList(data.groups[0].users.filter((user)=>user.uid != currentUser.uid)) 
    //   } 
    // }, [data]);

    const onClickChatMember = (e) => {

    }
    
    // const toggleShowAdd = (e) => {
    //   setShowAdd(!showAdd)
    // }

    const bgChatListBar = useColorModeValue('green.50', 'darkslategrey')
    
    const txtColor = useColorModeValue('darkslategrey', 'green.200')

  return(
      <VStack>
        <Flex
              as="nav"
              wrap="wrap"
              w="100%"
              height='40px'
              bg={bgChatListBar}
              px='3'
              py='1'            
            >
              {/* <Spacer/>
                <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='add'
                  fontSize='15px'
                  icon={<AddIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  // onClick={toggleShowAdd}
                /> */}
                {/* <IconButton
                  isRound={true}
                  colorScheme='green'
                  aria-label='del'
                  fontSize='15px'
                  icon={<DeleteIcon />}
                  mr='3'
                  variant='outline'
                  size='sm'
                  // onClick={toggleShowDel}
                  // isDisabled={ !selectedChat } 
                />  */}
        </Flex> 

          <Container  p={0} overflowY='scroll' color='green'>
                <div ref={refMembersNavBar}></div>
                {error && <Text color='tomato' m='3'>{error.message}</Text>}
                {loading && <Flex direction='column' height='full' justify='center' alignItems='center'>
                              <Spinner color='green' size='xl'/>
                            </Flex>
                }
                {data && 
                
                <Card maxW='sm' py='0' border='0' bg='transparent'>
                  <CardBody py='0'>
                    <Center>
                    <Image src={data.users[0].img} fallbackSrc='https://via.placeholder.com/200' borderRadius='lg'/>
                    </Center>
                    <Text as='b' fontSize='lg'>
                        {data.users[0].name}
                      </Text>
                      {/* approved: null
                      ​​birthday: "1991-05-01"
                      ​city: "Сеул"
                      ​​​gender: "male"
                      ​​​img: null
                      ​​​name: "Gim"
                      ​​​name_id: null
                      ​​​privateProfile: null */}
                  </CardBody>
                  {/* <Divider />
                  <CardFooter>
                    <ButtonGroup spacing='2'>
                      <Button variant='solid' colorScheme='blue'>
                        Text
                      </Button>
                      <Button variant='ghost' colorScheme='blue'>
                      Text
                      </Button>
                    </ButtonGroup>
                  </CardFooter> */}
                </Card>
                }
            </Container>
        
      </VStack>
  );
}
