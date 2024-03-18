// import { signOut, getRedirectResult, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { Button, useToast, useBreakpointValue } from "@chakra-ui/react"
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useReactiveVar } from "@apollo/client";
import { varNeoUser } from '../../../variables';
import { useAuth } from "../../Auth/AuthContext";
import { useTranslation } from "react-i18next";


const Signout = (props) => {
    //const {auth, user} = props;
    const toast = useToast();
    const { currentUser, logout } = useAuth();
    const { t } = useTranslation();
    const buttonText = useBreakpointValue(['', t('signout')])
    const signout = () => {
        if (currentUser != null){
            logout();
            varNeoUser(null)
            toast({
                // title: 'Пользователь вышел',
                description: "Exit",
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
            {buttonText}
        </Button>
    )
  }
  

export default Signout;
