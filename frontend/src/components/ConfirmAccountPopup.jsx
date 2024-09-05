import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ConfirmAccountPopup({ isActive, email, token, show, onClose, accountExpiryDate }) {
    const [showPopup, setShowPopup] = useState(false);
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        if (!isActive && !show) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 30 * 60 * 1000); // 30 minutes
            return () => clearTimeout(timer);
        }
    }, [isActive, show]);

    useEffect(() => {
        if (accountExpiryDate) {
            const now = new Date();
            const expiryDate = new Date(accountExpiryDate);
            const timeDiff = expiryDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setRemainingDays(daysDiff > 0 ? daysDiff : 0);
        }
    }, [accountExpiryDate]);

    if (isActive) return null;

    const handleClose = () => {
        setShowPopup(false);
        if (onClose) onClose();
    };

    const getMessage = () => {
        if (isActive) {
            return "Your account is confirmed. Thank you!";
        } else if (remainingDays > 0) {
            return `Please confirm your email. Your account will expire in ${remainingDays} day${remainingDays > 1 ? 's' : ''}. Expiry date: ${new Date(accountExpiryDate).toLocaleDateString()}`;
        } else {
            return "Your account has expired. Please contact support to reactivate your account.";
        }
    };

    if (show || showPopup) {
        return (
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
        );
    }

    return (
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
    );
}

export default ConfirmAccountPopup;
