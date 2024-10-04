import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthentication } from '../utils/ApiService';
import LoadingOverlay from '../components/LoadingOverlay';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await checkAuthentication();
            setIsAuthenticated(isAuth);
            setLoading(false);
        };
        verifyAuth();
    }, []);

    if (loading) {
        return <LoadingOverlay loading={loading} fadeOut={false} />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;