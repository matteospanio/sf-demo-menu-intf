import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
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
import { formatRelativeTime } from '../../../shared/lib'

export interface MenuListPageProps {
  onCreateNew: () => void
  onViewMenu: (menuId: number, menuTitle: string) => void
  onEditMenu: (menuId: number, menuTitle: string) => void
  recentSubmission?: {
    menuId: number
    submittedAt: number
  } | null
}

export default function MenuListPage({ onCreateNew, onViewMenu, onEditMenu, recentSubmission }: MenuListPageProps) {
  const { t, i18n } = useTranslation()

  const [menus, setMenus] = useState<ApiMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [menuPendingDelete, setMenuPendingDelete] = useState<ApiMenu | null>(null)
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const [justSubmitted, setJustSubmitted] = useState<{ menuId: number; expiresAt: number } | null>(null)
  const recentMenuId = recentSubmission?.menuId
  const recentSubmittedAt = recentSubmission?.submittedAt

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const mutedColor = useColorModeValue('gray.500', 'gray.500')
  const highlightBg = useColorModeValue('brand.50', 'whiteAlpha.100')

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

  useEffect(() => {
    if (!recentMenuId || !recentSubmittedAt) return

    const expiresAt = recentSubmittedAt + 2500
    setJustSubmitted({ menuId: recentMenuId, expiresAt })

    const remainingMs = Math.max(0, expiresAt - Date.now())
    const timer = window.setTimeout(() => {
      setJustSubmitted(null)
    }, remainingMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [recentMenuId, recentSubmittedAt])

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
        <Heading size="md" color={headingColor}>{t('menus.title')}</Heading>
        <Button onClick={onCreateNew}>
          {t('menus.createNew')}
        </Button>
      </Flex>

      {isLoading && (
        <Flex align="center" gap={3}>
          <Spinner color="brand.500" />
          <Text color={textColor}>{t('menus.loading')}</Text>
        </Flex>
      )}

      {!isLoading && error && (
        <Alert status="error" borderRadius={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!isLoading && !error && sortedMenus.length === 0 && (
        <Box borderWidth={1} borderRadius="xl" p={6} bg={cardBg} borderColor={cardBorder} boxShadow="sm">
          <Heading size="sm" mb={2} color={headingColor}>
            {t('menus.emptyTitle')}
          </Heading>
          <Text color={textColor}>{t('menus.emptyDescription')}</Text>
        </Box>
      )}

      {!isLoading && !error && sortedMenus.length > 0 && (
        <Stack spacing={3}>
          {sortedMenus.map(menu => {
            const isJustSent = justSubmitted?.menuId === menu.id && Date.now() < justSubmitted.expiresAt

            return (
              <Box
                key={menu.id}
                borderWidth={1}
                borderRadius="xl"
                p={4}
                bg={isJustSent ? highlightBg : cardBg}
                borderColor={isJustSent ? 'brand.500' : cardBorder}
                boxShadow="sm"
                _hover={{ borderColor: 'brand.500', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" gap={4} align="start" wrap="wrap">
                  <Box>
                    <Flex align="center" gap={2} mb={1}>
                      <Heading size="sm" color={headingColor}>{menu.title}</Heading>
                      <Badge
                        colorScheme={menu.status === 'submitted' ? 'green' : 'yellow'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {t(`menus.status.${menu.status}`)}
                      </Badge>

                      {isJustSent && (
                        <Badge
                          colorScheme="brand"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {t('menus.justSent')}
                        </Badge>
                      )}
                    </Flex>
                    {menu.description && (
                      <Text mt={1} color={textColor}>
                        {menu.description}
                      </Text>
                    )}
                    <Flex mt={2} gap={4} wrap="wrap">
                      {typeof menu.dish_count === 'number' && (
                        <Text fontSize="sm" color={mutedColor}>
                          {t('menus.dishCount', { count: menu.dish_count })}
                        </Text>
                      )}
                      <Tooltip label={new Date(menu.updated_at).toLocaleString(i18n.language)} placement="top">
                        <Text fontSize="sm" color={mutedColor}>
                          {isJustSent
                            ? t('menus.justSent')
                            : t('menus.lastModified', { time: formatRelativeTime(menu.updated_at, i18n.language) })}
                        </Text>
                      </Tooltip>
                    </Flex>
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
            )
          })}
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
