import { Avatar, AvatarGroup, Card, CardBody, Center, Heading, ListItem, Stack, Text, UnorderedList } from '@chakra-ui/react'
import { Dish } from '../dish'
import { useTranslation } from 'react-i18next'
import { ViewIcon } from '@chakra-ui/icons'
import { IoMdColorPalette } from 'react-icons/io'

interface CardProps {
  dish: Dish
}

function DishCard({dish}: CardProps) {
  const {t} = useTranslation()

  const portata = t(`cathegory.${dish.section}`)

  return (
    <Card
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack direction='row'>
        <Center>
        {dish.vision.colors.length != 0
        ? <Stack spacing='1rem'>
          {dish.vision.colors.map((col, idx) => {
            return <Avatar key={idx} borderColor='black' borderWidth={1} bg={col} icon={<IoMdColorPalette />} />
          })}
        </Stack>
        : <></>
        }
        </Center>
        <CardBody>
          <Heading size='md'>{dish.name}</Heading>
          <Text py='2'>
            {dish.section != 'none' ? `${portata}, ` : ''}{dish.description}
          </Text>
          <Stack direction='row' spacing={10}>
            <UnorderedList>
              <ListItem>Sweet: {dish.tastes.basic.sweet ?? 'ND'}</ListItem>
              <ListItem>Salty: {dish.tastes.basic.salty ?? 'ND'}</ListItem>
              <ListItem>Bitter: {dish.tastes.basic.bitter ?? 'ND'}</ListItem>
              <ListItem>Sour: {dish.tastes.basic.sour ?? 'ND'}</ListItem>
              <ListItem>Umami: {dish.tastes.basic.umami ?? 'ND'}</ListItem>
            </UnorderedList>
            <UnorderedList>
              <ListItem>Piquant: {dish.tastes.basic.sweet ?? 'ND'}</ListItem>
              <ListItem>Fat: {dish.tastes.basic.fat ?? 'ND'}</ListItem>
              <ListItem>Temperature: {dish.tastes.basic.sweet ?? 'ND'} °C</ListItem>
            </UnorderedList>
            {dish.emotions.length != 0
            ? <UnorderedList>
              {dish.emotions.map((emotion, index) => {
                return <ListItem key={index}>{emotion}</ListItem>
              })}
            </UnorderedList>
            : <></>
            }
            {dish.textures.length != 0
            ? <UnorderedList>
              {dish.textures.map((txt, index) => {
                return <ListItem key={index}>{txt}</ListItem>
              })}
            </UnorderedList>
            : <></>
            }
            {dish.vision.shapes.length != 0
            ? <UnorderedList>
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