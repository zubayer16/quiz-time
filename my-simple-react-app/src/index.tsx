import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './context/AuthContext';
import client from './config/apolloClient';

// Get the root element and add type assertion
const container = document.getElementById('root');

// Type check for null container
if (!container) {
  throw new Error('Failed to find the root element');
}

// Create root with proper typing
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
