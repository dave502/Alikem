// import { signOut, getRedirectResult, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { Button, useToast } from "@chakra-ui/react"
import { RiLogoutCircleRLine } from "react-icons/ri";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { varNeoUser } from '../../../variables';
import { useAuth } from "../../Auth/AuthContext";

const Signout = (props) => {
    //const {auth, user} = props;
    const toast = useToast();
    const neoUser = useReactiveVar(varNeoUser);
    const { currentUser, logout } = useAuth();
    
    const signout = () => {
        if (currentUser != null){
            logout();
            varNeoUser(null)
            toast({
                title: 'Пользователь вышел',
                description: "Вы вышли из системы",
                status: 'success', //loading error
                duration: 2000,
                isClosable: true,
              })
        }else{
            toast({
                title: 'Ошибка выхода из системы',
                description: "При выходе из системы произошла ошибка",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
        
    }
    
    return (   
        <Button 
            leftIcon={<RiLogoutCircleRLine />} 
            colorScheme='green' 
            variant='link'
            onClick={signout}
            mt={3}
            >
            Выйти
        </Button>
    )
  }
  

export default Signout;
