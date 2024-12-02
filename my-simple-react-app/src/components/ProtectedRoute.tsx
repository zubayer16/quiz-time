import React from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import MainLayout from './layouts/MainLayout';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');

  // If the user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to='/' />;
  }

  // Otherwise, render the children (protected component) within MainLayout
  return <MainLayout>{children}</MainLayout>;
}

export default ProtectedRoute;
