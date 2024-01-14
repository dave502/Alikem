import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { EditIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";

        const firebaseConfig = {
          apiKey: "AIzaSyCJ2L2s2-0ucV5nGe8SNW1LXjIMGuqotWc",
          authDomain: "friends-a2c14.firebaseapp.com",
          projectId: "friends-a2c14",
          storageBucket: "friends-a2c14.appspot.com",
          messagingSenderId: "161615978886",
          appId: "1:161615978886:web:e4788c9464ebae7a5d4c07",
          measurementId: "G-X8DKXH3C45"
        };
        
        
function Home(props) {
  const navigate = useNavigate();
  const [userAuthorized, setUserAuthorized] = useState(true);
  const {auth} = props;
  
  useEffect(() => {
    if (!userAuthorized) {
        navigate("/login");
      }
  }, [userAuthorized, navigate]);
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("user", user)
      // ...
    } else {
      setUserAuthorized(false)
    }
  });   
  
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>        
      <Box padding="5" marginBlockEnd={5}>
        <Text fontSize="3xl" paddingBlockEnd={5}>
          Home page
        </Text>
      </Box>
      <Box>
        <Stack direction="row" spacing={7}>
          <Link to="register">
            <Button
              size="lg"
              leftIcon={<EditIcon />}
              colorScheme="green"
              variant="solid"
            >
              Register
            </Button>
          </Link>
          <Link to="login">
            <Button
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              colorScheme="green"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}

export default Home;
