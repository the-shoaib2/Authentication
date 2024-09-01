// Login.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
import '../utils/ReactToastifyCustom.css';
import '../utils/loading.css';
import '../utils/style/animations.css'; 

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
        <div className={`login-container container ${fadeIn ? 'fade-in' : ''}`}> 
            <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        id='emailOrUsername'
                        placeholder=''
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required
                    />
                    <label htmlFor='emailOrUsername' className='form-label'>Email or Username</label>
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        id='password'
                        placeholder=''
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor='password' className='form-label'>Password</label>
                </div>
                <button type='submit'>Login</button>
                <Link to="/find-user" className='pages-link'>Forgot Password?</Link>
                <span>Don't have an account? <Link to="/signup" className='pages-link'>Signup</Link></span>
            </form>
            <ToastContainer />
            {loading && (
                <div className={`loading-overlay ${fadeOut ? 'hidden' : ''}`}>
                    <img src='/apple-loading.gif' alt='Loading...' className='loading-spinner' />
                </div>
            )}
        </div>
    );
}

export default Login;
