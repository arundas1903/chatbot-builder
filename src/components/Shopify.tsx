import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
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
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
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

const Shopify: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  
  // Filter campaigns based on search term and channel filter
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

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
      setTimeout(() => {
        setView('list');
        setQueryResponse(null);
        setPrompt('');
        setSuccess(false);
      }, 2000);
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
              <TableRow>
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

  return (
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
              color="success"
              size="large"
              onClick={() => setOpenConfirmDialog(true)}
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Campaign'}
            </Button>
          </Stack>
        </Box>
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={() => !loading && setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Campaign</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to run this campaign? This action will send messages to all matching customers.
          </Typography>
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
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={error !== null} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {queryResponse ? 'Campaign executed successfully! Redirecting to campaign list...' : 'Query submitted successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Shopify; 