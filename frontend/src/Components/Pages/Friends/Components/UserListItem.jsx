import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Flex,
    Avatar,
    Box,
    Heading,
    Text,
    IconButton,
    Image,
    Button,
    Progress,
    Center,
    Spacer,
} from '@chakra-ui/react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import { BsThreeDotsVertical, BsPersonAdd } from "react-icons/bs";
import { BiChat } from "react-icons/bi";
import { MdPersonAddAlt } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineUserAdd } from "react-icons/ai";
import SendFriendsRequestFromList from './SendFriendRequest/SendFriendsRequestFromList.jsx'
import CancelFriendsRequestFromList from './SendFriendRequest/CancelFriendsRequestFromList.jsx'
import AcceptFriendsRequestFromList from './SendFriendRequest/AcceptFriendsRequestFromList.jsx'

function UserListItem(props){
    
   const { currentUid, user, confirmed, initiator, directChatID, deleteFriend, mode } = props; 
   const similar_colors = ["red.500", 
                           "red.400", 
                           "red.300",
                           "red.200",
                           "red.100",
                           "green.100",
                           "green.200",
                           "green.300",
                           "green.400",
                           "green.500",
                           "green.600",
                        ]
    
    const navigate = useNavigate();
    const startDirectChat = () => {
        const {first_uid, second_uid} = (currentUid === initiator) 
            ? {first_uid: currentUid, second_uid: user.uid}
            : {first_uid: user.uid, second_uid: currentUid}
        navigate('/chat', {state:{
            type:'direct', 
            to:user.name,
            members:[first_uid, second_uid], chat:directChatID||""}}); 
    }
                                         
                        
    return (
    <Card maxW='md'  minW="600"  key={user.uid} variant={"elevated"}>
     <CardHeader p='2'>
        <Flex spacing='4' pb='2'>
            <LinkBox>
            <Flex flex='1' gap='5' alignItems='center' flexWrap='wrap' mr={"5"}>
                <Avatar name={user.name} src='default_avatar.jpeg' />

                <Box>
                    {/* <Heading size='sm'>Segun Adebayo</Heading> */}
                    
                    <LinkOverlay href={"/viewprofile?id=" + user.uid}>
                        <Text fontSize={"md"}>{user.name}</Text>
                    </LinkOverlay>
                </Box>
            </Flex>
            </LinkBox>
            <Spacer/>
            {(mode === "recomendations" || mode === "search") &&
                <SendFriendsRequestFromList  currentUid={currentUid} otherUid={user.uid}/>
            }
            {(mode === "friends_in" && !confirmed) && 
                <AcceptFriendsRequestFromList 
                  currentUid={currentUid} 
                  otherUid={user.uid}
                  initiator={initiator}
                  requestSender={deleteFriend}
                  mode={mode}
                />
            }
            {(mode.startsWith("friends") && !confirmed) && 
                <CancelFriendsRequestFromList 
                  currentUid={currentUid} 
                  otherUid={user.uid}
                  initiator={initiator}
                  deleteFriend={deleteFriend}
                  mode={mode}
                />
            }
            {(mode.startsWith("friends") && confirmed) && 
                <>
                <IconButton
                    variant='ghost'
                    colorScheme='green'
                    aria-label='Chat'
                    icon={<BiChat />}
                    size={"lg"}
                    onClick={startDirectChat}
                /> 
            
                <Menu>
                    <MenuButton 
                        as={IconButton} 
                        icon={<BsThreeDotsVertical />} 
                        colorScheme='green'
                        variant='ghost' 
                        size={"lg"}/>
                    <MenuList minW='48px' width="max-content" p='0' m='0'>
                        <MenuItem p='0' m='0' >
                            <CancelFriendsRequestFromList 
                                currentUid={currentUid} 
                                otherUid={user.uid}
                                initiator={initiator}
                                deleteFriend={deleteFriend}
                                mode={mode}
                                />
                        </MenuItem>
                    </MenuList>
                </Menu>
                </>
            }
        </Flex>
        <Center> 
            <Progress value={user.score*100} 
                    size='xs'
                    width={"80%"}
                    sx={{
                        '& > div': {
                          background:similar_colors[Math.floor(user.score*10)],
                        },
                      }}
                      />
        </Center>
       
    </CardHeader>
    {/* {similar_colors[Math.floor(user.score*10)]}  */}
    {/* <CardBody>
        <Text>
        With Chakra UI, I wanted to sync the speed of development with the speed
        of design. I wanted the developer to be just as excited as the designer to
        create a screen.
        </Text>
    </CardBody> */}
     {/* <CardFooter
        justify='space-between'
        flexWrap='wrap'
        p={"0"}
        sx={{
        '& > button': {
            minW: '136px',
        },
        }}
    >
        <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
        Chat
        </Button>
    </CardFooter>  */}
    </Card>
  );
}

export default UserListItem;