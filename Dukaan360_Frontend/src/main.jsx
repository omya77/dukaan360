import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { API_BASE_URL } from './config'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#FFF', padding: '32px', borderRadius: '16px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>Dukaan360 Screen Error</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>An error occurred while loading this page. Click below to clear cache and restart:</p>
            <pre style={{ background: '#FEF2F2', padding: '14px', borderRadius: '8px', color: '#DC2626', fontSize: '12px', textAlign: 'left', overflowX: 'auto', marginBottom: '20px' }}>
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/login'; }}
              style={{ padding: '12px 24px', background: '#FF5722', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,87,34,0.3)' }}
            >
              Clear Cache & Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Route all API calls dynamically to API_BASE_URL (Localhost or Live Render backend)
axios.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.startsWith('/') && !config.url.startsWith('//')) {
      config.url = `${API_BASE_URL}${config.url}`;
    } else if (config.url.includes('localhost:8000')) {
      config.url = config.url.replace('http://localhost:8000', API_BASE_URL).replace('https://localhost:8000', API_BASE_URL);
    } else if (config.url.includes('127.0.0.1:8000')) {
      config.url = config.url.replace('http://127.0.0.1:8000', API_BASE_URL).replace('https://127.0.0.1:8000', API_BASE_URL);
    }
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
