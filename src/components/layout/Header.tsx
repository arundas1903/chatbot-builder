import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            TATA
            <Typography
              component="span"
              sx={{
                color: 'secondary.main',
                fontWeight: 'bold',
                ml: 1,
                borderLeft: '1px solid',
                borderColor: 'divider',
                pl: 2
              }}
            >
              Chatbot Builder
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<MenuBookIcon />}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Documentation
          </Button>
          <Button
            startIcon={<HelpIcon />}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Support
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 