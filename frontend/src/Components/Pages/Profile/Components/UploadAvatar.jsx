import React, { useState } from 'react';
import {
    AspectRatio,
    Box,
    BoxProps,
    Container,
    forwardRef,
    Heading,
    Input,
    Stack,
    Text,
    Avatar
  } from "@chakra-ui/react";
  import { motion, useAnimation } from "framer-motion";
  import { useTranslation } from "react-i18next";
 
  const imgTransition = {
    rest: {
      scale: 1.5,
      // filter: "grayscale(0%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn"
      }
    },
    hover: {
      scale: 1.3,
      // filter: "grayscale(80%)",

      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut"
      }
    }
  };
  
  const PreviewImage = ((props, ref) => {
    
    return (
      <Box
        bg="white"
        top="0"
        height="100%"
        width="100%"
        position="absolute"
        borderWidth="1px"
        borderStyle="solid"
        rounded="sm"
        as={motion.div}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        {...props}
        ref={ref}
      />
    );
  });
  
  export default function UploadAvatar(props) {
    
    const { setFieldValue, blobImg } = props;
    
    //const [profileImage, setProfileImage] = useState(null);
    const { t } = useTranslation();
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();
    
    console.log("UploadAvatar img", blobImg, typeof(blobImg))
    const imgURL = blobImg? URL.createObjectURL(blobImg) : undefined
    console.log("UploadAvatar imgURL", imgURL)
    
    return (
      <Container centerContent>
        <AspectRatio width="64" ratio={1}>
          <Box
            borderColor="lightgray"
            borderStyle="solid"
            borderWidth="2px"
            rounded="md"
            shadow="sm"
            role="group"
            transition="all 150ms ease-in-out"
            _hover={{
              shadow: "md"
            }}
            as={motion.div}
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            <Box position="relative" height="100%" width="100%">
              <Box
                position="absolute"
                top="5"
                left="0"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="column"
              >
                <Stack
                  height="100%"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justify="center"
                  spacing="4"
                >
                  <Box height="24" width="24" position="relative">
                    <PreviewImage
                      variants={imgTransition}
                      backgroundImage={`url(${imgURL ? imgURL:"/default_avatar.jpeg"})`}
                    />
                  </Box>
                  <Stack p="2" textAlign="center" spacing="1">
                    <Heading fontSize="md" fontWeight="bold">
                      {t("upload_photo_drag")}
                    </Heading>
                    <Text fontWeight="light" fontSize="md"> {t("upload_photo_click")}</Text>
                  </Stack>
                </Stack>
              </Box>
              <Input
                type="file"
                id="avatar" 
                name="avatar" 
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                aria-hidden="true"
                accept="image/*"
                onDragEnter={startAnimation}
                onDragLeave={stopAnimation}
                //{...field}
                onChange={(event) => {
                  setFieldValue("img", event.target.files[0]);
                }}
              />
            </Box>
          </Box>
        </AspectRatio>
        </Container>
    );
  }
  
  
  // const onSubmit = async (values) => {
  //   const body = new FormData();
  
  //   body.append('myFile', values.myFile);
  
  //   await fetch('api/upload', {
  //     method: 'POST',
  //     body,
  //   });