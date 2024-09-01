import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../../utils/ReactToastify';
import '../../utils/ReactToastifyCustom.css';
import '../../utils/style/SentOtpForgotPassword.css';
import OtpInput from '../../Services/OtpInput'; // Updated import path

function SentOtpForgotPassword() {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const codeSentStatus = localStorage.getItem('codeSentStatus') === 'true';
        const timerStart = localStorage.getItem('timerStart');

        if (codeSentStatus && timerStart) {
            const timeElapsed = Math.floor((Date.now() - parseInt(timerStart, 10)) / 1000);
            const remainingTime = Math.max(60 - timeElapsed, 0);

            setHasCodeBeenSent(true);
            setTimer(remainingTime);

            if (remainingTime > 0) {
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
                return () => clearInterval(countdown);
            } else {
                setIsResendEnabled(true);
            }
        }

        // Cleanup function to clear local storage when leaving the page
        return () => clearLocalStorage();

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/verification/forgot-password/verify-otp', {
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

    const handleSendOtp = async () => {
        try {
            setHasCodeBeenSent(true);
            localStorage.setItem('codeSentStatus', 'true');
            localStorage.setItem('timerStart', Date.now().toString());

            setTimer(60);
            setIsResendEnabled(false);

            const response = await fetch('http://localhost:8080/verification/forgot-password/send-otp', {
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

            startCountdown();

        } catch (err) {
            handleError('Failed to send OTP. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsResendEnabled(false);
            setTimer(60);
            localStorage.setItem('timerStart', Date.now().toString());

            const response = await fetch('http://localhost:8080/verification/forgot-password/send-otp', {
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

            startCountdown();

        } catch (err) {
            handleError('Failed to resend OTP. Please try again.');
        }
    };

    const startCountdown = () => {
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

    const clearLocalStorage = () => {
        localStorage.removeItem('codeSentStatus');
        localStorage.removeItem('timerStart');
    };

    return (
        <div className="otp-wrapper">
            <div>
                <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
            </div>
            <h1 className="otp-title">Verification Code</h1>
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
                {!hasCodeBeenSent ? (
                    <button
                        type="button"
                        className="otp-btn send"
                        onClick={handleSendOtp}
                    >
                        Send Code
                    </button>
                ) : (
                    <OtpInput
                        length={6}
                        onOtpSubmit={(otp) => setOtp(otp)}
                        onOtpComplete={(complete) => setIsComplete(complete)}
                    />
                )}
                <div className="otp-buttons">
                    {timer === 0 && isResendEnabled ? (
                        <>
                            <div className="otp-message">
                                <p>Didn't receive the code?</p>
                            </div>
                            <button
                                type="button"
                                className="otp-btn resend"
                                onClick={handleResendOtp}
                            >
                                Resend Code
                            </button>
                        </>
                    ) : hasCodeBeenSent ? (
                        <>
                            <div className="otp-message">
                                <br />
                            </div>
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
