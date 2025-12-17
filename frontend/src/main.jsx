import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ExcelProvider } from './contexts/ExcelContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExcelProvider>
      <App />
    </ExcelProvider>
  </React.StrictMode>
);
