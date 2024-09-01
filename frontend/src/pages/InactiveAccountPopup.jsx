// // components/InactiveAccountPopup.js

// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../utils/ReactToastifyCustom.css';
// import '../utils/style/home.css';

// function InactiveAccountPopup() {
//     return (
//         <div className="popup-overlay">
//             <div className="inactive-account-message-container">
//                 <h1>Your account is not confirmed yet.</h1>
//                 <p>Please check your email to confirm your account.</p>
//                 <Link to="/verify-email" className="confirm-account-link">
//                     <button className="confirm-account-button">
//                         Activate Account
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default InactiveAccountPopup;



// frontend/src/pages/InactiveAccountPopup.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../utils/ReactToastifyCustom.css';
import '../utils/style/home.css';

function InactiveAccountPopup({ token }) {  // Pass the token as a prop
    const navigate = useNavigate();

    const handleActivateAccount = () => {
        // Check if the token is valid before navigating
        fetch('http://localhost:8080/auth/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Navigate to VerifyCodeConfirmAccount with token
                navigate('/verify-email', { state: { token } });
                console.log(token);
            } else {
                // Handle invalid token case
                alert('Invalid or expired token. Please log in again.');
            }
        })
        .catch(err => {
            alert('Network error. Please try again.');
        });
    };

    return (
        <div className="popup-overlay">
            <div className="inactive-account-message-container">
                <h1>Your account is not confirmed yet.</h1>
                <p>Please check your email to confirm your account.</p>
                <button className="confirm-account-button" onClick={handleActivateAccount}>
                    Activate Account
                </button>
            </div>
        </div>
    );
}

export default InactiveAccountPopup;
