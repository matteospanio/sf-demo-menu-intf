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
          formDescription3: 'The menu is made up of a list of courses.',
          menuTitle: 'Menu Title',
          formTitleCaption: 'The id you\'ll use to reference this menu.',
          description: 'Description',
          descriptionPlaceholder: 'A qualitative description of the menu.',
          menuItems: 'Menu Items',
          addItem: 'Add',
          emptyMenu: 'No menu items yet.',
          dragToReorder: 'Drag to reorder',
          submit: 'Submit',
          save: 'Save draft',
          edit: 'Edit',
          delete: 'Delete',
        },
        toast: {
          menuTitleRequired: {
            title: 'Menu title is required',
            description: 'Please provide a title for the menu.',
          },
          dishesRequired: {
            title: 'Dishes are required',
            description: 'Please provide at least one menu item.',
          },
          menuSubmitted: {
            title: 'Menu sent successfully',
            description: '',
          },
          draftSaved: {
            title: 'Draft saved',
            description: 'Your menu has been saved as draft.',
          },
          apiError: {
            title: 'Error',
            description: 'An error occurred while communicating with the server.',
          },
          loadingAttributes: {
            title: 'Loading',
            description: 'Loading attributes from server...',
          },
          nameRequired: {
            title: 'Name is required',
            description: 'Please provide a name for the dish.',
          },
          dishUpdated: {
            title: 'Dish updated',
            description: 'The dish has been updated successfully.',
          },
          dishSaved: {
            title: 'Dish saved',
            description: 'The dish has been saved successfully.',
          },
          dishCreated: {
            title: 'Dish created',
            description: 'The dish has been added to the menu.',
          },
          dishDeleted: {
            title: 'Dish deleted',
            description: 'The dish has been removed from the menu.',
          },
        },
        modal: {
          title: 'New Dish',
          name: 'Name',
          description: 'Description',
          sections: {
            emotions: 'Emotions',
            tastes: {
              base: 'Basic tastes',
              other: 'Other parameters',
            },
            vision: 'Vision',
            color: 'Color',
          },
          submit: 'Save',
          cancel: 'Close',
        },
            settings: {
              title: 'Settings',
              themeDark: 'Dark mode',
              language: 'Language',
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
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          welcome: 'Welcome to SoundFood',
          fieldsRequired: 'All fields are required',
          invalidEmail: 'Please enter a valid email address',
          passwordMismatch: 'Passwords do not match',
          passwordTooShort: 'Password must be at least 6 characters',
        },
        profile: {
          title: 'Profile',
          memberSince: 'Member since {{date}}',
          emailHidden: 'Email is hidden for security',
          changeEmail: 'Change email',
          changePassword: 'Change password',
          newEmail: 'New email',
          emailRequired: 'Email is required',
          currentPassword: 'Current password',
          currentPasswordPlaceholder: 'Enter your current password',
          newPassword: 'New password',
          newPasswordPlaceholder: 'Enter your new password',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
          emailUpdated: {
            title: 'Email updated',
            description: 'Your email has been updated successfully.',
          },
          passwordUpdated: {
            title: 'Password updated',
            description: 'Your password has been updated successfully.',
          },
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
        topLeft: {
          profile: 'Profile',
          myMenus: 'My menus',
          newMenuRequest: 'New menu request',
          adminArea: 'Admin area',
          logout: 'Logout',
          settings: 'Settings',
          openMenu: 'Open menu',
        },
        menus: {
          title: 'My menus',
          detailsTitle: 'Menu details',
          editTitle: 'Edit menu request',
          createNew: 'New menu request',
          loading: 'Loading menus...',
          emptyTitle: 'No menus yet',
          emptyDescription: 'Create your first menu request to see it here.',
          dishCount: '{{count}} dishes',
          dishesTitle: 'Dishes',
          noDishes: 'No dishes for this menu.',
          lastModified: 'Modified {{time}}',
          justSent: 'Just sent',
          status: {
            draft: 'Draft',
            submitted: 'Submitted',
          },
          actions: {
            view: 'View',
            edit: 'Edit',
            delete: 'Delete',
            back: 'Back',
          },
          delete: {
            title: 'Delete menu',
            description: 'Delete "{{title}}"? This action cannot be undone.',
            cancel: 'Cancel',
            confirm: 'Delete',
          },
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
        profile: {
          title: 'Profilo',
          memberSince: 'Membro dal {{date}}',
          emailHidden: "L'email è nascosta per sicurezza",
          changeEmail: 'Cambia email',
          changePassword: 'Cambia password',
          newEmail: 'Nuova email',
          emailRequired: "L'email è obbligatoria",
          currentPassword: 'Password attuale',
          currentPasswordPlaceholder: 'Inserisci la password attuale',
          newPassword: 'Nuova password',
          newPasswordPlaceholder: 'Inserisci la nuova password',
          showPassword: 'Mostra password',
          hidePassword: 'Nascondi password',
          emailUpdated: {
            title: 'Email aggiornata',
            description: 'La tua email è stata aggiornata con successo.',
          },
          passwordUpdated: {
            title: 'Password aggiornata',
            description: 'La tua password è stata aggiornata con successo.',
          },
        },
        topLeft: {
          profile: 'Profilo',
          myMenus: 'I miei menu',
          newMenuRequest: 'Nuova richiesta menu',
          logout: 'Esci',
          settings: 'Impostazioni',
        },
        menus: {
          title: 'I miei menu',
          detailsTitle: 'Dettagli menu',
          editTitle: 'Modifica richiesta menu',
          createNew: 'Nuova richiesta menu',
          loading: 'Caricamento menu...',
          emptyTitle: 'Nessun menu',
          emptyDescription: 'Crea la tua prima richiesta menu per vederla qui.',
          dishCount: '{{count}} portate',
          dishesTitle: 'Portate',
          noDishes: 'Nessuna portata per questo menu.',
          actions: {
            view: 'Vedi',
            edit: 'Modifica',
            delete: 'Elimina',
            back: 'Indietro',
          },
          delete: {
            title: 'Elimina menu',
            description: 'Eliminare "{{title}}"? Questa azione non può essere annullata.',
            cancel: 'Annulla',
            confirm: 'Elimina',
          },
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
  register: (username: string, email: string, password: string) => Promise<void>
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
