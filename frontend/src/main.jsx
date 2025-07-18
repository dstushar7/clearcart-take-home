import React from 'react';
import ReactDOM from 'react-dom/client';
import client from './apolloClient.js';
import App from './App.jsx';
// import './index.css';

import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MantineProvider withGlobalStyles withNormalizeCSS> 
          <App />
        </MantineProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);