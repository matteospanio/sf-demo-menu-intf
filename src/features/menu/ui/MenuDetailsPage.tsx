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
  Tag,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, type ApiDish, type ApiMenu, dishService, menuService } from '../../../api'

export interface MenuDetailsPageProps {
  menuId: number
  onBack: () => void
  onEdit: (menuId: number, menuTitle?: string) => void
  onDeleted: () => void
  onMenuLoaded?: (menuTitle: string) => void
}

const buildTasteSummary = (dish: ApiDish, t: (key: string) => string): string => {
  const entries: Array<[string, number]> = [
    [t('tastes.base.sweet'), dish.sweet],
    [t('tastes.base.salty'), dish.salty],
    [t('tastes.base.bitter'), dish.bitter],
    [t('tastes.base.sour'), dish.sour],
    [t('tastes.base.umami'), dish.umami],
    [t('tastes.other.piquant'), dish.piquant],
    [t('tastes.other.fat'), dish.fat],
    [t('tastes.other.temperature'), dish.temperature],
  ]

  const nonZero = entries.filter(([, value]) => typeof value === 'number' && value !== 0)
  if (nonZero.length === 0) return ''

  return nonZero
    .slice(0, 6)
    .map(([label, value]) => `${label}: ${value}`)
    .join(' · ')
}

export default function MenuDetailsPage({ menuId, onBack, onEdit, onDeleted, onMenuLoaded }: MenuDetailsPageProps) {
  const { t } = useTranslation()

  const [menu, setMenu] = useState<ApiMenu | null>(null)
  const [dishes, setDishes] = useState<ApiDish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const onMenuLoadedRef = useRef<MenuDetailsPageProps['onMenuLoaded']>(onMenuLoaded)
  const tRef = useRef(t)

  useEffect(() => {
    onMenuLoadedRef.current = onMenuLoaded
  }, [onMenuLoaded])

  useEffect(() => {
    tRef.current = t
  }, [t])

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
          onMenuLoadedRef.current?.(menuResponse.title)
        }
      } catch (err) {
        if (isMounted) setError(err instanceof ApiError ? err.message : tRef.current('toast.apiError.description'))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [menuId])

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
          <Button variant="outline" onClick={() => onEdit(menuId, menu?.title)}>
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
              {dishes.map(dish => {
                const tasteSummary = buildTasteSummary(dish, t)
                const colors = dish.colors ?? []
                const attrCounts = [
                  dish.textures.length ? `${t('textures.description')}: ${dish.textures.length}` : null,
                  dish.shapes.length ? `${t('shapes.description')}: ${dish.shapes.length}` : null,
                  dish.emotions.length ? `${t('emotions.description')}: ${dish.emotions.length}` : null,
                ].filter(Boolean) as string[]

                return (
                  <Box key={dish.id} borderWidth={1} borderRadius={6} p={3}>
                    <Text fontWeight="bold">{dish.name}</Text>
                    {dish.description && <Text color="gray.600">{dish.description}</Text>}
                    <Text fontSize="sm" color="gray.500">{dish.section}</Text>

                    {(tasteSummary || attrCounts.length > 0 || colors.length > 0) && (
                      <Box mt={2}>
                        {tasteSummary && (
                          <Text fontSize="sm" color="gray.600">
                            {tasteSummary}
                          </Text>
                        )}

                        {attrCounts.length > 0 && (
                          <Wrap mt={2} spacing={2} aria-label="Dish attributes">
                            {attrCounts.map(value => (
                              <WrapItem key={value}>
                                <Tag size="sm" variant="subtle">{value}</Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        )}

                        {colors.length > 0 && (
                          <Flex mt={2} gap={2} align="center" aria-label="Dish colors">
                            {colors.slice(0, 3).map((c, idx) => (
                              <Box
                                key={`${dish.id}-c-${idx}`}
                                w="16px"
                                h="16px"
                                borderRadius="3px"
                                borderWidth={1}
                                bg={c}
                                aria-label={`Color ${idx + 1} ${c}`}
                              />
                            ))}
                          </Flex>
                        )}
                      </Box>
                    )}
                  </Box>
                )
              })}
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
