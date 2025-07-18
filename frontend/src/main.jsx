// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.js';
import { BrowserRouter } from 'react-router-dom';

// Import Mantine
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MantineProvider> 
          <App />
        </MantineProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);