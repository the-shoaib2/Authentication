// // frontend/src/pages/Home.jsx

// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { handleError } from '../utils/ReactToastify';
// import { ToastContainer } from 'react-toastify';
// import '../utils/ReactToastifyCustom.css';
// import '../utils/style/home.css';
// import '../utils/loading.css';

// function Home() {
//     const [loggedInUser, setLoggedInUser] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [fadeIn, setFadeIn] = useState(true);
//     const [showPopup, setShowPopup] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchLoggedInUser();

//         const timeoutId = setTimeout(() => {
//             setFadeIn(false);
//         }, 500);

//         return () => clearTimeout(timeoutId);
//     }, []);

//     useEffect(() => {
//         if (loggedInUser && !loggedInUser.isActive) {
//             const popupTimer = setTimeout(() => {
//                 setShowPopup(true);
//             }, 5000); // Show popup after 5 seconds

//             return () => clearTimeout(popupTimer);
//         }
//     }, [loggedInUser]);

//     const fetchLoggedInUser = async () => {
//         setLoading(true);
//         try {
//             const url = "http://localhost:8080/Users/me";
//             const headers = {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             };
//             const response = await fetch(url, headers);
//             const result = await response.json();
//             if (response.ok) {
//                 setLoggedInUser(result);
//             } else {
//                 handleError(result.message || 'Failed to fetch user data. Please try again.');
//                 navigate('/login');
//             }
//         } catch (err) {
//             handleError('Network error. Please check your connection and try again.');
//             navigate('/login');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loading-overlay">
//                 <img src='/apple-loading.gif' alt='Loading...' className='loading-spinner' />
//             </div>
//         );
//     }

//     return (
//         <div className={`home-container container ${fadeIn ? 'fade-in' : ''}`}>
//             {showPopup && !loggedInUser.isActive && (
//                 <div className="popup-overlay">
//                     <div className="inactive-account-message-container">
//                         <h1>Your account is not confirmed yet.</h1>
//                         <p>Please check your email to confirm your account.</p>
//                         <Link to="/verify-email" className="confirm-account-link">
//                             <button className="confirm-account-button">
//                                 Activate Account
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             )}
//             <div className="user-image-icon-container">
//                 <Link to="/user-profile" className='pages-link'>
//                     <div className="user-icon-image">
//                         <img src='/avater.png' className='profilePicture' alt='Profile' />
//                     </div>
//                 </Link>
//                 <h1 className="user-name">{loggedInUser.name}</h1>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// }

// export default Home;

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError } from '../utils/ReactToastify';
import { ToastContainer } from 'react-toastify';
import '../utils/ReactToastifyCustom.css';
import '../utils/style/home.css';
import '../utils/loading.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const fetchLoggedInUser = useCallback(async () => {
        setLoading(true);
        try {
            const url = "http://localhost:8080/Users/me";
            const headers = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            if (response.ok) {
                setLoggedInUser(result);
            } else {
                handleError(result.message || 'Failed to fetch user data. Please try again.');
                navigate('/login');
            }
        } catch (err) {
            handleError('Network error. Please check your connection and try again.');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchLoggedInUser();

        const timeoutId = setTimeout(() => {
            setFadeIn(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [fetchLoggedInUser]); // Use fetchLoggedInUser as a dependency

    useEffect(() => {
        if (loggedInUser && !loggedInUser.isActive) {
            const popupTimer = setTimeout(() => {
                setShowPopup(true);
            }, 5000); // Show popup after 5 seconds

            return () => clearTimeout(popupTimer);
        }
    }, [loggedInUser]);

    if (loading) {
        return (
            <div className="loading-overlay">
                <img src='/apple-loading.gif' alt='Loading...' className='loading-spinner' />
            </div>
        );
    }

    return (
        <div className={`home-container container ${fadeIn ? 'fade-in' : ''}`}>
            {showPopup && !loggedInUser.isActive && (
                <div className="popup-overlay">
                    <div className="inactive-account-message-container">
                        <h1>Your account is not confirmed yet.</h1>
                        <p>Please check your email to confirm your account.</p>
                        <Link to="/verify-email" className="confirm-account-link">
                            <button className="confirm-account-button">
                                Activate Account
                            </button>
                        </Link>
                    </div>
                </div>
            )}
            <div className="user-image-icon-container">
                <Link to="/user-profile" className='pages-link'>
                    <div className="user-icon-image">
                        <img src='/avater.png' className='profilePicture' alt='Profile' />
                    </div>
                </Link>
                <h1 className="user-name">{loggedInUser.name}</h1>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
