import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../../utils/ReactToastify';
import '../../utils/ReactToastifyCustom.css';
import '../../utils/style/ResetPassword.css';
import PasswordStrengthMeter from '../../Services/PasswordStrengthMeter'; // Import the PasswordStrengthMeter component

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [matchError, setMatchError] = useState(false); // New state for match error
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let hasError = false;

        // Validate inputs
        if (!password) {
            setPasswordError(true);
            hasError = true;
        } else {
            setPasswordError(false);
        }

        if (!confirmPassword) {
            setConfirmPasswordError(true);
            hasError = true;
        } else {
            setConfirmPasswordError(false);
        }

        if (password !== confirmPassword) {
            setMatchError(true); // Set match error
            handleError('Passwords do not match');
            hasError = true;
        } else {
            setMatchError(false); // Clear match error if passwords match
        }

        if (hasError) return;

        try {
            const response = await fetch('http://localhost:8080/verification/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: state.email, newPassword: password }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                navigate('/login');
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div className="reset-password-container">
            <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
            <button
                className="back-button-forgotpaass icon-button"
                onClick={() => navigate('/sent-otp-forgot-password')} // Navigate to SentOtpForgotPassword page
            >
                <img src="/back-icon.png" alt="Back" />
            </button>
        
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className={`input-wrapper ${matchError ? 'error' : ''}`}>
                    <div className={`form-group-reset-password ${passwordError ? 'error' : ''}`}>
                        <input
                            type='password'
                            id='new-password'
                            placeholder=''
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor='new-password' className='form-label-reset-password'>New password</label>
                    </div>
                    <div className={`form-group-reset-password ${confirmPasswordError ? 'error' : ''}`}>
                        <input
                            type='password'
                            id='confirm-password'
                            placeholder=''
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label htmlFor='confirm-password' className='form-label-reset-password'>Confirm Password</label>
                    </div>
                    <PasswordStrengthMeter password={password} /> 
                </div>
                <button type="submit">Reset Password</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ResetPassword;
