import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  onConnect: (credentials: { apiKey: string; apiSecret: string }) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, platform, onConnect }) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [errors, setErrors] = useState({
    apiKey: false,
    apiSecret: false,
  });

  const handleSubmit = () => {
    // Basic validation
    const newErrors = {
      apiKey: !apiKey.trim(),
      apiSecret: !apiSecret.trim(),
    };

    setErrors(newErrors);

    if (!newErrors.apiKey && !newErrors.apiSecret) {
      onConnect({ apiKey, apiSecret });
      // Reset form
      setApiKey('');
      setApiSecret('');
      setErrors({ apiKey: false, apiSecret: false });
    }
  };

  const handleClose = () => {
    // Reset form on close
    setApiKey('');
    setApiSecret('');
    setErrors({ apiKey: false, apiSecret: false });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Connect to {platform}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please enter your {platform} credentials to establish the connection.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="API Key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setErrors({ ...errors, apiKey: false });
              }}
              error={errors.apiKey}
              helperText={errors.apiKey ? 'API Key is required' : ''}
              fullWidth
              size="small"
              placeholder="Enter your API key"
            />
            <TextField
              label="API Secret"
              type="password"
              value={apiSecret}
              onChange={(e) => {
                setApiSecret(e.target.value);
                setErrors({ ...errors, apiSecret: false });
              }}
              error={errors.apiSecret}
              helperText={errors.apiSecret ? 'API Secret is required' : ''}
              fullWidth
              size="small"
              placeholder="Enter your API secret"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectModal; 