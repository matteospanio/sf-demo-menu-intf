import { Avatar, Box, Center, Flex, Image, Menu, MenuButton, MenuItem, MenuDivider, MenuList, Spacer, Text } from '@chakra-ui/react'
import { FaHouseUser } from 'react-icons/fa'
import { MdLogout, MdSettings } from 'react-icons/md'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth'

function MenuBar() {

  const {t} = useTranslation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

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

        <Center mr={3}>
          <LanguageSelector />
        </Center>

        <Center>
          <Menu>
            <MenuButton>
              <Avatar borderColor='yellow' borderWidth={2} size='sm' name={user?.username} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaHouseUser size={20} />}>{t("topLeft.profile")} ({user?.username})</MenuItem>
              <MenuItem icon={<MdSettings size={20} />}>{t("topLeft.settings")}</MenuItem>
              <MenuDivider />
              <MenuItem icon={<MdLogout size={20} />} onClick={handleLogout}>{t("topLeft.logout")}</MenuItem>
            </MenuList>
          </Menu>
        </Center>

      </Flex>
    </Box>
  )
}

export default MenuBar
