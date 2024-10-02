// frontend/src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
import '../assets/style/styleutils/ReactToastifyCustom.css';
import '../assets/style/styleutils/loading.css';
import '../assets/style/styleutils/animations.css';
import '../assets/style/PagesStyle/Login.css';
import LoadingOverlay from '../components/LoadingOverlay';
import { checkAuthentication, loginUser } from '../utils/ApiService'; 
import StarIcon from '../components/StarIcon';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setFadeOut(false);

        try {
            const result = await loginUser(emailOrUsername, password);
            if (result.success) {
                handleSuccess('Login successful!');
                navigate('/home', { replace: true });
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (event) => {
        event.preventDefault();
        navigate('/find-user'); 
    };

    return (
        <>
            <div className={`login-page-wrapper fade-in`}>  
                <div className={`login-page-container general-page-container`}>  
                    <StarIcon className="login-page-app-icon animate-stars" />
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
                        <Link to="#" onClick={handleForgotPassword} className='login-page-navigation-link'>Forgot Password?</Link> 
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