import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Divider, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import MenuBar from './components/MenuBar'
import MenuRequestForm from './components/MenuRequestForm'

function App() {

  return (
    <>
    <MenuBar />

    <Container mt='1.5rem' maxW='850px' p={3} borderRadius={5}>

      <Breadcrumb separator={<ChevronRightIcon color='gray..500' />}>
        <BreadcrumbItem>
          <BreadcrumbLink>
            Actions
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>
            New menu request
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Text m={3}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum repellat laboriosam esse consectetur corporis magni, omnis unde sapiente aperiam culpa magnam quo quisquam sequi? Nesciunt inventore repellat placeat perspiciatis quas ea accusantium explicabo aspernatur impedit voluptatum ab numquam cum, perferendis enim libero? Unde est aliquid facilis porro voluptates error sapiente. Amet, est ullam! Corporis, doloremque architecto eius facere quo veritatis praesentium! Quos alias facere voluptatum doloremque at incidunt quibusdam debitis! Aspernatur non optio, alias amet perferendis expedita vero veniam eligendi? Earum quaerat culpa recusandae, at ducimus numquam, fugiat modi provident minus cumque veniam quam aliquam non voluptatem explicabo itaque nesciunt.
      </Text>

      <Divider my={5} orientation='horizontal' />

      <MenuRequestForm />

    </Container>
    </>
  )
}

export default App
