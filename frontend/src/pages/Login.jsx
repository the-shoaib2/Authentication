// frontend/src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
import '../assets/style/ReactToastifyCustom.css';
import '../assets/style/loading.css';
import '../assets/style/animations.css';
import '../assets/style/Login.css';
import LoadingOverlay from '../components/LoadingOverlay';
import { refreshToken } from '../utils/RefreshHandler';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFadeIn(false);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setFadeOut(false);

        setTimeout(async () => {
            setFadeOut(true);
            setTimeout(async () => {
                try {
                    const response = await fetch("http://localhost:8080/auth/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ emailOrUsername, password }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        localStorage.setItem('token', result.accessToken);
                        localStorage.setItem('refreshToken', result.refreshToken);
                        localStorage.setItem('loggedInUser', JSON.stringify(result));
                        handleSuccess('Login successful!');
                        await refreshToken(); // Refresh the token immediately after login
                        setTimeout(() => navigate('/home'), 500);
                    } else {
                        handleError(result.message || 'Incorrect email/username or password. Please try again.');
                    }
                } catch (err) {
                    handleError('Network error. Please check your connection and try again.');
                } finally {
                    setLoading(false);
                }
            }, 250);
        }, 1000);
    };

    return (
        <div className="login-page-wrapper">
            <div className={`login-page-container general-page-container fade-in ${fadeIn ? 'fade-in-bottom' : ''}`}>
                <img src='/images/icon/app-icon.png' alt='App Icon' className='login-page-app-icon' />
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='login-page-form-group'>
                        <input
                            type='text'
                            id='emailOrUsername'
                            placeholder=' '
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                        <label htmlFor='emailOrUsername' className='login-page-form-label'>Email or Username</label>
                    </div>
                    <div className='login-page-form-group'>
                        <input
                            type='password'
                            id='password'
                            placeholder=' '
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor='password' className='login-page-form-label'>Password</label>
                    </div>
                    <button type='submit' className='login-page-submit-button'>Login</button>
                    <Link to="/find-user" className='login-page-navigation-link'>Forgot Password?</Link>
                    <span className='login-page-info-text'>Don't have an account? <Link to="/signup" className='login-page-navigation-link'>Signup</Link></span>
                </form>
            </div>
            <ToastContainer />
            <LoadingOverlay loading={loading} fadeOut={fadeOut} />
        </div>
    );
}

export default Login;
