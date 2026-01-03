import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormHelperText,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, EmailIcon } from '@chakra-ui/icons'
import { FaSave } from 'react-icons/fa'
import { RiRestaurantFill } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { InputWrapper, ColorSelector } from '../../../shared/ui'
import TasteSlider from './TasteSlider'
import { Optional, Section } from '../../../shared/lib'
import { Reorder } from "framer-motion"
import { MdDragIndicator } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { MODAL_TIMER, SLIDER_DEFAULT } from '../../../shared/config'
import SectionSelect from './SectionSelect'
import EmotionSelectApi from './EmotionSelectApi'
import TextureSelectApi from './TextureSelectApi'
import ShapesSelectApi from './ShapesSelectApi'
import { useAttributes } from '../hooks'
import {
  menuService,
  dishService,
  CreateDishRequest,
  ApiDish,
  ApiError,
  MenuStatus
} from '../../../api'


// Local dish state interface (for form)
interface LocalDish {
  id?: number;
  name: string;
  description: string;
  section: Section;
  sweet: number;
  bitter: number;
  sour: number;
  salty: number;
  umami: number;
  piquant: number;
  fat: number;
  temperature: number;
  color1: string;
  color2: string;
  color3: string;
  emotion_ids: number[];
  texture_ids: number[];
  shape_ids: number[];
}

// Convert local dish to API format
const localDishToApi = (dish: LocalDish): CreateDishRequest => ({
  name: dish.name,
  description: dish.description || undefined,
  section: dish.section,
  sweet: dish.sweet,
  bitter: dish.bitter,
  sour: dish.sour,
  salty: dish.salty,
  umami: dish.umami,
  piquant: dish.piquant,
  fat: dish.fat,
  temperature: dish.temperature,
  color1: dish.color1 !== '#ffffff' ? dish.color1 : undefined,
  color2: dish.color2 !== '#ffffff' ? dish.color2 : undefined,
  color3: dish.color3 !== '#ffffff' ? dish.color3 : undefined,
  emotion_ids: dish.emotion_ids,
  texture_ids: dish.texture_ids,
  shape_ids: dish.shape_ids,
});

export type MenuRequestFormDoneResult = {
  menuId: number
  submittedAt: number
}

const createEmptyDish = (): LocalDish => ({
  name: '',
  description: '',
  section: Section.None,
  sweet: SLIDER_DEFAULT,
  bitter: SLIDER_DEFAULT,
  sour: SLIDER_DEFAULT,
  salty: SLIDER_DEFAULT,
  umami: SLIDER_DEFAULT,
  piquant: SLIDER_DEFAULT,
  fat: SLIDER_DEFAULT,
  temperature: SLIDER_DEFAULT,
  color1: '#ffffff',
  color2: '#ffffff',
  color3: '#ffffff',
  emotion_ids: [],
  texture_ids: [],
  shape_ids: [],
});

const apiDishToLocal = (dish: ApiDish): LocalDish => {
  const colors = dish.colors ?? []
  const c1 = colors[0] ?? '#ffffff'
  const c2 = colors[1] ?? '#ffffff'
  const c3 = colors[2] ?? '#ffffff'

  return {
    id: dish.id,
    name: dish.name,
    description: dish.description ?? '',
    section: dish.section as Section,
    sweet: dish.sweet,
    bitter: dish.bitter,
    sour: dish.sour,
    salty: dish.salty,
    umami: dish.umami,
    piquant: dish.piquant,
    fat: dish.fat,
    temperature: dish.temperature,
    color1: c1,
    color2: c2,
    color3: c3,
    emotion_ids: dish.emotions.map(e => e.id),
    texture_ids: dish.textures.map(t => t.id),
    shape_ids: dish.shapes.map(s => s.id),
  }
}

interface MenuRequestFormProps {
  menuId?: number
  onDone?: (result?: MenuRequestFormDoneResult) => void
}

function MenuRequestForm({ menuId: initialMenuId, onDone }: MenuRequestFormProps) {
  const { t } = useTranslation()
  const toast = useToast()

  // Color mode values
  const containerBg = useColorModeValue('white', 'gray.800')
  const containerBorder = useColorModeValue('gray.200', 'gray.700')
  const cardBg = useColorModeValue('gray.50', 'gray.700')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('gray.500', 'gray.400')
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')

  // Load attributes from API
  const { emotions, textures, shapes, isLoading: attributesLoading, error: attributesError } = useAttributes()

  // Menu state
  const [title, setTitle] = useState('')
  const [menuDesc, setMenuDesc] = useState('')
  const [menuId, setMenuId] = useState<number | null>(initialMenuId ?? null)
  const [menuStatus, setMenuStatus] = useState<MenuStatus>('draft')
  const [dishes, setDishes] = useState<LocalDish[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isLoadingExistingMenu, setIsLoadingExistingMenu] = useState(false)
  const [existingMenuError, setExistingMenuError] = useState<string | null>(null)

  // Current dish being edited
  const [currentDish, setCurrentDish] = useState<LocalDish>(createEmptyDish())
  const [editingDishId, setEditingDishId] = useState<number | null>(null)

  // Taste checkbox states
  const [sweetChecked, setSweetChecked] = useState(false)
  const [bitterChecked, setBitterChecked] = useState(false)
  const [sourChecked, setSourChecked] = useState(false)
  const [saltyChecked, setSaltyChecked] = useState(false)
  const [umamiChecked, setUmamiChecked] = useState(false)
  const [piquantChecked, setPiquantChecked] = useState(false)
  const [fatChecked, setFatChecked] = useState(false)
  const [temperatureChecked, setTemperatureChecked] = useState(false)

  // Color checkbox states
  const [colorCheck1, setColorCheck1] = useState(false)
  const [colorCheck2, setColorCheck2] = useState(false)
  const [colorCheck3, setColorCheck3] = useState(false)

  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()

  useEffect(() => {
    if (!initialMenuId) return

    let isMounted = true

    const loadExisting = async () => {
      setIsLoadingExistingMenu(true)
      setExistingMenuError(null)
      try {
        const [menuResponse, dishesResponse] = await Promise.all([
          menuService.get(initialMenuId),
          dishService.listByMenu(initialMenuId),
        ])
        if (isMounted) {
          setMenuId(initialMenuId)
          setTitle(menuResponse.title)
          setMenuDesc(menuResponse.description ?? '')
          setMenuStatus(menuResponse.status)
          setDishes(dishesResponse.map(apiDishToLocal))
        }
      } catch (err) {
        if (isMounted) setExistingMenuError(err instanceof ApiError ? err.message : t('toast.apiError.description'))
      } finally {
        if (isMounted) setIsLoadingExistingMenu(false)
      }
    }

    loadExisting()

    return () => {
      isMounted = false
    }
  }, [initialMenuId, t])

  const handleTasteChange = (taste: string, value: Optional<number>) => {
    setCurrentDish(prev => ({ ...prev, [taste]: value ?? 0 }))
  }

  const colorObjects = [
    { color: currentDish.color1, check: colorCheck1, setCheck: setColorCheck1, setColor: (c: string) => setCurrentDish(prev => ({ ...prev, color1: c })) },
    { color: currentDish.color2, check: colorCheck2, setCheck: setColorCheck2, setColor: (c: string) => setCurrentDish(prev => ({ ...prev, color2: c })) },
    { color: currentDish.color3, check: colorCheck3, setCheck: setColorCheck3, setColor: (c: string) => setCurrentDish(prev => ({ ...prev, color3: c })) },
  ]

  const baseParams = [
    { label: 'sweet', isChecked: sweetChecked, checkCallback: setSweetChecked },
    { label: 'bitter', isChecked: bitterChecked, checkCallback: setBitterChecked },
    { label: 'sour', isChecked: sourChecked, checkCallback: setSourChecked },
    { label: 'salty', isChecked: saltyChecked, checkCallback: setSaltyChecked },
    { label: 'umami', isChecked: umamiChecked, checkCallback: setUmamiChecked },
  ]

  const otherParams = [
    { label: 'piquant', isChecked: piquantChecked, checkCallback: setPiquantChecked },
    { label: 'fat', isChecked: fatChecked, checkCallback: setFatChecked },
    { label: 'temperature', min: -10, max: 40, isChecked: temperatureChecked, checkCallback: setTemperatureChecked },
  ]

  const resetDishForm = () => {
    setCurrentDish(createEmptyDish())
    setEditingDishId(null)
    setSweetChecked(false)
    setBitterChecked(false)
    setSourChecked(false)
    setSaltyChecked(false)
    setUmamiChecked(false)
    setPiquantChecked(false)
    setFatChecked(false)
    setTemperatureChecked(false)
    setColorCheck1(false)
    setColorCheck2(false)
    setColorCheck3(false)
  }

  const loadDishIntoForm = (dish: LocalDish) => {
    setCurrentDish(dish)
    setEditingDishId(dish.id ?? null)
    setSweetChecked(dish.sweet !== 0)
    setBitterChecked(dish.bitter !== 0)
    setSourChecked(dish.sour !== 0)
    setSaltyChecked(dish.salty !== 0)
    setUmamiChecked(dish.umami !== 0)
    setPiquantChecked(dish.piquant !== 0)
    setFatChecked(dish.fat !== 0)
    setTemperatureChecked(dish.temperature !== 0)
    setColorCheck1(dish.color1 !== '#ffffff')
    setColorCheck2(dish.color2 !== '#ffffff')
    setColorCheck3(dish.color3 !== '#ffffff')
  }

  const saveDishLocal = async () => {
    if (!currentDish.name) {
      toast({
        title: t('toast.nameRequired.title'),
        description: t('toast.nameRequired.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    // Apply checkbox states to dish values
    const dishToSave: LocalDish = {
      ...currentDish,
      sweet: sweetChecked ? currentDish.sweet : 0,
      bitter: bitterChecked ? currentDish.bitter : 0,
      sour: sourChecked ? currentDish.sour : 0,
      salty: saltyChecked ? currentDish.salty : 0,
      umami: umamiChecked ? currentDish.umami : 0,
      piquant: piquantChecked ? currentDish.piquant : 0,
      fat: fatChecked ? currentDish.fat : 0,
      temperature: temperatureChecked ? currentDish.temperature : 0,
      color1: colorCheck1 ? currentDish.color1 : '#ffffff',
      color2: colorCheck2 ? currentDish.color2 : '#ffffff',
      color3: colorCheck3 ? currentDish.color3 : '#ffffff',
    }

    // If we have a menu already created, save to API
    if (menuId) {
      try {
        setIsSubmitting(true)
        if (editingDishId) {
          // Update existing dish
          await dishService.update(editingDishId, localDishToApi(dishToSave))
          setDishes(prev => prev.map(d => d.id === editingDishId ? { ...dishToSave, id: editingDishId } : d))
          toast({
            title: t('toast.dishUpdated.title'),
            description: t('toast.dishUpdated.description'),
            status: 'success',
            duration: MODAL_TIMER,
            isClosable: true,
          })
        } else {
          // Create new dish
          const response = await dishService.create(menuId, localDishToApi(dishToSave))
          setDishes(prev => [...prev, { ...dishToSave, id: response.id }])
          toast({
            title: t('toast.dishCreated.title'),
            description: t('toast.dishCreated.description'),
            status: 'success',
            duration: MODAL_TIMER,
            isClosable: true,
          })
        }
      } catch (err) {
        toast({
          title: t('toast.apiError.title'),
          description: err instanceof ApiError ? err.message : t('toast.apiError.description'),
          status: 'error',
          duration: MODAL_TIMER,
          isClosable: true,
        })
        return
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // No menu yet, save locally
      if (editingDishId !== null) {
        setDishes(prev => prev.map(d => d.id === editingDishId ? dishToSave : d))
        toast({
          title: t('toast.dishUpdated.title'),
          description: t('toast.dishUpdated.description'),
          status: 'success',
          duration: MODAL_TIMER,
          isClosable: true,
        })
      } else {
        // Generate a temporary local ID
        const tempId = Date.now()
        setDishes(prev => [...prev, { ...dishToSave, id: tempId }])
        toast({
          title: t('toast.dishSaved.title'),
          description: t('toast.dishSaved.description'),
          status: 'success',
          duration: MODAL_TIMER,
          isClosable: true,
        })
      }
    }

    resetDishForm()
    closeModal()
  }

  const deleteDish = async (dish: LocalDish) => {
    if (dish.id && menuId) {
      try {
        await dishService.delete(dish.id)
        toast({
          title: t('toast.dishDeleted.title'),
          description: t('toast.dishDeleted.description'),
          status: 'success',
          duration: MODAL_TIMER,
          isClosable: true,
        })
      } catch (err) {
        toast({
          title: t('toast.apiError.title'),
          description: err instanceof ApiError ? err.message : t('toast.apiError.description'),
          status: 'error',
          duration: MODAL_TIMER,
          isClosable: true,
        })
        return
      }
    }
    setDishes(prev => prev.filter(d => d.id !== dish.id))
  }

  /**
   * Save menu as draft (no strict validations required).
   * Only menu title is required for drafts.
   */
  const saveDraft = async () => {
    if (!title) {
      toast({
        title: t('toast.menuTitleRequired.title'),
        description: t('toast.menuTitleRequired.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    setIsSavingDraft(true)

    try {
      let currentMenuId = menuId
      if (!currentMenuId) {
        // Create new menu as draft
        const menuResponse = await menuService.create({
          title,
          description: menuDesc || undefined,
        })
        currentMenuId = menuResponse.id
        setMenuId(currentMenuId)

        // Create all dishes if any
        for (const dish of dishes) {
          const response = await dishService.create(currentMenuId, localDishToApi(dish))
          dish.id = response.id
        }
        setDishes([...dishes])
      } else {
        // Update existing menu, keeping it as draft
        await menuService.update(currentMenuId, {
          title,
          description: menuDesc || undefined,
          status: 'draft',
        })
      }

      setMenuStatus('draft')

      toast({
        title: t('toast.draftSaved.title'),
        description: t('toast.draftSaved.description'),
        status: 'success',
        duration: MODAL_TIMER,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: t('toast.apiError.title'),
        description: err instanceof ApiError ? err.message : t('toast.apiError.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  /**
   * Submit menu for processing (strict validations required).
   * Requires title and at least one dish.
   */
  const submitMenu = async () => {
    if (!title) {
      toast({
        title: t('toast.menuTitleRequired.title'),
        description: t('toast.menuTitleRequired.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    if (dishes.length === 0) {
      toast({
        title: t('toast.dishesRequired.title'),
        description: t('toast.dishesRequired.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create menu if not already created
      let currentMenuId = menuId
      if (!currentMenuId) {
        const menuResponse = await menuService.create({
          title,
          description: menuDesc || undefined,
        })
        currentMenuId = menuResponse.id
        setMenuId(currentMenuId)

        // Create all dishes
        for (const dish of dishes) {
          const response = await dishService.create(currentMenuId, localDishToApi(dish))
          dish.id = response.id
        }
        setDishes([...dishes])
      } else {
        await menuService.update(currentMenuId, {
          title,
          description: menuDesc || undefined,
        })
      }

      // Submit the menu (change status to 'submitted')
      await menuService.submit(currentMenuId)
      setMenuStatus('submitted')

      toast({
        title: t('toast.menuSubmitted.title'),
        description: t('toast.menuSubmitted.description'),
        status: 'success',
        duration: MODAL_TIMER,
        isClosable: true,
      })

      onDone?.({
        menuId: currentMenuId,
        submittedAt: Date.now(),
      })
    } catch (err) {
      toast({
        title: t('toast.apiError.title'),
        description: err instanceof ApiError ? err.message : t('toast.apiError.description'),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while attributes load
  if (attributesLoading || isLoadingExistingMenu) {
    return (
      <Center py={10}>
        <Stack align="center">
          <Spinner size="xl" color="brand.500" />
          <Text color="gray.300">{t('toast.loadingAttributes.description')}</Text>
        </Stack>
      </Center>
    )
  }

  if (existingMenuError) {
    return (
      <Alert status="error">
        <AlertIcon />
        {existingMenuError}
      </Alert>
    )
  }

  if (attributesError) {
    return (
      <Alert status="error">
        <AlertIcon />
        {attributesError}
      </Alert>
    )
  }

  return (
    <>
      {/* Show current status badge when editing an existing menu */}
      {menuId && (
        <Flex mb={4}>
          <Badge
            colorScheme={menuStatus === 'submitted' ? 'green' : 'yellow'}
            variant="subtle"
            fontSize="sm"
            px={3}
            py={1}
          >
            {t(`menus.status.${menuStatus}`)}
          </Badge>
        </Flex>
      )}

      <InputWrapper label={t("main.menuTitle")} isRequired>
        <Input value={title} onChange={(e) => { e.preventDefault(); setTitle(e.target.value) }} />
        <FormHelperText mb={3}>{t("main.formTitleCaption")}</FormHelperText>
      </InputWrapper>

      <InputWrapper label={t("main.description")} isRequired={false}>
        <Textarea
          value={menuDesc}
          onChange={(e) => { e.preventDefault(); setMenuDesc(e.target.value) }}
          placeholder={t("main.descriptionPlaceholder")}
        />
      </InputWrapper>

      <Text m={3}>
        {t("main.formDescription3")}
      </Text>

      <Container maxW={'xl'} bg={containerBg} borderRadius='xl' p={4} mt={6} borderWidth={1} borderColor={containerBorder} boxShadow="sm">
        <Flex>
          <Center>
            <Icon boxSize={6} mr={2} as={RiRestaurantFill} />
            <Text>{t("main.menuItems")}</Text>
          </Center>
          <Spacer />
          <Button
            onClick={() => {
              resetDishForm()
              openModal()
            }}
            style={{ marginBottom: '1rem'}}
            leftIcon={<AddIcon />}
          >
            {t("main.addItem")}
          </Button>

          <Modal
            scrollBehavior='outside'
            closeOnOverlayClick={false}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            <ModalOverlay />
            <ModalContent>
              <Stack direction='row'>
                <Center>
                  <div>
                    <ModalHeader>{t('modal.title')}</ModalHeader>
                  </div>
                </Center>
                <Center>
                  <div>
                    <SectionSelect sectionHandler={(section: Section) => setCurrentDish(prev => ({ ...prev, section }))} />
                  </div>
                </Center>
              </Stack>
              <ModalCloseButton />
              <ModalBody>
                <InputWrapper label={t('modal.name')} isRequired>
                  <Input
                    value={currentDish.name}
                    onChange={(e) => setCurrentDish(prev => ({ ...prev, name: e.target.value }))}
                  />
                </InputWrapper>
                <InputWrapper label={t('modal.description')} isRequired={false}>
                  <Textarea
                    value={currentDish.description}
                    onChange={(e) => setCurrentDish(prev => ({ ...prev, description: e.target.value }))}
                  />
                </InputWrapper>

                <Heading mt={4} mb={6} size='md'>{t('modal.sections.tastes.base')}</Heading>
                <Stack direction='column' spacing='2.5rem'>
                  {baseParams.map((param, index) => (
                    <TasteSlider
                      key={index}
                      label={`base.${param.label}`}
                      ariaLabel={`${param.label}-slider`}
                      value={currentDish[param.label as keyof LocalDish] as number}
                      setValueCallback={handleTasteChange}
                      isChecked={param.isChecked}
                      checkCallback={param.checkCallback}
                    />
                  ))}
                </Stack>

                <Heading mt={6} mb={6} size='md'>{t('modal.sections.tastes.other')}</Heading>
                <Stack direction='column' spacing='2.5rem'>
                  {otherParams.map((param, index) => (
                    <TasteSlider
                      key={index}
                      label={`other.${param.label}`}
                      ariaLabel={`${param.label}-slider`}
                      value={currentDish[param.label as keyof LocalDish] as number}
                      setValueCallback={handleTasteChange}
                      min={param.min}
                      max={param.max}
                      isChecked={param.isChecked}
                      checkCallback={param.checkCallback}
                    />
                  ))}

                  <TextureSelectApi
                    textures={textures}
                    selectedIds={currentDish.texture_ids}
                    onChange={(ids) => setCurrentDish(prev => ({ ...prev, texture_ids: ids }))}
                  />
                </Stack>

                <Heading mt={4} mb={6} size='md'>{t('modal.sections.vision')}</Heading>
                <ShapesSelectApi
                  shapes={shapes}
                  selectedIds={currentDish.shape_ids}
                  onChange={(ids) => setCurrentDish(prev => ({ ...prev, shape_ids: ids }))}
                />

                <Stack direction='column' spacing='2.5rem'>
                  {colorObjects.map((colorObject, index) => (
                    <ColorSelector
                      key={index}
                      label={`${t('modal.sections.color')} ${index + 1}`}
                      isChecked={colorObject.check}
                      checkHandler={colorObject.setCheck}
                      colorSetter={colorObject.setColor}
                      value={colorObject.color}
                    />
                  ))}
                </Stack>

                <Heading mt={4} mb={6} size='md'>{t('modal.sections.emotions')}</Heading>
                <EmotionSelectApi
                  emotions={emotions}
                  selectedIds={currentDish.emotion_ids}
                  onChange={(ids) => setCurrentDish(prev => ({ ...prev, emotion_ids: ids }))}
                />

              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <Button
                  mr={3}
                  onClick={saveDishLocal}
                  isLoading={isSubmitting}
                >
                  {t('modal.submit')}
                </Button>
                <Button variant='outline' colorScheme='red' onClick={closeModal}>{t('modal.cancel')}</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Flex>

        <Center>
          <Box w="100%" minHeight="5rem">
            {dishes.length !== 0 ? (
              <Reorder.Group
                style={{ listStyleType: 'none', padding: 0, margin: 0 }}
                axis="y"
                values={dishes}
                onReorder={setDishes}
              >
                <Stack spacing={3}>
                  {dishes.map((dish, index) => (
                    <Reorder.Item
                      key={dish.id ?? dish.name}
                      value={dish}
                      style={{ cursor: 'grab' }}
                      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
                    >
                      <Box
                        bg={cardBg}
                        borderRadius="xl"
                        borderWidth={1}
                        borderColor={cardBorder}
                        p={4}
                        transition="all 0.2s"
                        _hover={{ borderColor: 'brand.500', boxShadow: 'md' }}
                      >
                        <Flex align="center" gap={3}>
                          {/* Drag Handle */}
                          <Tooltip label={t('main.dragToReorder')} placement="top">
                            <Center
                              p={2}
                              borderRadius="md"
                              color={iconColor}
                              _hover={{ color: 'brand.500', bg: hoverBg }}
                            >
                              <Icon as={MdDragIndicator} boxSize={5} />
                            </Center>
                          </Tooltip>

                          {/* Dish Info */}
                          <Box flex={1} minW={0}>
                            <Flex align="center" gap={2} mb={1}>
                              <Text
                                fontWeight="semibold"
                                color={textColor}
                                fontSize="md"
                                noOfLines={1}
                              >
                                {dish.name}
                              </Text>
                              {dish.section && dish.section !== Section.None && (
                                <Badge
                                  colorScheme="yellow"
                                  variant="subtle"
                                  fontSize="xs"
                                  textTransform="capitalize"
                                >
                                  {t(`cathegory.${dish.section}`)}
                                </Badge>
                              )}
                            </Flex>
                            {dish.description && (
                              <Text color={mutedColor} fontSize="sm" noOfLines={1}>
                                {dish.description}
                              </Text>
                            )}
                            {/* Color indicators */}
                            {[dish.color1, dish.color2, dish.color3].some(c => c !== '#ffffff') && (
                              <Flex gap={1} mt={2}>
                                {[dish.color1, dish.color2, dish.color3]
                                  .filter(c => c !== '#ffffff')
                                  .map((color, i) => (
                                    <Box
                                      key={i}
                                      w={4}
                                      h={4}
                                      borderRadius="full"
                                      bg={color}
                                      borderWidth={1}
                                      borderColor={cardBorder}
                                    />
                                  ))}
                              </Flex>
                            )}
                          </Box>

                          {/* Order number */}
                          <Text color={mutedColor} fontSize="sm" fontWeight="medium" mr={2}>
                            #{index + 1}
                          </Text>

                          {/* Actions */}
                          <Flex gap={2}>
                            <Tooltip label={t('main.edit')} placement="top">
                              <IconButton
                                aria-label={t('main.edit')}
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                _hover={{ color: 'brand.500', bg: hoverBg }}
                                onClick={() => { loadDishIntoForm(dish); openModal() }}
                              />
                            </Tooltip>
                            <Tooltip label={t('main.delete')} placement="top">
                              <IconButton
                                aria-label={t('main.delete')}
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => deleteDish(dish)}
                              />
                            </Tooltip>
                          </Flex>
                        </Flex>
                      </Box>
                    </Reorder.Item>
                  ))}
                </Stack>
              </Reorder.Group>
            ) : (
              <Center py={8}>
                <Stack align="center" spacing={3}>
                  <Icon as={RiRestaurantFill} boxSize={10} color="gray.500" />
                  <Text color="gray.500" fontSize="sm">
                    {t("main.emptyMenu")}
                  </Text>
                </Stack>
              </Center>
            )}
          </Box>
        </Center>

      </Container>

      <Center mt={5}>
        <Stack direction={'row'}>
          <Button
            onClick={submitMenu}
            variant={'solid'}
            leftIcon={<EmailIcon />}
            isLoading={isSubmitting}
            isDisabled={isSavingDraft}
          >
            {t('main.submit')}
          </Button>
          <Button
            variant={'outline'}
            leftIcon={<FaSave />}
            onClick={saveDraft}
            isLoading={isSavingDraft}
            isDisabled={isSubmitting}
          >
            {t('main.save')}
          </Button>
        </Stack>
      </Center>
    </>
  )
}

export default MenuRequestForm
