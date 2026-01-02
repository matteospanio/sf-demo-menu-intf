import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { MultiSelectTheme } from 'chakra-multiselect'

/**
 * SoundFood Brand Colors
 *
 * Inspired by the SoundFood website (soundfood.it)
 * Elegant and minimal design with yellow as primary accent
 * Light mode default with glass/blur effects
 */
export const brand = {
  black: '#1a1a1a',
  darkGray: '#2d2d2d',
  mediumGray: '#4a4a4a',
  lightGray: '#8a8a8a',
  yellow: '#f5c518',
  yellowHover: '#e6b800',
  yellowLight: '#ffd84d',
  white: '#ffffff',
  offWhite: '#f5f5f5',
} as const

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#fff9db',
      100: '#ffefae',
      200: '#ffe47d',
      300: '#ffd84d',
      400: '#ffcc1f',
      500: '#f5c518', // Primary yellow
      600: '#e6b800',
      700: '#b38f00',
      800: '#806600',
      900: '#4d3d00',
    },
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    MultiSelect: MultiSelectTheme,
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'lg',
      },
      variants: {
        solid: () => ({
          bg: 'brand.500',
          color: 'gray.900',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
            _disabled: {
              bg: 'brand.500',
              transform: 'none',
            },
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        }),
        outline: (props: { colorMode: string }) => ({
          borderColor: 'brand.500',
          color: 'brand.600',
          borderWidth: '2px',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'brand.50',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s',
        }),
        ghost: (props: { colorMode: string }) => ({
          color: props.colorMode === 'dark' ? 'white' : 'gray.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
          },
        }),
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          borderWidth: '1px',
          borderRadius: 'xl',
          boxShadow: 'sm',
        },
      }),
    },
    Input: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
            borderRadius: 'lg',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Textarea: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
          borderRadius: 'lg',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Select: {
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
            borderRadius: 'lg',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        }),
      },
    },
    Checkbox: {
      baseStyle: (props: { colorMode: string }) => ({
        control: {
          borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
          borderRadius: 'md',
          _checked: {
            bg: 'brand.500',
            borderColor: 'brand.500',
            color: 'gray.900',
          },
        },
      }),
    },
    Tabs: {
      variants: {
        enclosed: (props: { colorMode: string }) => ({
          tab: {
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
            color: props.colorMode === 'dark' ? 'gray.400' : 'gray.600',
            fontWeight: '500',
            _selected: {
              bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
              borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
              borderBottomColor: props.colorMode === 'dark' ? 'gray.800' : 'white',
              color: 'brand.500',
            },
          },
          tabpanel: {
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          },
        }),
      },
    },
    Modal: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          borderWidth: '1px',
          borderRadius: 'xl',
          boxShadow: '2xl',
        },
        header: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        body: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.700',
        },
      }),
    },
    Heading: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        fontWeight: '600',
      }),
    },
    Text: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.700',
      }),
    },
    FormLabel: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'gray.200' : 'gray.700',
        fontWeight: '500',
      }),
    },
    Divider: {
      baseStyle: (props: { colorMode: string }) => ({
        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
      }),
    },
    Alert: {
      variants: {
        subtle: (props: { colorMode: string }) => ({
          container: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
            borderRadius: 'lg',
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: { colorMode: string }) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          borderRadius: 'xl',
          boxShadow: 'xl',
          py: 2,
        },
        item: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          color: props.colorMode === 'dark' ? 'gray.100' : 'gray.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
        },
        divider: {
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
        },
      }),
    },
    Breadcrumb: {
      baseStyle: (props: { colorMode: string }) => ({
        link: {
          color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
          _hover: {
            color: 'brand.500',
            textDecoration: 'none',
          },
        },
        separator: {
          color: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
        },
      }),
    },
    Slider: {
      baseStyle: (props: { colorMode: string }) => ({
        track: {
          bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          borderRadius: 'full',
        },
        filledTrack: {
          bg: 'brand.500',
        },
        thumb: {
          bg: 'brand.500',
          borderColor: 'brand.500',
          boxShadow: 'md',
        },
      }),
    },
    Drawer: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        },
        header: {
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        body: {
          color: props.colorMode === 'dark' ? 'gray.100' : 'gray.700',
        },
        closeButton: {
          color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
        },
      }),
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 2,
        py: 0.5,
        fontWeight: '500',
      },
    },
    Tooltip: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.800',
        color: 'white',
        borderRadius: 'lg',
        px: 3,
        py: 2,
        fontWeight: '500',
      }),
    },
  },
})

export default theme
