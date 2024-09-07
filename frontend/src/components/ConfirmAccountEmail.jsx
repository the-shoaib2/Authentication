import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ConfirmAccountPopup({ isActive, email, token, show, onClose, accountExpiryDate, onLogout }) {
    const [showPopup, setShowPopup] = useState(false);
    const [remainingDays, setRemainingDays] = useState(0);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isActive && show) {
            setShowPopup(true);
        }
    }, [isActive, show]);

    useEffect(() => {
        if (accountExpiryDate) {
            const checkAccountStatus = async () => {
                try {
                    const response = await fetch('http://localhost:8080/Users/check-account-status', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data.expired) {
                        setIsExpired(true);
                        onLogout();
                        navigate('/login');
                    } else {
                        setRemainingDays(data.remainingDays);
                        setRemainingMinutes(data.remainingMinutes);
                        setIsExpired(false);
                    }
                } catch (error) {
                    console.error('Error checking account status:', error);
                }
            };
            checkAccountStatus();

            // Set up an interval to check the status every minute
            const intervalId = setInterval(checkAccountStatus, 60000);

            // Clean up the interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [accountExpiryDate, token, onLogout, navigate]);

    if (isActive) return null;

    const handleClose = () => {
        setShowPopup(false);
        if (onClose) onClose();
    };

    const getMessage = () => {
        if (isExpired) {
            return "Your account has expired and will be deleted soon. Please contact support if you wish to reactivate it.";
        } else if (remainingMinutes <= 5) {
            return `Your account will expire in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}. Please confirm your email immediately to avoid account deletion.`;
        } else if (remainingDays > 0) {
            return `Confirm your email within ${remainingDays} day${remainingDays !== 1 ? 's' : ''}. Expires: ${new Date(accountExpiryDate).toLocaleDateString()}. Account will be auto-deleted after expiration. Note: Account deletion unavailable after confirmation.`;
        }
    };

    return (
        <>
            <div className={`confirm-account-bar ${isExpired || remainingMinutes <= 5 ? 'warning' : ''}`}>
                <span className="confirm-account-message">
                    {getMessage()}
                </span>
                {!isExpired && (
                    <Link 
                        to="/verify-email" 
                        className="confirm-email-button"
                        state={{ 
                            token: token,
                            email: email
                        }}
                    >
                        Confirm Email
                    </Link>
                )}
            </div>
            {showPopup && !isExpired && (
                <div className="popup-overlay">
                    <div className="inactive-account-message-container">
                        <button className="close-popup-button" onClick={handleClose}>
                            {/* &times; */}
                        </button>
                        <h1>Your account is not confirmed yet.</h1>
                        <p>{getMessage()}</p>
                        <Link 
                            to="/verify-email" 
                            className="confirm-account-link" 
                            state={{ 
                                token: token,
                                email: email
                            }}
                        >
                            <button className="confirm-account-button">
                                Activate Account
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConfirmAccountPopup;
