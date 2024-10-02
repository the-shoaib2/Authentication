import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshToken } from './ApiService';

const RefreshHandler = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const result = await refreshToken();
                if (result.success) {
                    localStorage.setItem('token', result.accessToken);
                    localStorage.setItem('refreshToken', result.refreshToken);
                    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                        navigate('/home', { replace: false });
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                setIsAuthenticated(false);
            }
        }, 1000 * 60 * 15); // Refresh every 15 minutes

        return () => clearInterval(interval);
    }, [setIsAuthenticated, location, navigate]);

    return null;
};

export default RefreshHandler;


