import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRoleId?: number; // 1 = admin, 2 = player
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoleId }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoleId && user?.roleId && user.roleId !== requiredRoleId) {
    // If user is trying to access admin routes but is not admin, redirect to home
    if (requiredRoleId === 1) {
      return <Navigate to="/" replace />;
    }
    // If user is trying to access player routes but is admin, redirect to admin dashboard
    if (requiredRoleId === 2 && user.roleId === 1) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;


