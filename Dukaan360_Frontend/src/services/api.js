import axios from 'axios';
import { API_BASE_URL } from '../config';

// Helper to get active token from either storage
export const getAuthToken = () => {
  try {
    return localStorage.getItem('saas_token') || sessionStorage.getItem('saas_token') || '';
  } catch (e) {
    return '';
  }
};

// Helper to get authorization header object
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Global axios request interceptor to guarantee Authorization header and dynamic API routing
axios.interceptors.request.use(
  (config) => {
    if (config.url) {
      if (config.url.startsWith('/') && !config.url.startsWith('//')) {
        config.url = `${API_BASE_URL}${config.url}`;
      } else if (config.url.includes('localhost:8000')) {
        config.url = config.url.replace('http://localhost:8000', API_BASE_URL).replace('https://localhost:8000', API_BASE_URL);
      } else if (config.url.includes('127.0.0.1:8000')) {
        config.url = config.url.replace('http://127.0.0.1:8000', API_BASE_URL).replace('https://127.0.0.1:8000', API_BASE_URL);
      }
    }
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Pre-configured API instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (config.url) {
      if (config.url.includes('localhost:8000')) {
        config.url = config.url.replace('http://localhost:8000', API_BASE_URL).replace('https://localhost:8000', API_BASE_URL);
      } else if (config.url.includes('127.0.0.1:8000')) {
        config.url = config.url.replace('http://127.0.0.1:8000', API_BASE_URL).replace('https://127.0.0.1:8000', API_BASE_URL);
      }
    }
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
