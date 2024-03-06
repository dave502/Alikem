import React, { useState } from 'react';
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import ResizeTextarea from "react-textarea-autosize";
import BeatLoader from "react-spinners/BeatLoader";
import { useTranslation } from "react-i18next";
import {
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea,
    Box,
    Progress,
    Stack,
    Button,
    Center,
  } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

function WordsArea(props) {
    
  const { setReady, uid } = props;
  const [wordsCount, setWordsCount] = useState(0);
  const [words, setWords] = useState('');
  const [isWordsEnough, setWordsEnough] = useState(false);
  const { t } = useTranslation();
  const SET_USER_EMBEDDING = gql`
    mutation setUserEmbedding($uid: String!, $text: String!){
        setEmbedding(uid: $uid, text: $text) {
          uid
        }
    }
    `;
  const [gqlSetUserEmbedding, { data, loading, error }] = useMutation(SET_USER_EMBEDDING);
  
  const countWords = e => {
    let words_count = e.target.value.split(/(?:;|\n|\r)+/).filter(s => s.trim().length > 0).length

    // var arr = str.split(",").map(function(item) {
    //   return item.trim();
    // });
    setWordsCount(words_count)
    setWordsEnough(words_count >= 100)
    setWords(e.target.value)
  };
  
  const saveEmbedding = async e => {
    e.preventDefault();

    gqlSetUserEmbedding({ variables: { uid: uid, text: words }})
    .then((response) => {
      if (response.data.setEmbedding.uid && setReady){
        setReady(true)
        setWords("")
      }
    })
    .catch((error) => {
      console.log("error", error)
    });
  };
  
    
  return (
    <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
    <Box borderRadius="lg" padding={10} borderWidth="2px">
      <Stack spacing={5}>
        <Progress colorScheme='green' size='sm' value={wordsCount} />
        <FormControl>
          <Textarea
           minHeight="50vh"
        //    colorScheme='green' 
           focusBorderColor='green.600' 
           css={{
            '&::-webkit-scrollbar': {
              width: '30',
            },
            '&::-webkit-scrollbar-track': {
              width: '60px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: "green",
              borderRadius: '24px',
            },
          }}
            size='md'
            resize='vertical'
            value={words}
            onChange={countWords}
            placeholder={t("words_hint")}
            // minRows={50}
            // as={ResizeTextarea}
          />
        </FormControl>
        <Center >
          <Button
            {...(isWordsEnough ? {} : { isLoading: true })}
            loadingText={`${wordsCount}`}
            size="lg"
            rightIcon={<ArrowRightIcon />}
            colorScheme="green"
            variant="solid"
            type="submit"
            onClick={saveEmbedding}
            spinner={<BeatLoader size={8} color='white' />}
          >
            {t("save")}
          </Button> 
        </Center>
      </Stack>
    </Box>
  </Container>
  );
}

export default WordsArea;
