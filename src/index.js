import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BusinessDashboard from './cane';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BusinessDashboard />
    </div>
  </React.StrictMode>
);