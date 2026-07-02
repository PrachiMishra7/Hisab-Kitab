import React from 'react';
import { createRoot } from 'react-dom/client';
// Remove unused AppShell import: import AppShell from './AppShell.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Only render App, which contains the AppShell internally */}
    <App /> 
  </React.StrictMode>
);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}