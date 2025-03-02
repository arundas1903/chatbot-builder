import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B0A3D', // Tata Communications primary purple
      light: '#3B1657',
      dark: '#1A0624',
    },
    secondary: {
      main: '#00B5E2', // Tata Communications blue
      light: '#33C3E8',
      dark: '#007E9E',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: 'background.default',
              overflow: 'auto'
            }}
          >
            <Container maxWidth="lg">
              {children}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 