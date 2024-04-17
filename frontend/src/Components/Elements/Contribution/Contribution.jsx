
import { browserPopupRedirectResolver, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import IconHandHeart from "./IconHandHeart";    

function Contribution(props) {
    
  const { auth, mode, setResult} = props;
  
  const { t } = useTranslation();  
    
  const Contrubute = async() => {
    
    const today = new Date(Date.now());
    // gqlSetUserGood({ variables: { uid: currentUser.uid, good: true, fund: "Биосфера Балтики", now: today}})
    // .then((response) => {
    //   navigate("/words");
    // })
    // .catch((error) => {
    //   console.log(error)
    // });    
  }

  
  return (
    <Button
        size="lg"
        minW='280px'   
        leftIcon={<IconHandHeart/>}
        colorScheme="green"  
        variant="outline"
        type="button"      
        onClick={Contrubute}
        isDisabled
    >   
        {t("contribute")}
    </Button>
  );
}

export default Contribution;