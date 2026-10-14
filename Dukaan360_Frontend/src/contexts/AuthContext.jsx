import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {


  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('saas_token') || localStorage.getItem('saas_token') || null;
  });
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
  const [loading, setLoading] = useState(true);
  // Dynamically update document title based on store name
  useEffect(() => {
    if (user?.store_name) {
      document.title = user.store_name;
    } else {
      document.title = 'Dukaan360 POS';
    }
  }, [user]);

  // Configure global axios interceptor for token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const activeToken = token || sessionStorage.getItem('saas_token') || localStorage.getItem('saas_token');
      if (activeToken) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        if (error.response && error.response.status === 403 && error.response.data?.detail === "SUBSCRIPTION_EXPIRED") {
          const currentUsername = user?.username || '';
          logout();
          window.location.href = `/renew?username=${encodeURIComponent(currentUsername)}`;
        }
        return Promise.reject(error);
      }
    );

    setLoading(false);

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
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
      {!loading && children}
    </AuthContext.Provider>
  );
};
