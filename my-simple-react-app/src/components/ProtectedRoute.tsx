import React from 'react';
import { Navigate } from 'react-router-dom';

// A component to protect routes
import { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // If the user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Otherwise, render the children (protected component)
    return children;
}

export default ProtectedRoute;
