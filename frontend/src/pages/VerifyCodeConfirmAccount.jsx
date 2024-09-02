
// // frontend/src/pages/VerifyCodeConfirmAccount.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
// import '../utils/ReactToastifyCustom.css';
// import '../utils/style/SentOtpForgotPassword.css';
// import OtpInput from '../Services/OtpInput';

// function VerifyCodeConfirmAccount() {
//     const [otp, setOtp] = useState('');
//     const [timer, setTimer] = useState(0);
//     const [isResendEnabled, setIsResendEnabled] = useState(false);
//     const [isComplete, setIsComplete] = useState(false);
//     const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);
//     const { state } = useLocation(); // Get token from location state
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!state?.token) {
//             // If there's no token, redirect to the login page
//             handleError('Unauthorized access. Please log in.');
//             navigate('/login');
//         }
//     }, [state, navigate]);

//     // Handle countdown timer
//     useEffect(() => {
//         if (timer > 0) {
//             const countdown = setInterval(() => {
//                 setTimer((prev) => prev - 1);
//             }, 1000);

//             return () => clearInterval(countdown);
//         } else {
//             setIsResendEnabled(true);
//         }
//     }, [timer]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch('http://localhost:8080/auth/verify-email', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${state.token}`, // Use the token for verification
//                 },
//                 body: JSON.stringify({ code: otp }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 handleSuccess(result.message);
//                 navigate('/home');
//             } else {
//                 handleError(result.message);
//             }
//         } catch (err) {
//             handleError('Network error. Please check your connection and try again.');
//         }
//     };

//     const handleSendOtp = async () => {
//         try {
//             setHasCodeBeenSent(true);
//             setIsResendEnabled(false);
//             setTimer(60); // Start timer when sending the code
//             const response = await fetch('http://localhost:8080/auth/send-verification-code', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${state.token}`, // Use the token
//                 },
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 handleSuccess(result.message);
//             } else {
//                 handleError(result.message);
//             }
//         } catch (err) {
//             handleError('Failed to send OTP. Please try again.');
//         }
//     };

//     const handleResendOtp = async () => {
//         try {
//             setIsResendEnabled(false);
//             setTimer(60); // Reset timer when resending the code
//             const response = await fetch('http://localhost:8080/auth/resend-verification-code', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${state.token}`, // Use the token
//                 },
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 handleSuccess(result.message);
//             } else {
//                 handleError(result.message);
//             }
//         } catch (err) {
//             handleError('Failed to resend OTP. Please try again.');
//         }
//     };

//     return (
//         <div className="otp-wrapper">
//             <div>
//                 <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
//             </div>
//             <h1 className="otp-title">Verification Code</h1>
//             <div className="otp-timer">
//                 {hasCodeBeenSent ? (
//                     <p>We've sent a verification code to your registered email address.</p>
//                 ) : (
//                     <p>Click the button to send the verification code to your email.</p>
//                 )}
//                 <div className="timer">
//                     <p>Time Remaining: {timer} s</p>
//                 </div>
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <div className="otp-buttons">
//                     {!hasCodeBeenSent ? (
//                         <button
//                             type="button"
//                             className="otp-btn send"
//                             onClick={handleSendOtp}
//                         >
//                             Send Code
//                         </button>
//                     ) : timer === 0 && isResendEnabled ? (
//                         <button
//                             type="button"
//                             className="otp-btn resend"
//                             onClick={handleResendOtp}
//                         >
//                             Resend Code
//                         </button>
//                     ) : hasCodeBeenSent && timer > 0 ? (
//                         <>
//                             <OtpInput
//                                 length={6}
//                                 onOtpSubmit={(otp) => setOtp(otp)}
//                                 onOtpComplete={(complete) => setIsComplete(complete)}
//                             />
//                             <button
//                                 type="submit"
//                                 className={`otp-btn verify ${isComplete ? 'active' : ''}`}
//                                 disabled={!isComplete}
//                             >
//                                 Verify Code
//                             </button>
//                         </>
//                     ) : null}
//                 </div>
//             </form>
//             <ToastContainer />
//         </div>
//     );
// }

// export default VerifyCodeConfirmAccount;




// frontend/src/pages/VerifyCodeConfirmAccount.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
import '../utils/ReactToastifyCustom.css';
import '../utils/style/SentOtpForgotPassword.css';
import OtpInput from '../Services/OtpInput';

function VerifyCodeConfirmAccount() {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);
    const { state } = useLocation(); // Get token from location state
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.token) {
            // If there's no token, redirect to the login page
            handleError('Unauthorized access. Please log in.');
            navigate('/login');
        }
    }, [state, navigate]);

    // Handle countdown timer
    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(countdown);
        } else {
            setIsResendEnabled(true);
        }
    }, [timer]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/verification/verify-email', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`, // Use the token for verification
                },
                body: JSON.stringify({ code: otp }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                
                // Save token to localStorage or cookies if provided by backend
                localStorage.setItem('authToken', result.token);
                
                // Navigate to home
                navigate('/home');
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
            setIsResendEnabled(false);
            setTimer(60); // Start timer when sending the code
            
            const response = await fetch('http://localhost:8080/verification/verification-code', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`, // Use the token
                },
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
            setTimer(60); // Reset timer when resending the code
            
            const response = await fetch('http://localhost:8080/verification/verification-code', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`, // Use the token
                },
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
    

    return (
        <div className="otp-wrapper">
            <div>
                <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
            </div>
            <h1 className="otp-title">Confirm Email</h1>
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

export default VerifyCodeConfirmAccount;
