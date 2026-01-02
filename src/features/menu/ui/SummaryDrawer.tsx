import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Stack } from '@chakra-ui/react'
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

  return (
    <Drawer onClose={closeDrawer} isOpen={isOpen} size='full'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu: {data.title}</DrawerHeader>
        <DrawerBody>
          <p>
            {t('main.description')}: {data.description}
          </p>
          <Stack mt={5} direction='column' spacing={4}>
            {data.dishes.map((dish) => {
              return <DishCard dish={dish} />
            })}
          </Stack>

        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default SummaryDrawer
