import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'  // ← Make sure this line exists
import './App.css'
import { AuthProvider } from './context/AuthContext';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Render the app wrapped in QueryClientProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
