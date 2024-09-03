import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/ReactToastify';
import { ToastContainer } from 'react-toastify';
import '../assets/style/ReactToastifyCustom.css';
import '../assets/style/home.css';
import '../assets/style/loading.css';
import LoadingOverlay from '../components/LoadingOverlay';
import UserProfile from './UserProfile';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const fetchLoggedInUser = useCallback(async () => {
        setLoading(true);
        try {
            const url = "http://localhost:8080/Users/me";
            const headers = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            if (response.ok) {
                setLoggedInUser(result);
            } else {
                handleError(result.message || 'Failed to fetch user data. Please try again.');
                navigate('/login');
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchLoggedInUser();

        const timeoutId = setTimeout(() => {
            setFadeIn(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [fetchLoggedInUser]); // Use fetchLoggedInUser as a dependency

    if (loading) {
        return <LoadingOverlay loading={loading} fadeOut={false} />;
    }

    return (
        <div className={`home-container ${fadeIn ? 'fade-in' : ''}`}>
            <div className="user-icon-image" onClick={() => setShowProfile(!showProfile)}>
                <img src='/images/avater/avater.png' className='profilePicture' alt='Profile' />
            </div>
            <h1 className="user-name">{loggedInUser.name}</h1>
            {showProfile && (
                <div className="profile-side-panel">
                    <UserProfile onClose={() => setShowProfile(false)} />
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Home;

