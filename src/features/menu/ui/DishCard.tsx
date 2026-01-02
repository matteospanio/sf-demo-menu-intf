import { Avatar, Card, CardBody, Center, Heading, ListItem, Stack, Text, UnorderedList, useColorModeValue } from '@chakra-ui/react'
import { Dish } from '../model/dish'
import { useTranslation } from 'react-i18next'
import { IoMdColorPalette } from 'react-icons/io'

interface CardProps {
  dish: Dish
}

function DishCard({dish}: CardProps) {
  const {t} = useTranslation()

  const portata = t(`cathegory.${dish.section}`)

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Card
      direction={{ base: 'column', md: 'row' }}
      bg={cardBg}
      borderWidth={1}
      borderColor={cardBorder}
      borderRadius="xl"
      boxShadow="sm"
      _hover={{ borderColor: 'brand.500', boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <Stack direction='row'>
        <Center>
        {dish.vision.colors.length != 0
        ? <Stack spacing='1rem'>
          {dish.vision.colors.map((col, idx) => {
            return <Avatar key={idx} borderColor={cardBorder} borderWidth={1} bg={col} icon={<IoMdColorPalette />} />
          })}
        </Stack>
        : <></>
        }
        </Center>
        <CardBody>
          <Heading size='md' color={headingColor}>{dish.name}</Heading>
          <Text py='2' color={textColor}>
            {dish.section != 'none' ? `${portata}, ` : ''}{dish.description}
          </Text>
          <Stack direction='row' spacing={10}>
            <UnorderedList color={mutedColor}>
              <ListItem>Sweet: {dish.tastes.basic.sweet ?? 'ND'}</ListItem>
              <ListItem>Salty: {dish.tastes.basic.salty ?? 'ND'}</ListItem>
              <ListItem>Bitter: {dish.tastes.basic.bitter ?? 'ND'}</ListItem>
              <ListItem>Sour: {dish.tastes.basic.sour ?? 'ND'}</ListItem>
              <ListItem>Umami: {dish.tastes.basic.umami ?? 'ND'}</ListItem>
            </UnorderedList>
            <UnorderedList color={mutedColor}>
              <ListItem>Piquant: {dish.tastes.other.piquant ?? 'ND'}</ListItem>
              <ListItem>Fat: {dish.tastes.other.fat ?? 'ND'}</ListItem>
              <ListItem>Temperature: {dish.tastes.other.temperature ?? 'ND'} °C</ListItem>
            </UnorderedList>
            {dish.emotions.length != 0
            ? <UnorderedList color={mutedColor}>
              {dish.emotions.map((emotion, index) => {
                return <ListItem key={index}>{emotion}</ListItem>
              })}
            </UnorderedList>
            : <></>
            }
            {dish.textures.length != 0
            ? <UnorderedList color={mutedColor}>
              {dish.textures.map((txt, index) => {
                return <ListItem key={index}>{txt}</ListItem>
              })}
            </UnorderedList>
            : <></>
            }
            {dish.vision.shapes.length != 0
            ? <UnorderedList color={mutedColor}>
              {dish.vision.shapes.map((shp, index) => {
                return <ListItem key={index}>{shp}</ListItem>
              })}
            </UnorderedList>
            : <></>
            }
          </Stack>
        </CardBody>
      </Stack>
    </Card>
  )
}

export default DishCard
