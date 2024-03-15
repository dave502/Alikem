import React, { useState, useEffect } from 'react';
import { useReactiveVar } from "@apollo/client";
import { varNeoUser } from '../../../../variables.js';
import getAge from '../../../../Tools/get-age.js';
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Radio, RadioGroup,
  HStack,
} from '@chakra-ui/react';

import { 
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react'

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'


import { Field, Form, Formik } from 'formik';
import SelectCity from '../../../Elements/SelectCity/SelectCity.jsx';

function SearchForm(props) {
  
    const { setSearchFilter } = props;
    
    const neoUser = useReactiveVar(varNeoUser);
    const { t } = useTranslation();
    
    const [similarity, setSimilarity] = useState(90);
    const [gender, setGender] = useState('');
    const [city, setCity] = useState(neoUser?.city);
    const [cityID, setCityID] = useState(neoUser?.cityID);
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(100);
    
    useEffect(() => {
      const userAge = getAge(neoUser.birthday)
      setCity(neoUser.city);
      setCityID(neoUser.cityID);
      setMinAge(userAge-3);
      setMaxAge(userAge+3);
    }, [neoUser]);

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
      // if (!value) {
      //   error = 'Имя обязательно нужно указать!'
      // } else if (value.toLowerCase() !== 'naruto') {
      //   error = "Jeez! You're not a fan 😱"
      // }
      //return error
    }
    
    
    function validateAge(value) {
      // if (!value) {
      //   error = 'Имя обязательно нужно указать!'
      // } else if (value.toLowerCase() !== 'naruto') {
      //   error = "Jeez! You're not a fan 😱"
      // }
      //return error
    }
    
    const onChangeSimilarity = value => {
      setSimilarity(value)
    };  
    
    const onChangeAge = value => {
      // setMinAge(value)
    };  

    return (neoUser &&
      <Formik
        enableReinitialize
        initialValues={{ 
                        similarity: similarity,
                        gender: gender, 
                        city: city || "", 
                        cityID: cityID || 0, 
                        // location: location,
                        minAge: minAge || 0,
                        maxAge: maxAge || 100,
                      }}
        onSubmit={async (values, { setSubmitting }) => {
          await new Promise((r) => setTimeout(r, 500));
          const result = new Object();
          Object.entries(values).forEach(v => result[v[0]] = v[1] || undefined)
          var fromDate = new Date();
          var toDate = new Date();
          fromDate.setFullYear(fromDate.getFullYear() - result.minAge);
          toDate.setFullYear(toDate.getFullYear() - result.maxAge);
          result.minAge = fromDate.toISOString().split('T')[0];
          result.maxAge = toDate.toISOString().split('T')[0];;
          setSearchFilter(result);
          // searchUsers(result);
          setSubmitting(false);
        }}  
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form width='full'>
            
            <Field name='similarity' validate={validateName}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}  pt='8'>
                  <HStack>
                  
                    <FormLabel width={"100px"}>{t("similarity")}</FormLabel>
                    
                    <Slider
                        flex='1'
                        focusThumbOnChange={false}
                        {...field}
                        onChange={(v)=>setFieldValue("similarity", v)}
                        isDisabled={"true"}
                        // onChange={onChangeSimilarity}
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg='green'/>
                        </SliderTrack>
                        <SliderThumb fontSize='sm' boxSize='32px' children={field.value} />
                      </Slider>
                    
                    {/* <RangeSlider aria-label={['min', 'max']} defaultValue={[0, 80]} onChangeEnd={onChangeSimilarity}  width={600}>
                      <RangeSliderTrack bg='green.100'>
                        <RangeSliderFilledTrack bg='green' />
                      </RangeSliderTrack>
                      <RangeSliderThumb boxSize={7} index={1}  bg='green'  {...field} >
                        <Text fontSize="md" pb="0" color={"white"}> {valSimiarity} </Text>
                      </RangeSliderThumb>
                    </RangeSlider> */}
                  </HStack>
                  <FormErrorMessage>"{form.errors.name}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            
            <Field name='city' validate={validateCity}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <HStack>
                    <FormLabel width={"100px"}>{t("city")}</FormLabel>
                    <SelectCity field={field} setFieldValue={setFieldValue} />
                  </HStack>
                  <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="gender">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={3}>
                  <RadioGroup  colorScheme='green' value={field.value}>  
                  <HStack spacing={5}>
                    <FormLabel width={"100px"}>{t("gender")}</FormLabel>
                    <Radio {...field} value="male" checked={field.value === 'male'} size='lg'>
                    {t("male")}
                    </Radio>
                    <Radio {...field} value="female" checked={field.value === 'female'} size='lg'>
                    {t("female")}
                    </Radio>
                    <Radio {...field} value="" checked={field.value === ''} size='lg'>
                    {t("omit")}
                    </Radio>
                  </HStack>
                  {/* <HStack ml={"120px"}>
                  <FormHelperText>Select only if you're a fan.</FormHelperText>
                  </HStack> */}
                  </RadioGroup>
                
                </FormControl>
              )}
            </Field>
            
            <HStack>
            <FormLabel width={"100px"} >{t("age")}</FormLabel>
            <HStack>
            <Field name='minAge' validate={validateAge}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                    
                    <HStack  spacing='5px' verticalAlign={"bottom"}>
                      <FormLabel>{t("from")}</FormLabel>
                      <NumberInput 
                        maxW='100px' mr='2rem' 
                        {...field}
                        onChange={(v)=>setFieldValue("minAge", v)}
                        // value={minAge} 
                        // onChange={(v)=>setMinAge(v)}
                        >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                  </HStack>
                  <FormErrorMessage>"{form.errors.name}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name='maxAge' validate={validateAge}>
              {({ field, form }) => (
                <FormControl isInvalid={form.maxAge < form.minAge}>                    
                  <HStack  spacing='5px'>
                      <FormLabel>{t("to")}</FormLabel>
                      <NumberInput 
                        maxW='100px' mr='2rem' 
                        {...field}
                        // value={maxAge} 
                        // onChange={(v)=>setMaxAge(v)}
                        onChange={(v)=>setFieldValue("maxAge", v)}
                        >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>              
                  </HStack>
                  <FormErrorMessage>"{form.errors.maxAge}"</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            </HStack>
            </HStack>
            
            <Button
              mt={4}
              // ml={120}
              colorScheme='green'
              isLoading={isSubmitting}
              type='submit'
            >
              {t("search")}
            </Button>
          </Form>
        )}
      </Formik>
    )
  }
  
export default SearchForm;