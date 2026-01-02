import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Dish } from '../model/dish'
import { useTranslation } from 'react-i18next'
import DishCard from './DishCard'

interface SummaryDrawerProps {
  isOpen: boolean
  data: {
    title: string
    description: string
    dishes: Dish[]
  }
  closeDrawer: () => void
}

function SummaryDrawer({isOpen, closeDrawer, data}: SummaryDrawerProps) {

  const {t} = useTranslation()
  const drawerBg = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Drawer onClose={closeDrawer} isOpen={isOpen} size='full'>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent bg={drawerBg}>
        <DrawerCloseButton />
        <DrawerHeader color="brand.500" fontSize="2xl">Menu: {data.title}</DrawerHeader>
        <DrawerBody>
          <Text color={textColor} mb={4}>
            {t('main.description')}: {data.description}
          </Text>
          <Stack mt={5} direction='column' spacing={4}>
            {data.dishes.map((dish, index) => {
              return <DishCard key={index} dish={dish} />
            })}
          </Stack>

        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default SummaryDrawer
