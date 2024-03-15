import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, VisuallyHidden } from '@chakra-ui/react';
import Geonames from 'geonames.js';  // https://github.com/kinotto/geonames.js
//import Script from 'react-load-script';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete"; // https://github.com/anubra266/choc-autocomplete

import { LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react'

const SelectCity = (props) => {
  
  const { field, setFieldValue } = props;
  
  //const [query, setQuery] = useState('');
  const [cityList, SetCityList] = useState([]);
  const [city, setCity] = useState(field.value);

  const geonames = Geonames({
    username: 'dvtian',
    lan: 'ru',
    encoding: 'JSON'
  });
  
  useEffect(() => {
    setCity(field.value)
  }, [field.value]);
  
  //! Google maps
  // // Store autocomplete object in a ref.
  // // This is done because refs do not trigger a re-render when changed.
  // const autocompleteRef = useRef(null);

  // const handleScriptLoad = () => {
  //   // Declare Options For Autocomplete
  //   const options = {
  //     types: ['(cities)'],
  //   };

  //   // Initialize Google Autocomplete
  //   /*global google*/ // To disable any eslint 'google not defined' errors
  //   autocompleteRef.current = new google.maps.places.Autocomplete(
  //     document.getElementById("inputCity"),
  //     options
  //   );

  //   // Avoid paying for data that you don't need by restricting the set of
  //   // place fields that are returned to just the address components and formatted
  //   // address.
  //   autocompleteRef.current.setFields(['address_components', 'formatted_address']);

  //   // Fire Event when a suggested name is selected
  //   autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  // };

  // const handlePlaceSelect = () => {
  //   // Extract City From Address Object
  //   const addressObject = autocompleteRef.current.getPlace();
  //   const address = addressObject.address_components;

  //   // Check if address is valid
  //   if (address) {
  //     setCity(address[0].long_name);
  //     setQuery(addressObject.formatted_address);
  //   }
  // };
  const FindCity = e => {
    //setQuery(e.target.value)
    let cityName = e.target.value
    setCity(cityName)

    if ([...cityName].length > 2) {
      // https://www.geonames.org/export/geonames-search.html
      geonames.search({name_startsWith: cityName, 
                      isNameRequired: true, 
                      orderby: "relevance", 
                      featureCode: ['PPL', 'PPLC', 'PPLA', 'PPLA2'],
                    }) //get continents
        .then(resp => {
          SetCityList(resp.geonames.filter(
            (obj, index)=>resp.geonames.findIndex(
            x => (x.name === obj.name && x.adminName1 === obj.adminName1)) === index).slice(0, 10));
        })
        .catch(err => console.error(err));
    }
    else SetCityList([])
  }
  
  const setField = e => {
    e.preventDefault();

    let geodata = JSON.parse(e.target.nextSibling.textContent);
    setCity(e.target.textContent)
    setFieldValue("city", e.target.textContent.trim())
    setFieldValue("location", {latitude: geodata.lat, longitude: geodata.lng} );
    setFieldValue("cityID", geodata.cityID);
  }
  
  const onFocusLost = e => {
    // e.preventDefault();
    if (!e.target.value){
      setCity("")
      setFieldValue("city", "")
      setFieldValue("location", undefined );
      setFieldValue("cityID", undefined);
    }
  }
  
  const bgSelectedGrey = useColorModeValue('lightgrey', 'darkslategrey')
  const bgFocusGrey = useColorModeValue('whitesmoke', 'dimgrey')

  return (
    <Box>
    <AutoComplete openOnFocus>
      <AutoCompleteInput 
        id="city" 
        name="city" 
        onChange={FindCity}             
        onBlur={onFocusLost}
        value={city} 
        width="full"
      />
      <AutoCompleteList >
        {cityList.map((cityobj) => (
          <AutoCompleteItem
            key={`option-${cityobj.geonameId}`}
            value={cityobj.name}
            onClick={setField}
            _selected={{ bg: `${bgSelectedGrey}` }}
            _focus={{ bg: `${bgFocusGrey}`}}
            //textTransform="capitalize"
          >
          <LinkBox as='div' width={"100%"}>
            <HStack>
              <LinkOverlay href='#'>
                <Text fontSize="md">{cityobj.name} </Text>
              </LinkOverlay>
              <VisuallyHidden>&#123;"lat":{cityobj.lat}, "lng":{cityobj.lng}, "cityID":{cityobj.geonameId}&#125;</VisuallyHidden>
              <Text fontSize="xs">{cityobj.adminName1 || cityobj.countryName} </Text>
            </HStack> 
          </LinkBox>
            {/* <HStack>
            <Text fontSize="md">{cityobj.name} </Text>
            <Text fontSize="xs" isDisabled>{cityobj.adminName1 || cityobj.countryName} </Text>
            <VisuallyHidden>{cityobj.lat}{cityobj.lng}{cityobj.geonameId}</VisuallyHidden>
            </HStack> */}
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
    </Box>
    
    
    // <div>
    //   <Script
    //     url="https://maps.googleapis.com/maps/api/js?key=your_api_key&libraries=places"
    //     onLoad={handleScriptLoad}
    //   /> 
    //   <Input
    //     id="inputCity"
    //     placeholder=""
    //     value={query}
    //     hintText="Search City"
    //     style={{
    //       margin: '0 auto',
    //       maxWidth: 800,
    //     }}
    //     bg="white"
    //     onChange={FindCity}
    //   />
    // </div>
  );
};

export default SelectCity;