// App.js
import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import FindUserForgotPassword from './components/ForgotPassword/FindUserForgotPassword';
import SentOtpForgotPassword from './components/ForgotPassword/VerificationCodeForgotPassword';
import ResetPassword from './components/ForgotPassword/ResetPassword';
import RefrshHandler from './utils/RefreshHandler';
import ProtectedRoute from './utils/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import VerifyCodeConfirmAccount from './components/VerifyCodeConfirmAccount'; 

// For Debugging..
import { useLocation } from 'react-router-dom';

function App() {
    // For Debugging..
    const location = useLocation();
    console.log('Current location:', location.pathname);
    // For Debugging..

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    console.log('Is authenticated:', isAuthenticated);

    return (
        <div className="App">
            <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/verify-email" element={
                    <ProtectedRoute 
                        element={VerifyCodeConfirmAccount} 
                        isAuthenticated={isAuthenticated} 
                    />
                } />
                <Route path='/home' element={
                    <ProtectedRoute 
                        element={Home} 
                        isAuthenticated={isAuthenticated} 
                    />
                } />
                <Route path='/find-user' element={<FindUserForgotPassword />} />
                <Route path='/forgot-password/verification-code' element={<SentOtpForgotPassword />} />
                <Route path='/forgot-password/reset-password' element={<ResetPassword />} />
            </Routes>
        </div>
    );
}

export default App;



