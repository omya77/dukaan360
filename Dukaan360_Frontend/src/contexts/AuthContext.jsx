import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api, { getAuthToken, getAuthHeaders } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => {
    const sessionSaved = sessionStorage.getItem('saas_user');
    if (sessionSaved) {
      try { return JSON.parse(sessionSaved); } catch (e) {}
    }
    const saved = localStorage.getItem('saas_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Dynamically update document title based on store name
  useEffect(() => {
    if (user?.store_name) {
      document.title = user.store_name;
    } else {
      document.title = 'Dukaan360 POS';
    }
  }, [user]);

  // Keep axios default header in sync with state
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    if (userData?.role === 'SuperAdmin') {
      // SuperAdmin is strictly isolated to current browser tab
      sessionStorage.setItem('saas_token', accessToken);
      sessionStorage.setItem('saas_user', JSON.stringify(userData));
      localStorage.removeItem('saas_token');
      localStorage.removeItem('saas_user');
    } else {
      localStorage.setItem('saas_token', accessToken);
      localStorage.setItem('saas_user', JSON.stringify(userData));
      sessionStorage.removeItem('saas_token');
      sessionStorage.removeItem('saas_user');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('saas_token');
    sessionStorage.removeItem('saas_user');
    localStorage.removeItem('saas_token');
    localStorage.removeItem('saas_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
