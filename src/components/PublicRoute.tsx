import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Jeśli admin jest zalogowany i próbuje wejść na publiczne trasy, przekieruj do panelu admina
  if (isAuthenticated && user?.roleId === 1) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default PublicRoute;

