import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import FindUserForgotPassword from './components/ForgotPassword/FindUserForgotPassword';
import ConfirmAccountPopup from './components/EmailVerification/VerifyCodeConfirmAccount';

function App() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Navigate to="/login" />} />
            <Route path='/home' element={<Home />} />

            <Route path='/find-user' element={<FindUserForgotPassword />} /> 
            <Route path='/verify-email' element={<ConfirmAccountPopup />} /> 

        </Routes>
    );
}

export default App;

