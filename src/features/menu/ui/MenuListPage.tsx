import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, type ApiMenu, menuService } from '../../../api'

export interface MenuListPageProps {
  onCreateNew: () => void
  onViewMenu: (menuId: number, menuTitle: string) => void
  onEditMenu: (menuId: number, menuTitle: string) => void
}

export default function MenuListPage({ onCreateNew, onViewMenu, onEditMenu }: MenuListPageProps) {
  const { t } = useTranslation()

  const [menus, setMenus] = useState<ApiMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [menuPendingDelete, setMenuPendingDelete] = useState<ApiMenu | null>(null)
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const sortedMenus = useMemo(() => {
    return [...menus].sort((a, b) => b.id - a.id)
  }, [menus])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await menuService.list()
        if (isMounted) setMenus(response)
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
  }, [t])

  const requestDeleteMenu = (menu: ApiMenu) => {
    setMenuPendingDelete(menu)
    openDelete()
  }

  const confirmDeleteMenu = async () => {
    if (!menuPendingDelete) return

    try {
      await menuService.delete(menuPendingDelete.id)
      setMenus(prev => prev.filter(m => m.id !== menuPendingDelete.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('toast.apiError.description'))
    } finally {
      closeDelete()
      setMenuPendingDelete(null)
    }
  }

  return (
    <Box>
      <Flex align="center" justify="space-between" gap={3} mb={4}>
        <Heading size="md">{t('menus.title')}</Heading>
        <Button colorScheme="blue" onClick={onCreateNew}>
          {t('menus.createNew')}
        </Button>
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

      {!isLoading && !error && sortedMenus.length === 0 && (
        <Box borderWidth={1} borderRadius={6} p={4}>
          <Heading size="sm" mb={1}>
            {t('menus.emptyTitle')}
          </Heading>
          <Text color="gray.600">{t('menus.emptyDescription')}</Text>
        </Box>
      )}

      {!isLoading && !error && sortedMenus.length > 0 && (
        <Stack spacing={3}>
          {sortedMenus.map(menu => (
            <Box key={menu.id} borderWidth={1} borderRadius={6} p={4}>
              <Flex justify="space-between" gap={4} align="start" wrap="wrap">
                <Box>
                  <Heading size="sm">{menu.title}</Heading>
                  {menu.description && (
                    <Text mt={1} color="gray.600">
                      {menu.description}
                    </Text>
                  )}
                  {typeof menu.dish_count === 'number' && (
                    <Text mt={2} fontSize="sm" color="gray.500">
                      {t('menus.dishCount', { count: menu.dish_count })}
                    </Text>
                  )}
                </Box>

                <Flex gap={2}>
                  <Button size="sm" variant="outline" onClick={() => onViewMenu(menu.id, menu.title)}>
                    {t('menus.actions.view')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEditMenu(menu.id, menu.title)}>
                    {t('menus.actions.edit')}
                  </Button>
                  <Button size="sm" colorScheme="red" variant="outline" onClick={() => requestDeleteMenu(menu)}>
                    {t('menus.actions.delete')}
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          closeDelete()
          setMenuPendingDelete(null)
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('menus.delete.title')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('menus.delete.description', { title: menuPendingDelete?.title ?? '' })}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => {
                closeDelete()
                setMenuPendingDelete(null)
              }}>
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
