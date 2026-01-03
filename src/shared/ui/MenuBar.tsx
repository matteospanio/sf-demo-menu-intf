import {
  Avatar,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { FaHouseUser } from 'react-icons/fa'
import { MdLogout, MdMenu, MdSettings } from 'react-icons/md'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth'
import logoSoundfood from '../../assets/logo-soundfood.png'

export interface MenuBarProps {
  onGoToMenus: () => void
  onGoToNewMenu: () => void
  onGoToProfile: () => void
}

function MenuBar({ onGoToMenus, onGoToNewMenu, onGoToProfile }: MenuBarProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Color mode values
  const navBg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(24, 24, 27, 0.8)'
  )
  const navBorder = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
  const drawerBg = useColorModeValue('white', 'gray.800')
  const drawerBorder = useColorModeValue('gray.200', 'gray.700')
  const avatarBg = useColorModeValue('gray.200', 'gray.600')

  const handleLogout = async () => {
    await logout()
  }

  const handleGoToMenus = () => {
    onGoToMenus()
    onClose()
  }

  const handleGoToNewMenu = () => {
    onGoToNewMenu()
    onClose()
  }

  const handleGoToProfile = () => {
    onGoToProfile()
    onClose()
  }

  return (
    <Box
      as="nav"
      aria-label="Main"
      w="100%"
      bg={navBg}
      backdropFilter="blur(20px)"
      borderBottom="1px"
      borderColor={navBorder}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex mx={5} py={3} align="center" gap={4}>
        {/* Logo */}
        <Button
          variant="ghost"
          onClick={onGoToMenus}
          aria-label="Go to menus list"
          p={0}
          _hover={{ bg: 'transparent', opacity: 0.8 }}
        >
          <Flex align="center" gap={3}>
            <Box
              p={1}
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow="sm"
            >
              <Image boxSize={'2rem'} src={logoSoundfood} alt="SoundFood" objectFit="contain" />
            </Box>
            <Center>
              <Text as="b" fontSize="lg" color="brand.500">
                SoundFood
              </Text>
            </Center>
          </Flex>
        </Button>

        {/* Desktop Navigation */}
        <Flex as="div" aria-label="Primary navigation" gap={2} display={{ base: 'none', md: 'flex' }}>
          <Button
            variant="ghost"
            onClick={onGoToMenus}
            color={textColor}
            _hover={{ color: 'brand.500', bg: hoverBg }}
          >
            {t('menus.title')}
          </Button>
          <Button variant="solid" onClick={onGoToNewMenu}>
            {t('main.newMenuRequest')}
          </Button>
        </Flex>

        <Spacer />

        {/* Desktop Language Selector */}
        <Center mr={3} display={{ base: 'none', md: 'flex' }}>
          <LanguageSelector />
        </Center>

        {/* Desktop User Menu */}
        <Center display={{ base: 'none', md: 'flex' }}>
          <Menu>
            <MenuButton>
              <Avatar
                borderColor="brand.500"
                borderWidth={2}
                size="sm"
                name={user?.username}
                bg={avatarBg}
                color={useColorModeValue('gray.600', 'white')}
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaHouseUser size={20} />} onClick={onGoToProfile}>
                {t('topLeft.profile')} ({user?.username})
              </MenuItem>
              <MenuItem icon={<MdSettings size={20} />}>{t('topLeft.settings')}</MenuItem>
              <MenuDivider />
              <MenuItem icon={<MdLogout size={20} />} onClick={handleLogout}>
                {t('topLeft.logout')}
              </MenuItem>
            </MenuList>
          </Menu>
        </Center>

        {/* Mobile Hamburger Menu */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label={t('topLeft.openMenu')}
          icon={<MdMenu size={24} />}
          variant="ghost"
          color={textColor}
          _hover={{ color: 'brand.500', bg: hoverBg }}
          onClick={onOpen}
        />

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay backdropFilter="blur(4px)" />
          <DrawerContent bg={drawerBg}>
            <DrawerCloseButton color={textColor} />
            <DrawerHeader borderBottomWidth="1px" borderColor={drawerBorder}>
              <Flex align="center" gap={3}>
                <Avatar
                  borderColor="brand.500"
                  borderWidth={2}
                  size="sm"
                  name={user?.username}
                  bg={avatarBg}
                  color={useColorModeValue('gray.600', 'white')}
                />
                <Text color={textColor} fontSize="md">
                  {user?.username}
                </Text>
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch" mt={4}>
                {/* Navigation Links */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={handleGoToMenus}
                  color={textColor}
                  _hover={{ color: 'brand.500', bg: hoverBg }}
                  leftIcon={<FaHouseUser size={18} />}
                >
                  {t('menus.title')}
                </Button>
                <Button variant="solid" onClick={handleGoToNewMenu} w="100%">
                  {t('main.newMenuRequest')}
                </Button>

                {/* Divider */}
                <Box borderTop="1px" borderColor={drawerBorder} my={2} />

                {/* Profile */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color={textColor}
                  _hover={{ color: 'brand.500', bg: hoverBg }}
                  leftIcon={<FaHouseUser size={18} />}
                  onClick={handleGoToProfile}
                >
                  {t('topLeft.profile')}
                </Button>

                {/* Settings */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color={textColor}
                  _hover={{ color: 'brand.500', bg: hoverBg }}
                  leftIcon={<MdSettings size={18} />}
                >
                  {t('topLeft.settings')}
                </Button>

                {/* Language Selector */}
                <Flex align="center" justify="space-between" px={4}>
                  <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize="sm">
                    {t('topLeft.language')}
                  </Text>
                  <LanguageSelector />
                </Flex>

                {/* Divider */}
                <Box borderTop="1px" borderColor={drawerBorder} my={2} />

                {/* Logout */}
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="red.500"
                  _hover={{ color: 'red.400', bg: useColorModeValue('red.50', 'whiteAlpha.100') }}
                  leftIcon={<MdLogout size={18} />}
                  onClick={handleLogout}
                >
                  {t('topLeft.logout')}
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  )
}

export default MenuBar
