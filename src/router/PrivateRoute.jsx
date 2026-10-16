import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({
  component,
  allowedRoles,
  requiredPermission,
}) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.toast?.isAuthenticated);
  const user = useSelector((state) => state.toast?.userProfile);

  // If not logged in, redirect to admin login preserving target location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role restriction if provided
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission restriction if provided (Admin always bypasses permissions)
  if (requiredPermission && user?.role !== 'admin') {
    const userPermissions = user?.permissions || [];
    if (!userPermissions.includes(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return component;
}
