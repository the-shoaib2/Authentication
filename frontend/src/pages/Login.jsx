// frontend/src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
import '../assets/style/ReactToastifyCustom.css';
import '../assets/style/loading.css';
import '../assets/style/animations.css';
import '../assets/style/Login.css';
import LoadingOverlay from '../components/LoadingOverlay';
import { refreshToken, checkAuthentication } from '../utils/RefreshHandler';
import('../pages/UserProfile').then(() => console.log('UserProfile preloaded'));

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingAuth = async () => {
            const isAuth = await checkAuthentication();
            if (isAuth) {
                navigate('/home', { replace: true });
            }
        };
        checkExistingAuth();
    }, [navigate]);

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
        <>
            <div className="login-page-wrapper login-fade-in">
                <div className={`login-page-container general-page-container ${fadeIn ? 'fade-in-bottom' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5E5CE6" className="bi bi-stars login-page-app-icon animate-stars" viewBox="0 0 16 16">
                        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                    </svg>
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
                <LoadingOverlay loading={loading} fadeOut={fadeOut} />
            </div>
            <ToastContainer />
        </>
    );
}

export default Login;
