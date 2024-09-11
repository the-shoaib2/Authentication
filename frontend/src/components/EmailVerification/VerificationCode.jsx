// frontend/src/components/ForgotPassword/SentOtpForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../../utils/ReactToastify';
import '../asstes/style/ReactToastifyCustom.css';
import '../asstes/style/VerificationStyle/SentOtpForgotPassword.css';
import OtpInput from '../../Extension/OtpInput';

function SentOtpForgotPassword() {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedCodeSentStatus = localStorage.getItem('codeSentStatus');
        const storedTimerStart = localStorage.getItem('timerStart');

        if (storedCodeSentStatus && storedTimerStart) {
            const timeElapsed = Math.floor((Date.now() - parseInt(storedTimerStart, 10)) / 1000);
            const remainingTime = Math.max(60 - timeElapsed, 0);

            setHasCodeBeenSent(true);
            setTimer(remainingTime);

            if (remainingTime > 0) {
                startCountdown(remainingTime);
            } else {
                setIsResendEnabled(true);
            }
        }

        return () => clearLocalStorage();
    }, []);

    const startCountdown = (duration) => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsResendEnabled(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        try {
            setHasCodeBeenSent(true);
            setIsResendEnabled(false);
            localStorage.setItem('codeSentStatus', 'true');
            localStorage.setItem('timerStart', Date.now().toString());

            setTimer(60);
            startCountdown(60);

            const response = await fetch('http://localhost:8080/verification/verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: state.email }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Failed to send OTP. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsResendEnabled(false);
            setTimer(60);
            localStorage.setItem('timerStart', Date.now().toString());
            startCountdown(60);

            const response = await fetch('http://localhost:8080/verification/verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: state.email }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Failed to resend OTP. Please try again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/verification/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: state.email, otp }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                clearLocalStorage();
                navigate('/forgot-password/reset-password', { state: { email: state.email } });
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('codeSentStatus');
        localStorage.removeItem('timerStart');
    };

    return (
<div className="otp-wrapper">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5E5CE6" className="bi bi-stars login-page-app-icon animate-stars" viewBox="0 0 16 16">
                        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
            </div>
            <h1 className="otp-title">Verification code</h1>
            <div className="otp-timer">
                {hasCodeBeenSent ? (
                    <p>We've sent a verification code to your registered email address.</p>
                ) : (
                    <p>Click the button to send the verification code to your email.</p>
                )}
                <div className="timer">
                    <p>Time Remaining: {timer} s</p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="otp-buttons">
                    {!hasCodeBeenSent ? (
                        <button
                            type="button"
                            className="otp-btn send"
                            onClick={handleSendOtp}
                        >
                            Send Code
                        </button>
                    ) : timer === 0 && isResendEnabled ? (
                        <button
                            type="button"
                            className="otp-btn resend"
                            onClick={handleResendOtp}
                        >
                            Resend Code
                        </button>
                    ) : hasCodeBeenSent && timer > 0 ? (
                        <>
                            <OtpInput
                                length={6}
                                onOtpSubmit={(otp) => setOtp(otp)}
                                onOtpComplete={(complete) => setIsComplete(complete)}
                            />
                            <button
                                type="submit"
                                className={`otp-btn verify ${isComplete ? 'active' : ''}`}
                                disabled={!isComplete}
                            >
                                Verify Code
                            </button>
                        </>
                    ) : null}
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SentOtpForgotPassword;
