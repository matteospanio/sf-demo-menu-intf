import { Center, Spinner } from "@chakra-ui/react"

function Loader() {
  return (
    <Center h="100vh" bg="gray.800">
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.600'
        color='brand.500'
        size='xl'
      />
    </Center>
  )
}

export default Loader
