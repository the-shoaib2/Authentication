import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ConfirmAccountPopup({ isActive, email, token, show, onClose }) {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!isActive && !show) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 30 * 60 * 1000); // 30 minutes
            return () => clearTimeout(timer);
        }
    }, [isActive, show]);

    if (isActive) return null;

    const handleClose = () => {
        setShowPopup(false);
        if (onClose) onClose();
    };

    if (show || showPopup) {
        return (
            <div className="popup-overlay">
                <div className="inactive-account-message-container">
                    <button className="close-popup-button" onClick={handleClose}>
                        {/* &times; */}
                    </button>
                    <h1>Your account is not confirmed yet.</h1>
                    <p>Please check your email to confirm your account.</p>
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
                Please confirm your email. Your account will be deleted after 15 days if not confirmed.
            </span>
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
        </div>
    );
}

export default ConfirmAccountPopup;
