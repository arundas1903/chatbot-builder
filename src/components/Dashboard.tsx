import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  LinearProgress,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ChatBubble as ChatIcon,
  Person as PersonIcon,
  Timer as TimerIcon,
  ShoppingCart as CartIcon,
  Support as SupportIcon,
  Psychology as BrainIcon,
  Language as ChannelIcon,
  TrendingUp as TrendingUpIcon,
  SentimentSatisfiedAlt as SentimentIcon,
  Speed as SpeedIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock chatbots data
const mockChatbots = [
  { id: 1, name: 'Sales Assistant' },
  { id: 2, name: 'Customer Support Bot' },
  { id: 3, name: 'Product Recommender' },
  { id: 4, name: 'FAQ Bot' },
];

// Mock data - replace with actual data later
const mockData = {
  engagement: {
    totalConversations: 15234,
    uniqueUsers: 8756,
    dropoffRate: 23.5,
    avgSessionDuration: '8m 45s',
    returnUsers: 3421,
  },
  sales: {
    totalOrders: 1234,
    conversionRate: 12.5,
    averageOrderValue: '$145.50',
    cartRecoveryRate: 35.8,
    discountUsage: 456,
  },
  support: {
    queriesResolved: 12567,
    escalationRate: 15.3,
    firstResponseTime: '30s',
    avgHandlingTime: '4m 20s',
    csatScore: 4.5,
  },
  nlp: {
    intentAccuracy: 92.5,
    fallbackRate: 7.5,
    positiveSentiment: 65.2,
    neutralSentiment: 28.3,
    negativeSentiment: 6.5,
  },
  channels: {
    whatsapp: 45.2,
    web: 32.5,
    voice: 15.8,
  },
};

// Mock data for charts
const conversationData = [
  { name: 'Mon', conversations: 1200, users: 800 },
  { name: 'Tue', conversations: 1500, users: 1000 },
  { name: 'Wed', conversations: 1800, users: 1200 },
  { name: 'Thu', conversations: 1600, users: 900 },
  { name: 'Fri', conversations: 2000, users: 1400 },
  { name: 'Sat', conversations: 1400, users: 800 },
  { name: 'Sun', conversations: 1100, users: 700 },
];

const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const channelDistribution = [
  { name: 'WhatsApp', value: 45.2 },
  { name: 'Web Chat', value: 32.5 },
  { name: 'Facebook', value: 15.8 },
  { name: 'Telegram', value: 6.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Additional mock data for new charts
const hourlyData = [
  { hour: '00:00', conversations: 120, responseTime: 25 },
  { hour: '04:00', conversations: 80, responseTime: 20 },
  { hour: '08:00', conversations: 200, responseTime: 30 },
  { hour: '12:00', conversations: 350, responseTime: 40 },
  { hour: '16:00', conversations: 280, responseTime: 35 },
  { hour: '20:00', conversations: 150, responseTime: 28 },
];

const sentimentTrend = [
  { date: 'Mon', positive: 65, neutral: 25, negative: 10 },
  { date: 'Tue', positive: 60, neutral: 30, negative: 10 },
  { date: 'Wed', positive: 70, neutral: 20, negative: 10 },
  { date: 'Thu', positive: 55, neutral: 35, negative: 10 },
  { date: 'Fri', positive: 75, neutral: 15, negative: 10 },
  { date: 'Sat', positive: 65, neutral: 25, negative: 10 },
  { date: 'Sun', positive: 60, neutral: 30, negative: 10 },
];

type TimeRange = '24h' | '7d' | '30d' | '90d';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  progress?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, subtitle, progress }) => {
  const theme = useTheme();
  
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        {icon && (
          <Box
            sx={{
              mr: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" sx={{ my: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {progress !== undefined && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1, height: 6, borderRadius: 1 }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedChatbot, setSelectedChatbot] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRange,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
      // Here you would fetch new data based on the time range
    }
  };

  const handleFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }
    console.log('Filtering with:', { selectedChatbot, startDate, endDate });
    // Here you would fetch new data based on the filter criteria
  };

  const handleReset = () => {
    setSelectedChatbot('');
    setStartDate('');
    setEndDate('');
    setTimeRange('7d');
    // Here you would reset the data to default
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* Header with Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Paper sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Chatbot</InputLabel>
                <Select
                  value={selectedChatbot}
                  label="Select Chatbot"
                  onChange={(e) => setSelectedChatbot(e.target.value as number)}
                >
                  <MenuItem value="">
                    <em>All Chatbots</em>
                  </MenuItem>
                  {mockChatbots.map((bot) => (
                    <MenuItem key={bot.id} value={bot.id}>
                      {bot.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={handleFilter}
                  fullWidth
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  onClick={handleReset}
                  fullWidth
                >
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Quick Time Range Selector */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
          size="small"
        >
          <ToggleButton value="24h" aria-label="24 hours">
            24H
          </ToggleButton>
          <ToggleButton value="7d" aria-label="7 days">
            7D
          </ToggleButton>
          <ToggleButton value="30d" aria-label="30 days">
            30D
          </ToggleButton>
          <ToggleButton value="90d" aria-label="90 days">
            90D
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Top Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Conversations"
            value={mockData.engagement.totalConversations.toLocaleString()}
            icon={<ChatIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={mockData.sales.totalOrders.toLocaleString()}
            icon={<CartIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Queries Resolved"
            value={mockData.support.queriesResolved.toLocaleString()}
            icon={<SupportIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CSAT Score"
            value={mockData.support.csatScore}
            icon={<SentimentIcon />}
            progress={mockData.support.csatScore * 20}
          />
        </Grid>
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3}>
        {/* Conversation Trends */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conversation Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={conversationData}>
                <defs>
                  <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorConversations)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={theme.palette.secondary.main}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Channel Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Channel Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Hourly Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hourly Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="conversations"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sentiment Analysis Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#4caf50"
                  fill="#4caf50"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#ff9800"
                  fill="#ff9800"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#f44336"
                  fill="#f44336"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Additional Metrics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Drop-off Rate"
            value={`${mockData.engagement.dropoffRate}%`}
            icon={<TrendingUpIcon />}
            progress={mockData.engagement.dropoffRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Average Session Duration"
            value={mockData.engagement.avgSessionDuration}
            icon={<TimerIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Intent Recognition Accuracy"
            value={`${mockData.nlp.intentAccuracy}%`}
            icon={<BrainIcon />}
            progress={mockData.nlp.intentAccuracy}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 