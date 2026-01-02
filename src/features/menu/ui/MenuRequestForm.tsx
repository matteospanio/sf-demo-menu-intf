import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormHelperText,
  Heading,
  Icon,
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
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { AddIcon, EmailIcon } from '@chakra-ui/icons'
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
import SummaryDrawer from './SummaryDrawer'
import EmotionSelectApi from './EmotionSelectApi'
import TextureSelectApi from './TextureSelectApi'
import ShapesSelectApi from './ShapesSelectApi'
import { useAttributes } from '../hooks'
import {
  menuService,
  dishService,
  CreateDishRequest,
  ApiDish,
  ApiError
} from '../../../api'
import { Dish } from '../model/dish'

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

// Convert to Dish format for SummaryDrawer
const localDishToLegacy = (dish: LocalDish): Dish => ({
  name: dish.name,
  description: dish.description || null,
  section: dish.section,
  tastes: {
    basic: {
      sweet: dish.sweet,
      bitter: dish.bitter,
      sour: dish.sour,
      salty: dish.salty,
      umami: dish.umami,
    },
    other: {
      piquant: dish.piquant,
      fat: dish.fat,
      temperature: dish.temperature,
    },
  },
  vision: {
    colors: [dish.color1, dish.color2, dish.color3].filter(c => c !== '#ffffff'),
    shapes: [],
  },
  textures: [],
  emotions: [],
});

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
  onDone?: () => void
}

function MenuRequestForm({ menuId: initialMenuId, onDone }: MenuRequestFormProps) {
  const { t } = useTranslation()
  const toast = useToast()

  // Load attributes from API
  const { emotions, textures, shapes, isLoading: attributesLoading, error: attributesError } = useAttributes()

  // Menu state
  const [title, setTitle] = useState('')
  const [menuDesc, setMenuDesc] = useState('')
  const [menuId, setMenuId] = useState<number | null>(initialMenuId ?? null)
  const [dishes, setDishes] = useState<LocalDish[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

  const handleCloseDrawer = () => {
    closeDrawer()
    onDone?.()
  }

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

      toast({
        title: t('toast.menuSubmitted.title'),
        description: t('toast.menuSubmitted.description'),
        status: 'success',
        duration: MODAL_TIMER,
        isClosable: true,
      })

      openDrawer()
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
          <Spinner size="xl" color="blue.500" />
          <Text>{t('toast.loadingAttributes.description')}</Text>
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
      <SummaryDrawer
        isOpen={isDrawerOpen}
        closeDrawer={handleCloseDrawer}
        data={{
          title: title,
          description: menuDesc,
          dishes: dishes.map(localDishToLegacy),
        }}
      />

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

      <Container maxW={'xl'} bg={'gray.300'} borderRadius={5} p={3} mt={6}>
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
                  colorScheme='blue'
                  mr={3}
                  onClick={saveDishLocal}
                  isLoading={isSubmitting}
                >
                  {t('modal.submit')}
                </Button>
                <Button colorScheme='red' onClick={closeModal}>{t('modal.cancel')}</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Flex>

        <Center>
          <Box minHeight='5rem'>
            <Reorder.Group
              style={{ listStyleType: 'none', width: '24rem' }}
              axis='y'
              values={dishes}
              onReorder={setDishes}
            >
              {dishes.length !== 0 ? dishes.map((dish) => (
                <Reorder.Item style={{ marginBottom: 6 }} key={dish.id ?? dish.name} value={dish}>
                  <Stack direction='row'>
                    <Center>
                      <Icon as={MdDragIndicator} boxSize={6} />
                      <Text>{dish.name}</Text>
                    </Center>
                    <Spacer />
                    <Button
                      variant='outline'
                      colorScheme='red'
                      onClick={() => deleteDish(dish)}
                    >
                      {t('main.delete')}
                    </Button>
                    <Button
                      variant='outline'
                      colorScheme='blue'
                      onClick={() => { loadDishIntoForm(dish); openModal() }}
                    >
                      {t('main.edit')}
                    </Button>
                  </Stack>
                </Reorder.Item>
              )) :
                <Text color={'gray.500'}>
                  {t("main.emptyMenu")}
                </Text>
              }
            </Reorder.Group>
          </Box>
        </Center>

      </Container>

      <Center mt={5}>
        <Stack direction={'row'}>
          <Button
            onClick={submitMenu}
            variant={'solid'}
            colorScheme='blue'
            leftIcon={<EmailIcon />}
            isLoading={isSubmitting}
          >
            {t('main.submit')}
          </Button>
          <Button variant={'outline'} colorScheme='blue' isDisabled leftIcon={<FaSave />}>
            {t('main.save')}
          </Button>
        </Stack>
      </Center>
    </>
  )
}

export default MenuRequestForm
