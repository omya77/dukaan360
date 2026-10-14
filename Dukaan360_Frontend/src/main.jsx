import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { API_BASE_URL } from './config'
import './index.css'
import App from './App.jsx'

// Route all API calls dynamically to API_BASE_URL (Localhost or Live Render backend)
axios.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.startsWith('/') && !config.url.startsWith('//')) {
      config.url = `${API_BASE_URL}${config.url}`;
    } else if (config.url.includes('localhost:8000')) {
      config.url = config.url.replace('http://localhost:8000', API_BASE_URL);
    }
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
