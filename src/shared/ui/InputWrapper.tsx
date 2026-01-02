import { FormControl, FormLabel } from "@chakra-ui/react"

interface InputWrapperProps {
    label: string
    isRequired: boolean
    children?: React.ReactNode
}

/**
 * Wrapper for input fields
 *
 * @param label
 * @param isRequired
 * @param children
 * @returns
 */
function InputWrapper({label, isRequired, children} : InputWrapperProps) {
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel color="gray.200">{label}</FormLabel>
      {children}
    </FormControl>
  )
}

export default InputWrapper
