import { Avatar, Box, Button, Center, Flex, Image, Menu, MenuButton, MenuItem, MenuDivider, MenuList, Spacer, Text } from '@chakra-ui/react'
import { FaHouseUser } from 'react-icons/fa'
import { MdLogout, MdSettings } from 'react-icons/md'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth'

export interface MenuBarProps {
  onGoToMenus: () => void
  onGoToNewMenu: () => void
}

function MenuBar({ onGoToMenus, onGoToNewMenu }: MenuBarProps) {

  const {t} = useTranslation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Box as='nav' aria-label='Main' w='100%' bgGradient='linear(to-r, yellow, black)'>
      <Flex mx={5} py={2} align='center' gap={4}>
        <Button
          variant='ghost'
          onClick={onGoToMenus}
          aria-label='Go to menus list'
          p={0}
          _hover={{ bg: 'transparent' }}
        >
          <Flex align='center' gap={2}>
            <Image
              boxSize={'2.5rem'}
              src='https://soundfood.it/wp-content/uploads/2023/01/LOGO_5_BLACK-removebg-preview.png'
              alt='SoundFood'
            />
            <Center>
              <Text as='b'>SoundFood</Text>
            </Center>
          </Flex>
        </Button>

        <Flex as='div' aria-label='Primary navigation' gap={2}>
          <Button variant='ghost' onClick={onGoToMenus}>
            {t('menus.title')}
          </Button>
          <Button colorScheme='blue' variant='solid' onClick={onGoToNewMenu}>
            {t('main.newMenuRequest')}
          </Button>
        </Flex>

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
