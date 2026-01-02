import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, type ApiDish, type ApiMenu, dishService, menuService } from '../../../api'

export interface MenuDetailsPageProps {
  menuId: number
  onBack: () => void
  onEdit: (menuId: number) => void
  onDeleted: () => void
}

export default function MenuDetailsPage({ menuId, onBack, onEdit, onDeleted }: MenuDetailsPageProps) {
  const { t } = useTranslation()

  const [menu, setMenu] = useState<ApiMenu | null>(null)
  const [dishes, setDishes] = useState<ApiDish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [menuResponse, dishesResponse] = await Promise.all([
          menuService.get(menuId),
          dishService.listByMenu(menuId),
        ])
        if (isMounted) {
          setMenu(menuResponse)
          setDishes(dishesResponse)
        }
      } catch (err) {
        if (isMounted) setError(err instanceof ApiError ? err.message : t('toast.apiError.description'))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [menuId, t])

  const confirmDeleteMenu = async () => {
    try {
      await menuService.delete(menuId)
      onDeleted()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('toast.apiError.description'))
    } finally {
      closeDelete()
    }
  }

  return (
    <Box>
      <Flex align="center" justify="space-between" gap={3} mb={4} wrap="wrap">
        <Heading size="md">{t('menus.detailsTitle')}</Heading>
        <Flex gap={2}>
          <Button variant="outline" onClick={onBack}>
            {t('menus.actions.back')}
          </Button>
          <Button variant="outline" onClick={() => onEdit(menuId)}>
            {t('menus.actions.edit')}
          </Button>
          <Button colorScheme="red" variant="outline" onClick={openDelete}>
            {t('menus.actions.delete')}
          </Button>
        </Flex>
      </Flex>

      {isLoading && (
        <Flex align="center" gap={3}>
          <Spinner />
          <Text>{t('menus.loading')}</Text>
        </Flex>
      )}

      {!isLoading && error && (
        <Alert status="error" borderRadius={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!isLoading && !error && menu && (
        <>
          <Box borderWidth={1} borderRadius={6} p={4} mb={4}>
            <Heading size="sm">{menu.title}</Heading>
            {menu.description && <Text mt={1}>{menu.description}</Text>}
          </Box>

          <Heading size="sm" mb={2}>
            {t('menus.dishesTitle')}
          </Heading>

          {dishes.length === 0 ? (
            <Text color="gray.600">{t('menus.noDishes')}</Text>
          ) : (
            <Stack spacing={2}>
              {dishes.map(dish => (
                <Box key={dish.id} borderWidth={1} borderRadius={6} p={3}>
                  <Text fontWeight="bold">{dish.name}</Text>
                  {dish.description && <Text color="gray.600">{dish.description}</Text>}
                  <Text fontSize="sm" color="gray.500">{dish.section}</Text>
                </Box>
              ))}
            </Stack>
          )}
        </>
      )}

      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={closeDelete}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('menus.delete.title')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('menus.delete.description', { title: menu?.title ?? '' })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDelete}>
                {t('menus.delete.cancel')}
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteMenu} ml={3}>
                {t('menus.delete.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
