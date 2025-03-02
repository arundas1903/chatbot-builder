import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { API_CONFIG } from '../config';

interface QueryResponse {
  channel: string;
  target_audience: string;
  count: string;
  scheduled_time?: string;
}

interface Campaign {
  id: string;
  name: string;
  channel: string;
  count: string;
  timestamp: string;
  scheduled_time?: string;
}

interface CampaignConfig {
  name: string;
  // SMS specific fields
  senderId?: string;
  templateId?: string;
  messageBody?: string;
  // WhatsApp specific fields
  templateName?: string;
  mediaUrl?: string;
  businessNumber?: string;
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Campaign',
    channel: 'SMS',
    count: '1,234',
    timestamp: '2024-03-20 14:30:00',
    scheduled_time: '2024-03-25 09:00:00',
  },
  {
    id: '2',
    name: 'New Collection Launch',
    channel: 'WhatsApp',
    count: '2,567',
    timestamp: '2024-03-19 10:15:00',
  },
  // Add more mock campaigns as needed
];

// Mock data for dropdowns
const mockSenderIds = ['SHOP01', 'SHOP02', 'SHOP03'];
const mockWhatsappNumbers = ['+1234567890', '+9876543210', '+1122334455'];

const Shopify: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'configure' | 'success'>('list');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig>({
    name: '',
  });
  const [redirectTimer, setRedirectTimer] = useState<number>(3);
  
  useEffect(() => {
    let timer: number;
    if (view === 'success' && redirectTimer > 0) {
      timer = window.setTimeout(() => {
        setRedirectTimer(prev => prev - 1);
      }, 1000);
    } else if (view === 'success' && redirectTimer === 0) {
      setView('list');
      setRedirectTimer(3);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [view, redirectTimer]);

  // Filter campaigns based on search term and channel filter
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a query');
      console.log(error);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(success);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/shopify_query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process query');
      }

      if (!data.channel || !data.target_audience || !data.count) {
        throw new Error('Invalid response format from server');
      }

      // Add case-insensitive channel validation
      const supportedChannels = ['SMS', 'WHATSAPP'];
      if (!supportedChannels.includes(data.channel.toUpperCase())) {
        setError(`Channel "${data.channel}" is not supported. Only SMS and WhatsApp campaigns are supported at this time.`);
        return;
      }

      setQueryResponse(data);
      setSuccess(true);
    } catch (err) {
      console.error('Error processing query:', err);
      setError(
        'Something went wrong while processing your query. Please try again or contact support if the issue persists.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRunCampaign = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setView('success');
      setQueryResponse(null);
      setPrompt('');
      setSuccess(false);
    } catch (err) {
      console.error('Error running campaign:', err);
      setError(
        'Something went wrong while starting the campaign. Please try again or contact support if the issue persists.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewCampaign = () => {
    setQueryResponse(null);
    setPrompt('');
    setSuccess(false);
    setError(null);
    setView('create');
  };

  const handleConfigChange = (field: keyof CampaignConfig) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setCampaignConfig({
      ...campaignConfig,
      [field]: event.target.value,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your server
      // For now, we'll just store the file name
      setCampaignConfig({
        ...campaignConfig,
        mediaUrl: file.name,
      });
    }
  };

  const isFormValid = () => {
    if (!campaignConfig.name) return false;
    
    const isWhatsApp = queryResponse?.channel.toUpperCase() === 'WHATSAPP';
    
    if (isWhatsApp) {
      return !!(
        campaignConfig.businessNumber &&
        campaignConfig.templateName
      );
    } else {
      // SMS validation
      return !!(
        campaignConfig.senderId &&
        campaignConfig.messageBody
      );
    }
  };

  const renderChannelConfig = () => {
    if (!queryResponse) return null;

    const isWhatsApp = queryResponse.channel.toUpperCase() === 'WHATSAPP';

    return (
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Configure Campaign
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setView('create')}
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Campaign Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Campaign Name"
                    value={campaignConfig.name}
                    onChange={handleConfigChange('name')}
                    required
                    helperText="Campaign name is required"
                  />
                </Grid>
                {isWhatsApp ? (
                  <>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>WhatsApp Business Number</InputLabel>
                        <Select
                          value={campaignConfig.businessNumber || ''}
                          onChange={handleConfigChange('businessNumber')}
                          label="WhatsApp Business Number"
                        >
                          {mockWhatsappNumbers.map((number) => (
                            <MenuItem key={number} value={number}>
                              {number}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={campaignConfig.templateName || ''}
                        onChange={handleConfigChange('templateName')}
                        required
                        helperText="Template name is required"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                      >
                        Upload Media (Optional)
                        <input
                          type="file"
                          hidden
                          onChange={handleFileUpload}
                          accept="image/*,video/*"
                        />
                      </Button>
                      {campaignConfig.mediaUrl && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Selected file: {campaignConfig.mediaUrl}
                        </Typography>
                      )}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Sender ID</InputLabel>
                        <Select
                          value={campaignConfig.senderId || ''}
                          onChange={handleConfigChange('senderId')}
                          label="Sender ID"
                        >
                          {mockSenderIds.map((id) => (
                            <MenuItem key={id} value={id}>
                              {id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Template ID (Optional)"
                        value={campaignConfig.templateId || ''}
                        onChange={handleConfigChange('templateId')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Message Body"
                        value={campaignConfig.messageBody || ''}
                        onChange={handleConfigChange('messageBody')}
                        required
                        helperText="Message body is required"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setOpenConfirmDialog(true)}
          disabled={loading || !isFormValid()}
          fullWidth
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Campaign'}
        </Button>

        <Dialog
          open={openConfirmDialog}
          onClose={() => !loading && setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirm Campaign</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to publish this campaign? This will send messages to {queryResponse.count} customers.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Campaign Details:</Typography>
              <Typography>• Channel: {queryResponse.channel}</Typography>
              <Typography>• Target Audience: {queryResponse.target_audience}</Typography>
              <Typography>• Campaign Name: {campaignConfig.name}</Typography>
              {isWhatsApp ? (
                <>
                  <Typography>• Business Number: {campaignConfig.businessNumber}</Typography>
                  <Typography>• Template Name: {campaignConfig.templateName}</Typography>
                  {campaignConfig.mediaUrl && (
                    <Typography>• Media: {campaignConfig.mediaUrl}</Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography>• Sender ID: {campaignConfig.senderId}</Typography>
                  {campaignConfig.templateId && (
                    <Typography>• Template ID: {campaignConfig.templateId}</Typography>
                  )}
                  <Typography>• Message Length: {campaignConfig.messageBody?.length || 0} characters</Typography>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenConfirmDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRunCampaign}
              variant="contained" 
              color="success"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Publishing...' : 'Confirm & Publish'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // Modify the existing campaign creation view
  const renderCampaignCreation = () => (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          New Campaign
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setView('list')}
        >
          Back to List
        </Button>
      </Box>
      
      {!queryResponse ? (
        <>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Always start your query with 'Run a campaign' and specify channel as SMS or WhatsApp (e.g., 'Run a campaign via SMS to send discount codes to customers who haven't ordered in 3 months', 'Run a campaign via WhatsApp to promote new summer collection')"
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
          
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ minWidth: 120, mb: 4 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: (theme) => theme.palette.primary.light,
                  color: (theme) => theme.palette.primary.contrastText,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Channel
                </Typography>
                <Typography variant="h5">
                  {queryResponse.channel}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: (theme) => theme.palette.secondary.light,
                  color: (theme) => theme.palette.secondary.contrastText,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Target Audience
                </Typography>
                <Typography variant="h5">
                  {queryResponse.target_audience}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: (theme) => theme.palette.success.light,
                  color: (theme) => theme.palette.success.contrastText,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Count of Customers in Campaign
                </Typography>
                <Typography variant="h5">
                  {queryResponse.count}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: (theme) => theme.palette.info.light,
                  color: (theme) => theme.palette.info.contrastText,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Scheduled Time
                </Typography>
                <Typography variant="h5">
                  {queryResponse.scheduled_time || 'Now'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleNewCampaign}
              disabled={loading}
              sx={{ flex: 1 }}
            >
              New Query
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setView('configure')}
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );

  const renderSuccessPage = () => (
    <Box 
      sx={{ 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <CheckCircleIcon 
        sx={{ 
          fontSize: 100,
          color: 'success.main',
          mb: 3
        }} 
      />
      <Typography variant="h4" gutterBottom>
        Campaign Published Successfully!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Redirecting to campaign list in {redirectTimer} seconds...
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setView('list');
          setRedirectTimer(3);
        }}
      >
        Go to Campaign List
      </Button>
    </Box>
  );

  if (view === 'list') {
    return (
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Campaign List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewCampaign}
          >
            New Campaign
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Channel</InputLabel>
            <Select
              value={channelFilter}
              label="Channel"
              onChange={(e) => setChannelFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Channels</MenuItem>
              <MenuItem value="SMS">SMS</MenuItem>
              <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            </Select>
          </FormControl>
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
                <TableCell>Campaign Name</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell>Scheduled Time</TableCell>
                <TableCell>Created Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.channel}</TableCell>
                  <TableCell align="right">{campaign.count}</TableCell>
                  <TableCell>{campaign.scheduled_time || 'Now'}</TableCell>
                  <TableCell>{campaign.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (view === 'configure') {
    return renderChannelConfig();
  }

  if (view === 'success') {
    return renderSuccessPage();
  }

  return renderCampaignCreation();
};

export default Shopify; 