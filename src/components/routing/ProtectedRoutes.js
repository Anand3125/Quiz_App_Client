import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Role-based Route Component
export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirects authenticated users)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Teacher Only Route
export const TeacherRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['teacher', 'admin']}>
      {children}
    </RoleBasedRoute>
  );
};

// Student Only Route
export const StudentRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['student']}>
      {children}
    </RoleBasedRoute>
  );
};

// Admin Only Route
export const AdminRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      {children}
    </RoleBasedRoute>
  );
};
