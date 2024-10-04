import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import FindUserForgotPassword from './components/ForgotPassword/FindUserForgotPassword';
import ConfirmAccountPopup from './components/EmailVerification/VerifyCodeConfirmAccount';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Login and Signup */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Navigate to="/login" />} />
            
            <Route path='/home' element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />

            
            {/* Email Verification */}
            <Route path='/verify-email' element={
                <ProtectedRoute>
                    <ConfirmAccountPopup />
                </ProtectedRoute>
            } />

            
          {/* Forgot Password */}
          <Route path='/find-user' element={<FindUserForgotPassword />} />
        </Routes>
    );
}

export default App;

