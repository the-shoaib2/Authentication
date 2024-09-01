// RefrshHandler.js 
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all toasts when the location changes
        // toast.dismiss();
        
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);
            if (location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/home', { replace: false });
            }
        }
    }, [location, navigate, setIsAuthenticated]);

    return null;
}

export default RefrshHandler;
