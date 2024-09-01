
// App.js
import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import FindUserForgotPassword from './components/ForgotPassword/FindUserForgotPassword';
import SentOtpForgotPassword from './components/ForgotPassword/SentOtpForgotPassword';
import ResetPassword from './components/ForgotPassword/ResetPassword';
import RefrshHandler from './utils/RefreshHandler';
import 'react-toastify/dist/ReactToastify.css';
import VerifyCodeConfirmAccount from './pages/VerifyCodeAccount'; 

// For Debugging..
import { useLocation } from 'react-router-dom';

function App() {
    // For Debugging..
    const location = useLocation();
    console.log('Current location:', location.pathname);
    // For Debugging..

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    console.log('Is authenticated:', isAuthenticated);


    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />
    }

    return (
        <div className="App">
            <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/verify-email"  element={<VerifyCodeConfirmAccount/>} /> 
                <Route path='/home' element={<PrivateRoute element={<Home />} />} />
                <Route path="/user-profile" element={<UserProfile />} />


                <Route path='/find-user' element={<FindUserForgotPassword />} />
                <Route path='/forgot-password/sent-otp' element={<SentOtpForgotPassword />} />
                <Route path='/forgot-password/reset-password' element={<ResetPassword />} />
            </Routes>
        </div>
    );
}

export default App;



