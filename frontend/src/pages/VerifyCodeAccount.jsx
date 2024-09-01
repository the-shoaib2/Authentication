// // // frontend/src/pages/VerifyCodeAccount.jsx

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { handleSuccess, handleError, ToastContainer } from '../utils/ReactToastify';
// // import '../utils/ReactToastifyCustom.css';
// // import '../utils/style/SentOtpForgotPassword.css';
// // import OtpInput from '../Services/OtpInput';

// // function VerifyCodeConfirmAccount() {
// //     const [otp, setOtp] = useState('');
// //     const [timer, setTimer] = useState(60);
// //     const [isResendEnabled, setIsResendEnabled] = useState(false);
// //     const [isComplete, setIsComplete] = useState(false);
// //     // const [isVerified, setIsVerified] = useState(false); // Track OTP verification status
// //     const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false); // Track if code has been sent
// //     const { state } = useLocation(); // Get email from location state
// //     const navigate = useNavigate();

// //     // Handle countdown timer
// //     useEffect(() => {
// //         const countdown = timer > 0 ? setInterval(() => {
// //             setTimer((prev) => prev - 1);
// //         }, 1000) : null;

// //         if (timer === 0) {
// //             setIsResendEnabled(true);
// //         }

// //         return () => {
// //             if (countdown) clearInterval(countdown);
// //         };
// //     }, [timer]);

// //     // // Auto-login if OTP is verified
// //     // useEffect(() => {
// //     //     if (isVerified) {
// //     //         const refreshToken = localStorage.getItem('refreshToken');
// //     //         if (refreshToken) {
// //     //             (async () => {
// //     //                 try {
// //     //                     const response = await fetch("http://localhost:8080/auth/refresh-token", {
// //     //                         method: 'POST',
// //     //                         headers: {
// //     //                             'Content-Type': 'application/json',
// //     //                         },
// //     //                         body: JSON.stringify({ refreshToken }),
// //     //                     });
// //     //                     const result = await response.json();
// //     //                     if (response.ok) {
// //     //                         localStorage.setItem('token', result.accessToken);
// //     //                         localStorage.setItem('refreshToken', result.refreshToken);
// //     //                         localStorage.setItem('loggedInUser', JSON.stringify(result));
// //     //                         handleSuccess('Auto-login successful!');
// //     //                         navigate('/home');
// //     //                     } else {
// //     //                         handleError(result.message || 'Failed to auto-login.');
// //     //                     }
// //     //                 } catch (err) {
// //     //                     handleError('Network error. Please check your connection and try again.');
// //     //                 }
// //     //             })();
// //     //         }
// //     //     }
// //     // }, [isVerified, navigate]);

// //     const handleSubmit = async (event) => {
// //         event.preventDefault();
// //         try {
// //             const token = localStorage.getItem('token'); // Get the token from localStorage
// //             const response = await fetch('http://localhost:8080/auth/verify-email', {
// //                 method: 'POST',
// //                 headers: { 
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${token}` // Add the token to the Authorization header
// //                 },
// //                 body: JSON.stringify({ email: state.email, code: otp }),
// //             });
    
// //             const result = await response.json();
    
// //             if (response.ok) {
// //                 handleSuccess(result.message);
// //             } else {
// //                 handleError(result.message);
// //             }
// //         } catch (err) {
// //             handleError('Network error. Please check your connection and try again.');
// //         }
// //     };
    
// //     const handleSendOtp = async () => {
// //         try {
// //             setHasCodeBeenSent(true);
// //             setIsResendEnabled(false);
// //             setTimer(60); // Reset timer
// //             const token = localStorage.getItem('token'); // Get the token from localStorage
// //             const response = await fetch('http://localhost:8080/auth/verify-email', {
// //                 method: 'POST',
// //                 headers: { 
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${token}` // Add the token to the Authorization header
// //                 },
// //                 body: JSON.stringify({ email: state.email }),
// //             });
    
// //             const result = await response.json();
    
// //             if (response.ok) {
// //                 handleSuccess(result.message);
// //             } else {
// //                 handleError(result.message);
// //             }
// //         } catch (err) {
// //             handleError('Failed to send OTP. Please try again.');
// //         }
// //     };
    
// //     const handleResendOtp = async () => {
// //         try {
// //             setIsResendEnabled(false);
// //             setTimer(60); // Reset timer
// //             const token = localStorage.getItem('token'); // Get the token from localStorage
// //             const response = await fetch('http://localhost:8080/auth/verify-email', {
// //                 method: 'POST',
// //                 headers: { 
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${token}` // Add the token to the Authorization header
// //                 },
// //                 body: JSON.stringify({ email: state.email }),
// //             });
    
// //             const result = await response.json();
    
// //             if (response.ok) {
// //                 handleSuccess(result.message);
// //             } else {
// //                 handleError(result.message);
// //             }
// //         } catch (err) {
// //             handleError('Failed to resend OTP. Please try again.');
// //         }
// //     };
    

// //     return (
// //         <div className="otp-wrapper">
// //             <div>
// //                 <img src='/app-icon.ico' alt='App Icon' className='app-icon' />
// //             </div>
// //             <h1 className="otp-title">Verification Code</h1>
// //             <div className="otp-timer">
// //                 {hasCodeBeenSent ? (
// //                     <p>We've sent a verification code to your registered email address.</p>
// //                 ) : (
// //                     <p>Click the button to send the verification code to your email.</p>
// //                 )}
// //                 <div className="timer">
// //                     <p>Time Remaining: {timer} s</p>
// //                 </div>
// //             </div>
// //             <form onSubmit={handleSubmit}>
// //                 {!hasCodeBeenSent ? (
// //                     <button
// //                         type="button"
// //                         className="otp-btn send"
// //                         onClick={handleSendOtp}
// //                     >
// //                         Send Code
// //                     </button>
// //                 ) : (
// //                     <OtpInput
// //                         length={6}
// //                         onOtpSubmit={(otp) => setOtp(otp)}
// //                         onOtpComplete={(complete) => setIsComplete(complete)}
// //                     />
// //                 )}
// //                 <div className="otp-buttons">
// //                     {timer === 0 && isResendEnabled ? (
// //                         <>
// //                             <div className="otp-message">
// //                                 <p>Didn't receive the code?</p>
// //                             </div>
// //                             <button
// //                                 type="button"
// //                                 className="otp-btn resend"
// //                                 onClick={handleResendOtp}
// //                             >
// //                                 Resend Code
// //                             </button>
// //                         </>
// //                     ) : hasCodeBeenSent ? (
// //                         <>
// //                             <div className="otp-message">
// //                                 <br />
// //                             </div>
// //                             <button
// //                                 type="submit"
// //                                 className={`otp-btn verify ${isComplete ? 'active' : ''}`}
// //                                 disabled={!isComplete}
// //                             >
// //                                 Verify Code
// //                             </button>
// //                         </>
// //                     ) : null}
// //                 </div>
// //             </form>
// //             <ToastContainer />
// //         </div>
// //     );
// // }

// // export default VerifyCodeConfirmAccount;





// // VerifyCodeConfirmAccount.jsx
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
//     const { state } = useLocation(); // Get email from location state
//     const navigate = useNavigate();

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
//                 },
//                 body: JSON.stringify({ email: state.email, code: otp }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 handleSuccess(result.message);
//                 // Automatically log in after successful verification
//                 const loginResponse = await fetch("http://localhost:8080/auth/login", {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ email: state.email, password: "yourPassword" }), // Use appropriate password
//                 });
//                 const loginResult = await loginResponse.json();
//                 if (loginResponse.ok) {
//                     localStorage.setItem('token', loginResult.accessToken);
//                     localStorage.setItem('refreshToken', loginResult.refreshToken);
//                     localStorage.setItem('loggedInUser', JSON.stringify(loginResult));
//                     navigate('/home');
//                 } else {
//                     handleError(loginResult.message || 'Login failed.');
//                 }
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
//             const response = await fetch('http://localhost:8080/auth/verify-email', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: state.email }),
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
//             const response = await fetch('http://localhost:8080/auth/verify-email', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: state.email }),
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
//                     'Authorization': state.token, // Use the token for verification
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
//                     'Authorization': state.token, // Use the token
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
//                     'Authorization': state.token, // Use the token
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
            const response = await fetch('http://localhost:8080/auth/verify-email', {
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
            const response = await fetch('http://localhost:8080/auth/send-verification-code', {
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
            const response = await fetch('http://localhost:8080/auth/resend-verification-code', {
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
