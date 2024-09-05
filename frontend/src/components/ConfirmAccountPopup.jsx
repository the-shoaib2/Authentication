import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ConfirmAccountPopup({ isActive, email, token, show, onClose, accountExpiryDate, onLogout }) {
    const [showPopup, setShowPopup] = useState(false);
    const [remainingDays, setRemainingDays] = useState(0);
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
                        onLogout();
                        navigate('/login');
                    } else {
                        setRemainingDays(data.remainingDays);
                    }
                } catch (error) {
                    console.error('Error checking account status:', error);
                }
            };
            checkAccountStatus();
        }
    }, [accountExpiryDate, token, onLogout, navigate]);

    if (isActive) return null;

    const handleClose = () => {
        setShowPopup(false);
        if (onClose) onClose();
    };

    const getMessage = () => {
        if (remainingDays > 0) {
            return `Confirm your email within ${remainingDays} day${remainingDays > 1 ? 's' : ''}. Expires: ${new Date(accountExpiryDate).toLocaleDateString()}. Account will be auto-deleted after expiration.  Note: Account deletion unavailable after confirmation.`;
        } else {
            return "Your account has expired and will be deleted soon. Please contact support if you wish to reactivate it.";
        }
    };

    return (
        <>
            <div className="confirm-account-bar">
                <span className="confirm-account-message">
                    {getMessage()}
                </span>
                {remainingDays > 0 && (
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
            {showPopup && remainingDays > 0 && (
                <div className="popup-overlay">
                    <div className="inactive-account-message-container">
                        <button className="close-popup-button" onClick={handleClose}>
                            &times;
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
