import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import ConnectModal from './ConnectModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Platform = 'CRM' | 'Ecommerce';
type SubPlatform = 'Zoho' | 'Salesforce' | 'Shopify' | 'Wordpress';
type Channel = 'WhatsApp' | 'Voice' | 'Web Chat';

interface Toast {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const ChatbotForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedSubPlatform, setSelectedSubPlatform] = useState<SubPlatform | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | ''>('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [chatbotName, setChatbotName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState<Toast>({
    open: false,
    message: '',
    severity: 'success'
  });

  const platforms: Record<Platform, SubPlatform[]> = {
    CRM: ['Zoho', 'Salesforce'],
    Ecommerce: ['Shopify', 'Wordpress']
  };

  const channels: Channel[] = ['WhatsApp', 'Voice', 'Web Chat'];

  const handleConnect = (credentials: { apiKey: string; apiSecret: string }) => {
    // Here you would typically make an API call to verify the credentials
    // For now, we'll simulate a successful connection
    setIsConnected(true);
    setShowConnectModal(false);
    setToast({
      open: true,
      message: `Successfully connected to ${selectedSubPlatform}`,
      severity: 'success'
    });
  };

  const handlePublish = () => {
    // Here you would typically make an API call to publish the chatbot
    setToast({
      open: true,
      message: 'Chatbot published successfully!',
      severity: 'success'
    });
    
    // Navigate to the list after a short delay
    setTimeout(() => {
      navigate('/chatbot');
    }, 1500);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
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
                  setIsConnected(false);
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
                  onChange={(e) => {
                    setSelectedSubPlatform(e.target.value as SubPlatform);
                    setIsConnected(false);
                  }}
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

            <FormControl fullWidth>
              <InputLabel>Select Channel</InputLabel>
              <Select
                value={selectedChannel}
                label="Select Channel"
                onChange={(e) => setSelectedChannel(e.target.value as Channel)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {channels.map((channel) => (
                  <MenuItem key={channel} value={channel}>
                    {channel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSubPlatform && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setShowConnectModal(true)}
                  fullWidth
                  startIcon={isConnected ? <CheckCircleIcon /> : undefined}
                  color={isConnected ? "success" : "primary"}
                >
                  {isConnected ? `Connected to ${selectedSubPlatform}` : `Connect to ${selectedSubPlatform}`}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={!isConnected || !selectedChannel}
                  onClick={handlePublish}
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
        onConnect={handleConnect}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatbotForm; 