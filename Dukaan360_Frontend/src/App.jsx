import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Khata from './pages/Khata';
import Inventory from './pages/Inventory';
import BillHistory from './pages/BillHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Renew from './pages/Renew';

const OwnerRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.store_status === 'Expired') return <Navigate to={`/renew?username=${user?.username || ''}`} replace />;
  if (user?.role === 'Cashier') return <Navigate to="/pos" replace />;
  return children;
};

const PrivateRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  
  if (loading) return null; // Or a full screen loader
  if (!token) return <Navigate to="/login" replace />;
  
  // If a SuperAdmin tries to go to POS/Dashboard, redirect them to admin
  if (user?.role === 'SuperAdmin') return <Navigate to="/admin" replace />;
  
  // If store is expired, redirect to renew
  if (user?.store_status === 'Expired') return <Navigate to={`/renew?username=${user?.username || ''}`} replace />;
  // If store is pending, maybe they shouldn't even be logged in, but just in case:
  if (user?.store_status === 'Pending') return <Navigate to="/login" replace />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  
  if (loading) return null;
  if (!token || user?.role !== 'SuperAdmin') return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/renew" element={<Renew />} />
            
            {/* Super Admin Route */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

            {/* Tenant Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<OwnerRoute><Dashboard /></OwnerRoute>} />
            <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
            <Route path="/khata" element={<OwnerRoute><Khata /></OwnerRoute>} />
            <Route path="/inventory" element={<OwnerRoute><Inventory /></OwnerRoute>} />
            <Route path="/history" element={<PrivateRoute><BillHistory /></PrivateRoute>} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
