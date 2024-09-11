// frontend/src/pages/VerifyCodeConfirmAccount.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../../utils/ReactToastify';
import '../../assets/style/styleutils/ReactToastifyCustom.css';
import '../../assets/style/VerificationStyle/VerifyCodeConfirmAccount.css';
import OtpInput from '../../Extension/OtpInput';
import StarIcon from '../../components/StarIcon';

function VerifyCodeConfirmAccount() {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);
    const [isInCooldown, setIsInCooldown] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedCodeSentStatus = localStorage.getItem('confirmAccountCodeSent');
        const storedTimerStart = localStorage.getItem('confirmAccountTimerStart');

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
        setTimer(duration);
        setIsInCooldown(duration > 60);
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsResendEnabled(true);
                    setIsInCooldown(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        try {
            const response = await fetch('http://localhost:8080/verification/verification-code', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`,
                },
                body: JSON.stringify({ email: state.email }),
            });

            const result = await response.json();

            if (response.ok) {
                setHasCodeBeenSent(true);
                setIsResendEnabled(false);
                localStorage.setItem('confirmAccountCodeSent', 'true');
                localStorage.setItem('confirmAccountTimerStart', Date.now().toString());
                startCountdown(60);
                handleSuccess(result.message);
            } else if (response.status === 429) {
                startCountdown(result.cooldownPeriod);
                setIsInCooldown(true);
                handleError(result.message);
            } else if (result.isLocked) {
                setIsLocked(true);
                handleError(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Failed to send OTP. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        await handleSendOtp();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/verification/verify-code', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`,
                },
                body: JSON.stringify({ email: state.email, otp }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                clearLocalStorage();
                navigate('/home');
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('confirmAccountCodeSent');
        localStorage.removeItem('confirmAccountTimerStart');
    };

    if (isLocked) {
        return (
            <div className="otp-wrapper">
                <h1 className="otp-title">Account Locked</h1>
                <p>Your account has been temporarily locked due to too many verification attempts. Please try again after 72 hours.</p>
            </div>
        );
    }

    return (
        <div className="otp-wrapper">
            <div>
                <StarIcon width={48} height={48} fill="#5E5CE6" className="animate-stars" />
            </div>
            <h1 className="otp-title">Confirm Email</h1>
            <div className="otp-timer">
                {isInCooldown ? (
                    <p>Too many attempts. Please wait for {timer} seconds before trying again.</p>
                ) : hasCodeBeenSent ? (
                    <p>We've sent a verification code to your registered email address.</p>
                ) : (
                    <p>Click the button to send the verification code to your email.</p>
                )}
                {(hasCodeBeenSent || isInCooldown) && (
                    <div className="timer">
                        <p>Time Remaining: {timer} s</p>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="otp-buttons">
                    {!hasCodeBeenSent && !isInCooldown ? (
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

export default VerifyCodeConfirmAccount;
