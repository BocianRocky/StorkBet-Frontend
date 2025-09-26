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
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;


