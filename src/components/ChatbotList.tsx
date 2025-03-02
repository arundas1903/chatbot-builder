import React from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual data later
const mockChatbots = [
  {
    id: 1,
    name: 'Sales Assistant',
    platform: 'Salesforce',
    status: 'Active',
    createdAt: '2024-03-15',
    messages: 1234,
  },
  {
    id: 2,
    name: 'Customer Support',
    platform: 'Zoho',
    status: 'Inactive',
    createdAt: '2024-03-14',
    messages: 856,
  },
  {
    id: 3,
    name: 'Product Advisor',
    platform: 'Shopify',
    status: 'Active',
    createdAt: '2024-03-13',
    messages: 2341,
  },
];

const ChatbotList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Chatbots
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/chatbot/create')}
        >
          Create New Chatbot
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: (theme) => theme.palette.primary.main,
              '& th': { 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }
            }}>
              <TableCell>Name</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Total Messages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockChatbots.map((chatbot) => (
              <TableRow
                key={chatbot.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(`/chatbot/${chatbot.id}`)}
              >
                <TableCell>
                  <Typography variant="subtitle2">{chatbot.name}</Typography>
                </TableCell>
                <TableCell>{chatbot.platform}</TableCell>
                <TableCell>
                  <Chip
                    label={chatbot.status}
                    size="small"
                    color={chatbot.status === 'Active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>{chatbot.createdAt}</TableCell>
                <TableCell align="right">{chatbot.messages.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ChatbotList; 