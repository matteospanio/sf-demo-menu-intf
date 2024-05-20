import { Avatar, Box, Center, Flex, Image, Menu, MenuButton, MenuItem, MenuDivider, MenuList, Spacer, Text } from '@chakra-ui/react'
import { FaHouseUser } from 'react-icons/fa'
import { MdLogout, MdSettings } from 'react-icons/md'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'

function MenuBar() {

  const {t} = useTranslation()

  return (
    <Box w='100%' height='3.2em' bgGradient='linear(to-r, yellow, black)'>
      <Flex mx={5} >
        <Image
          boxSize={'3rem'}
          src='https://soundfood.it/wp-content/uploads/2023/01/LOGO_5_BLACK-removebg-preview.png'
          alt='SoundFood'
        />
        <Center mt={1}>
          <Text as='b'>
            SoundFood
          </Text>
        </Center>

        <Spacer />

        <Center>
          <LanguageSelector />
        </Center>
        
        <Center>
          <Menu>
            <MenuButton>
              <Avatar borderColor='yellow' borderWidth={2} size='sm' />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaHouseUser size={20} />}>{t("topLeft.profile")}</MenuItem>
              <MenuItem icon={<MdSettings size={20} />}>{t("topLeft.settings")}</MenuItem>
              <MenuDivider />
              <MenuItem icon={<MdLogout size={20} />}>{t("topLeft.logout")}</MenuItem>
            </MenuList>
          </Menu>
        </Center>

      </Flex>
    </Box>
  )
}

export default MenuBar