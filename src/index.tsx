import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './application/components/App';
import './styles/main.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
