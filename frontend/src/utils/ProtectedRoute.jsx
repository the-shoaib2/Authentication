import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;