// frontend/src/pages/Signup.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  handleSuccess,
  handleError,
  ToastContainer,
} from "../utils/ReactToastify";
import { signupUser } from '../utils/ApiService'; 
import "../assets/style/styleutils/ReactToastifyCustom.css";
import '../assets/style/styleutils/loading.css';
import '../assets/style/styleutils/animations.css';
import LoadingOverlay from '../components/LoadingOverlay';
import "../assets/style/PagesStyle/Signup.css";
import StarIcon from '../components/StarIcon';
import Popup from '../components/AgreementPopup'; 
import PrivacyPolicy from '../components/PrivacyPolicy'; 
import TermsOfUse from '../components/TermsOfUse'; 


function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: {
      day: "",
      month: "",
      year: "",
    },
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', content: null });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      handleError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await signupUser(formData);
      if (result.success) {
        handleSuccess("Signup successful! Please verify your email.");
        navigate('/home', { replace: true }); // Navigate to home on success
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPopup = (type) => {
    if (type === 'privacy') {
      setPopupContent({ title: 'Privacy Policy', content: <PrivacyPolicy /> });
    } else if (type === 'terms') {
      setPopupContent({ title: 'Terms of Use', content: <TermsOfUse /> });
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="signup-page__container fade-in"> 
      <StarIcon width={48} height={48} fill="#5E5CE6" className="signup-page__app-icon" />
      <h1 className="signup-page__title">Sign up</h1>
      <form onSubmit={handleSubmit} className="signup-page__form">
        <div className="signup-page__form-group-container">
          <div className="signup-page__form-group">
            <input
              type="text"
              id="firstName"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
              required
              className="signup-page__input"
            />
            <label htmlFor="firstName" className="signup-page__form-label">
              First Name
            </label>
          </div>
          <div className="signup-page__form-group">
            <input
              type="text"
              id="lastName"
              placeholder=""
              value={formData.lastName}
              onChange={handleChange}
              required
              className="signup-page__input"
            />
            <label htmlFor="lastName" className="signup-page__form-label">
              Last Name
            </label>
          </div>
        </div>

        <div className="signup-page__form-group">
          <input
            type="email"
            id="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-page__input"
          />
          <label htmlFor="email" className="signup-page__form-label">
            Email
          </label>
        </div>

        <div className="signup-page__form-group-container">
          <div className="signup-page__form-group">
            <input
              className="signup-page__input signup-page__phone-input"
              type="tel"
              id="phone"
              placeholder=""
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone" className="signup-page__form-label">
              Phone Number
            </label>
          </div>
          <div className="signup-page__form-group">
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="signup-page__select"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="signup-page__form-group-container">
          <div className="signup-page__form-group">
            <input
              type="password"
              id="password"
              placeholder=""
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-page__input"
            />
            <label htmlFor="password" className="signup-page__form-label">
              Password
            </label>
          </div>
          <div className="signup-page__form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder=""
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="signup-page__input"
            />
            <label htmlFor="confirmPassword" className="signup-page__form-label">
              Confirm Password
            </label>
          </div>
        </div>

        <div className="signup-page__form-group-container signup-page__dob-container">
          <div className="signup-page__form-group">
            <select
              id="dobDay"
              value={formData.dob.day}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, day: e.target.value },
                }))
              }
              required
              className="signup-page__select"
            >
              <option value="" disabled>
                Day
              </option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="signup-page__form-group">
            <select
              id="dobMonth"
              value={formData.dob.month}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, month: e.target.value },
                }))
              }
              required
              className="signup-page__select"
            >
              <option value="" disabled>
                Month
              </option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div className="signup-page__form-group">
            <select
              id="dobYear"
              value={formData.dob.year}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  dob: { ...prevState.dob, year: e.target.value },
                }))
              }
              required
              className="signup-page__select"
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={2024 - i} value={2024 - i}>
                  {2024 - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="signup-page__submit-button" type="submit">
          Sign up
        </button>
        <span className="signup-page__login-link-container">
          Already have an account?{" "}
          <Link to="/login" className="signup-page__login-link">
            Login
          </Link>
        </span>
      </form>
      <div className="signup-page__terms-container">
        <span className="signup-page__terms">
          By creating an account, you agree to our
          <span 
            onClick={() => handleShowPopup('terms')} 
            className="signup-page__terms-link"
            style={{ cursor: 'pointer' }}
          >
            {" "}Terms of Use
          </span>
          {" "}and
          <span 
            onClick={() => handleShowPopup('privacy')} 
            className="signup-page__terms-link"
            style={{ cursor: 'pointer' }}
          >
            {" "}Privacy Policy
          </span>
        </span>
      </div>
      {showPopup && (
        <Popup 
          title={popupContent.title} 
          content={popupContent.content} 
          onClose={handleClosePopup} 
        />
      )}
      <ToastContainer />
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default Signup;