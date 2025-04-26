import { Routes, Route } from 'react-router-dom'
import { ThemeOptions, alpha } from '@mui/material'
import Layout from './components/Layout'
import { type CustomTheme } from './theme'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material'


declare module '@mui/material/styles' {
  interface CustomTheme {
    shadows: {
      light: string;
      medium: string;
      dark: string;
      paper: string;
      button:string;
    };
    gradients: {
      paper:string;
    };
    textShadow: string;
    textShadow: { main: string };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#4a148c', // Deep purple
      light: '#7c43bd', // Lighter purple
      dark: '#12005e', // Dark purple
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff6f00', // Vivid orange
      light: '#ffa040', // Lighter orange
      dark: '#c43e00', // Dark orange
      contrastText: '#fff',
    },
    background: {
      default: '#f8f8ff', // Very light gray
      paper: '#fff',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(','),
    fontSize: 15,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    body1: {
      lineHeight: 1.75,
    }
  },
  shadows: {
    light: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
    dark: '0 8px 16px rgba(0, 0, 0, 0.2)',
    paper: '0 8px 32px 0 rgba(31,38,135,0.15)',
    button: '0 6px 10px rgba(0, 0, 0, 0.12)',
  },
  gradients: {
    paper: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
  },
  textShadow: { main: '0 2px 4px rgba(0, 0, 0, 0.2)' },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: (theme) => theme.gradients.paper,
          boxShadow: (theme) => theme.shadows.paper,
          backdropFilter: 'blur(5px)',
          borderRadius: 16,
          padding: 16,
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: (theme) => theme.shadows.button,
          backgroundImage: (theme) =>
          `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.shadows.medium,
          },
          '&.Mui-disabled': {
            backgroundColor: '#e0e0e0',
            color: '#9e9e9e',
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          color: 'white',
          textShadow: (theme) => theme.textShadow.main,
        },
        text: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    }
  }
}
)
const theme = createTheme(themeOptions);
;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App