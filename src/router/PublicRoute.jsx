import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PublicRoute({ component }) {
  const isAuthenticated = useSelector((state) => state.toast?.isAuthenticated);
  const user = useSelector((state) => state.toast?.userProfile);

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/admin/products" replace />;
  }

  return component;
}
