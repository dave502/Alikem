import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { EditIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
