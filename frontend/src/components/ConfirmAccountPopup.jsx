import React from 'react';
import { Link } from 'react-router-dom';

function ConfirmAccountPopup({ isActive, email, token, show }) {
    if (isActive || !show) return null;

    return (
        <div className="popup-overlay">
            <div className="inactive-account-message-container">
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

export default ConfirmAccountPopup;
