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
  useColorModeValue,
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

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')
  const tagBg = useColorModeValue('gray.100', 'gray.700')
  const tagColor = useColorModeValue('gray.700', 'gray.200')

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
        <Heading size="md" color={headingColor}>{t('menus.detailsTitle')}</Heading>
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

      {!isLoading && !error && menu && (
        <>
          <Box borderWidth={1} borderRadius="xl" p={4} mb={4} bg={cardBg} borderColor={cardBorder} boxShadow="sm">
            <Heading size="sm" color={headingColor}>{menu.title}</Heading>
            {menu.description && <Text mt={1} color={textColor}>{menu.description}</Text>}
          </Box>

          <Heading size="sm" mb={2} color={headingColor}>
            {t('menus.dishesTitle')}
          </Heading>

          {dishes.length === 0 ? (
            <Text color={mutedColor}>{t('menus.noDishes')}</Text>
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
                  <Box
                    key={dish.id}
                    borderWidth={1}
                    borderRadius="xl"
                    p={3}
                    bg={cardBg}
                    borderColor={cardBorder}
                    boxShadow="sm"
                    _hover={{ borderColor: 'brand.500', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <Text fontWeight="bold" color={headingColor}>{dish.name}</Text>
                    {dish.description && <Text color={textColor}>{dish.description}</Text>}
                    <Text fontSize="sm" color="brand.500">{dish.section}</Text>

                    {(tasteSummary || attrCounts.length > 0 || colors.length > 0) && (
                      <Box mt={2}>
                        {tasteSummary && (
                          <Text fontSize="sm" color={mutedColor}>
                            {tasteSummary}
                          </Text>
                        )}

                        {attrCounts.length > 0 && (
                          <Wrap mt={2} spacing={2} aria-label="Dish attributes">
                            {attrCounts.map(value => (
                              <WrapItem key={value}>
                                <Tag size="sm" variant="subtle" bg={tagBg} color={tagColor}>{value}</Tag>
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
                                borderRadius="full"
                                borderWidth={1}
                                borderColor={cardBorder}
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
