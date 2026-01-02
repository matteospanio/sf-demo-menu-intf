import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Initialize i18n for tests
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        main: {
          actions: 'Actions',
          newMenuRequest: 'New Menu Request',
          formDescription: 'Fill in the form to create a new menu request.',
          formDescription2: 'You can add multiple dishes.',
        },
        cathegory: {
          appetizer: 'Appetizer',
          firstCourse: 'First Course',
          secondCourse: 'Second Course',
          dessert: 'Dessert',
          none: 'None',
        },
        tastes: {
          'basic.sweet': 'Sweet',
          'basic.salty': 'Salty',
          'basic.bitter': 'Bitter',
          'basic.sour': 'Sour',
          'basic.umami': 'Umami',
          'other.piquant': 'Piquant',
          'other.fat': 'Fat',
          'other.temperature': 'Temperature',
        },
        colors: {
          color1: 'Color 1',
          color2: 'Color 2',
          color3: 'Color 3',
        },
        form: {
          dishName: 'Dish Name',
          dishDescription: 'Dish Description',
          addDish: 'Add Dish',
          submit: 'Submit',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          section: 'Section',
        },
        auth: {
          login: 'Login',
          register: 'Register',
          logout: 'Logout',
          username: 'Username',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          welcome: 'Welcome to SoundFood',
          fieldsRequired: 'All fields are required',
          passwordMismatch: 'Passwords do not match',
          passwordTooShort: 'Password must be at least 6 characters',
        },
        buttons: {
          addDish: 'Add Dish',
          summary: 'Summary',
          submit: 'Submit Menu',
          sendByEmail: 'Send by Email',
        },
        emotions: {
          joy: 'Joy',
          anger: 'Anger',
          fear: 'Fear',
          sadness: 'Sadness',
          surprise: 'Surprise',
        },
        textures: {
          crunchy: 'Crunchy',
          soft: 'Soft',
          liquid: 'Liquid',
          creamy: 'Creamy',
        },
        shapes: {
          sharp: 'Sharp',
          round: 'Round',
          smooth: 'Smooth',
        },
      },
    },
    it: {
      translation: {
        main: {
          actions: 'Azioni',
          newMenuRequest: 'Nuova Richiesta Menu',
        },
        auth: {
          login: 'Accedi',
          register: 'Registrati',
        },
      },
    },
  },
})

// Mock AuthContext for tests
import { createContext, useContext, useState } from 'react'

interface MockAuthContextType {
  user: { id: number; username: string } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  clearError: () => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

interface MockAuthProviderProps {
  children: ReactNode
  initialAuth?: boolean
  initialUser?: { id: number; username: string } | null
}

export function MockAuthProvider({
  children,
  initialAuth = false,
  initialUser = null,
}: MockAuthProviderProps) {
  const [user, setUser] = useState(initialUser)
  const [error, setError] = useState<string | null>(null)
  const [isLoading] = useState(false)

  return (
    <MockAuthContext.Provider
      value={{
        user,
        isAuthenticated: initialAuth,
        isLoading,
        login: async (username: string) => {
          setUser({ id: 1, username })
        },
        register: async (username: string) => {
          setUser({ id: 1, username })
        },
        logout: async () => {
          setUser(null)
        },
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}

interface AllProvidersProps {
  children: ReactNode
  initialAuth?: boolean
}

const AllProviders = ({ children, initialAuth = true }: AllProvidersProps) => {
  return (
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>
        <MockAuthProvider initialAuth={initialAuth}>{children}</MockAuthProvider>
      </I18nextProvider>
    </ChakraProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialAuth?: boolean }
) => {
  const { initialAuth, ...renderOptions } = options || {}
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialAuth={initialAuth}>{children}</AllProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render, i18n }
