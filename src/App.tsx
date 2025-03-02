import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatbotForm from './components/ChatbotForm';
import ChatbotList from './components/ChatbotList';
import Shopify from './components/Shopify';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chatbot/create" element={<ChatbotForm />} />
          <Route path="/chatbot" element={<ChatbotList />} />
          <Route path="/shopify" element={<Shopify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 