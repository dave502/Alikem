import React, { useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Box,
  SkeletonCircle,
  SkeletonText,
  Input,
  Stack,
  Button,
  Center,
  Radio, RadioGroup,
  VStack,
  HStack,
  Grid, GridItem,
  Image,
} from '@chakra-ui/react';

import { Field, Form, Formik } from 'formik';
import SelectCity from '../../../Elements/SelectCity/SelectCity';
import UploadAvatar from './UploadAvatar';
import Interests from './Interests';

import { useTranslation } from "react-i18next";

const READ_USER_POFILE = gql`
query Users($uid: String!)
{
  users( where: {uid: $uid} )
  {
    name
    gender
    birthday
    city
    cityID
    img    
    interests {
      interestID
      interestName
    }
  }
}
`;

function ProfileForm(props) {
  
  
    const { uid, updateUserProfile } = props
    const { t } = useTranslation();
    
    const { data, loading, error } = useQuery(READ_USER_POFILE, {
      variables: { uid: uid }
    });
    
    useEffect(() => {
      console.log(data, uid)
      // if (data){
      //   const user = new Object();
      //   Object.entries(data.users[0]).forEach(v => user[v[0]] = v[1] || null)
      //   setProfileData(user)
      // }
    }, [data]);
  
    function validateName(value) {
      let error
      // if (!value) {
      //   error = 'Имя обязательно нужно указать!'
      // } else if (value.toLowerCase() !== 'naruto') {
      //   error = "Jeez! You're not a fan 😱"
      // }
      //return error
    }
    
    function validateCity(value) {
      let error
      // if (!value) {
      //   error = 'Имя обязательно нужно указать!'
      // } else if (value.toLowerCase() !== 'naruto') {
      //   error = "Jeez! You're not a fan 😱"
      // }
      //return error
    }
       
    if (loading) return (
      <VStack>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </VStack>
    );
    if (error) return `Error! ${error}`;
  
  // const newLocal = <Input {...field} placeholder='Город' bg="white" />;
    return ( //data?.users.length &&

      <Formik
        enableReinitialize
        initialValues={{ 
                        name: data.users[0].name,
                        gender: data.users[0].gender, 
                        avatar: data.users[0].avatar, 
                        city: data.users[0].city, 
                        birthday: data.users[0].birthday,
                        interests: data.users[0].interests,
                      }}
        onSubmit={async (values, { setSubmitting }) => {
          await new Promise((r) => setTimeout(r, 500));
          const result = new Object();
          Object.entries(values).forEach(v => result[v[0]] = v[1] || undefined)
          updateUserProfile(result);
          setSubmitting(false);
        }}  
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form style={{'width':'100%', 'maxWidth': '600px'}}>
            <Field name='avatar' validate={validateName}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <HStack>
                    <FormLabel style={{"width":'100px'}}>{t("photo")}</FormLabel>
                    <UploadAvatar setFieldValue={setFieldValue} field={field} img={values.avatar}/>
                  </HStack>
                  <FormErrorMessage>"{form.errors.name}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name='name' validate={validateName}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} isRequired mb={3}>
                  <HStack>
                    <FormLabel style={{"width":'100px'}}>{t("name")}</FormLabel>
                    <Input {...field} placeholder={t("name_hint")} maxW={600}/>
                  </HStack>
                  <FormErrorMessage>"{form.errors.name}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            
            <Field name='city' validate={validateCity}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <HStack>
                    <FormLabel style={{"width":'100px'}}>{t("city")}</FormLabel>
                    <SelectCity field={field} setFieldValue={setFieldValue}/>
                  </HStack>
                  <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="gender">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <RadioGroup  colorScheme='green' defaultValue='' value={field.value}>  
                  <Stack spacing={5} direction={['column', 'row']}>
                    <FormLabel style={{"width":'100px'}} >{t("gender")}</FormLabel>
                    <Radio {...field} value="male" checked={field.value === 'male'} size='lg' ml={['100px', '0']}>
                      {t("male")}
                    </Radio>
                    <Radio {...field} value="female" checked={field.value === 'female'} size='lg'ml={['100px', '0']}>
                      {t("female")}
                    </Radio>
                    <Radio {...field} value="" checked={field.value === ''} size='lg' ml={['100px', '0']}>
                      {t("omit")}
                    </Radio>
                  </Stack>
                  </RadioGroup>
                
                </FormControl>
              )}
            </Field>
            
            
            <Field name='birthday' validate={validateName}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <HStack>
                    <FormLabel style={{"width":'100px'}}>{t("birthday")}</FormLabel>
                    <Input {...field} placeholder='' width='full' type="date"/>
                  </HStack>
                  <FormErrorMessage>"{form.errors.name}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            
            <Field name='interests'>
              {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                    <HStack>
                      <FormLabel style={{"width":'100px'}}>{t("interests")}</FormLabel>
                      <Interests field={field} setFieldValue={setFieldValue}/>
                    </HStack>
                  </FormControl>
                )}
            </Field>
            
            <Button
              mt={4}
              // ml={120}
              colorScheme='green'
              isLoading={isSubmitting}
              type='submit'
            >
              {t("save")}
            </Button>
          </Form>
        )}
      </Formik>
    )
  }
  
export default ProfileForm;