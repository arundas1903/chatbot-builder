import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
import ConnectModal from './ConnectModal';

type Platform = 'CRM' | 'Ecommerce';
type SubPlatform = 'Zoho' | 'Salesforce' | 'Shopify' | 'Wordpress';

const ChatbotCreation: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedSubPlatform, setSelectedSubPlatform] = useState<SubPlatform | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [chatbotName, setChatbotName] = useState('');

  const platforms: Record<Platform, SubPlatform[]> = {
    CRM: ['Zoho', 'Salesforce'],
    Ecommerce: ['Shopify', 'Wordpress']
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Create New Chatbot
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Chatbot Name"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              variant="outlined"
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedPlatform || ''}
                label="Select Category"
                onChange={(e) => {
                  setSelectedPlatform(e.target.value as Platform);
                  setSelectedSubPlatform(null);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="CRM">CRM</MenuItem>
                <MenuItem value="Ecommerce">Ecommerce</MenuItem>
              </Select>
            </FormControl>

            {selectedPlatform && (
              <FormControl fullWidth>
                <InputLabel>Select Platform</InputLabel>
                <Select
                  value={selectedSubPlatform || ''}
                  label="Select Platform"
                  onChange={(e) => setSelectedSubPlatform(e.target.value as SubPlatform)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {platforms[selectedPlatform].map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedSubPlatform && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setShowConnectModal(true)}
                  fullWidth
                >
                  Connect to {selectedSubPlatform}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Publish Chatbot
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      <ConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        platform={selectedSubPlatform || ''}
      />
    </>
  );
};

export default ChatbotCreation; 