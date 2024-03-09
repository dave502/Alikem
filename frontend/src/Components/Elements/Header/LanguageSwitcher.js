import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text, 
    IconButton
  } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from '@chakra-ui/icons'
import IconLanguageSwitcher from "./IconLanguageSwitcher"
import IconRu from "./IconRu"
import IconEn from "./IconEn"

export const LanguageSwitcher = props => {
    let lng = [
      {
        code: "ru",
        name: "Русский",
        country_code: "ru",
      },
      {
        code: "en",
        name: "English",
        country_code: "gb",
      },
    ];
    
    const { t, i18n } = useTranslation();
    
    return (
      <Menu maxW='40px'>
        <MenuButton 
          as={IconButton}
          icon={<IconLanguageSwitcher />} 
          variant="ghost" 
          px='6px' 
          rightIcon={<ChevronDownIcon color="white"/>} 
          {...props}
        />
        <MenuList minW='32px' p='1' border='0' >
          <MenuItem p='0' onClick={() => i18n.changeLanguage('en')} isActive={i18n.language === 'en'}>
            <IconEn/>
            <Text px='2' m='0'>En</Text>
          </MenuItem>
          <MenuItem p='0' onClick={() => i18n.changeLanguage('ru')} isActive={i18n.language === 'ru'}>
            <IconRu/>
            <Text px='2' m='0'>Ru</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }
  