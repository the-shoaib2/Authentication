// frontend/src/pages/Signup.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  handleSuccess,
  handleError,
  ToastContainer,
} from "../utils/ReactToastify";
import "../assets/style/styleutils/ReactToastifyCustom.css";
import "../assets/style/styleutils/animations.css";
import "../assets/style/styleutils/loading.css";
import LoadingOverlay from '../components/LoadingOverlay';
import "../assets/style/Authentication/Signup.css";
import { refreshToken } from '../utils/RefreshHandler';

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
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFadeIn(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

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
    setFadeOut(false);

    setTimeout(async () => {
      setFadeOut(true);
      setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              phone: formData.phone,
              dob: formData.dob,
              gender: formData.gender,
            }),
          });

          const result = await response.json();
          if (response.ok) {
            handleSuccess("Signup successful! Please verify your email.");
            localStorage.setItem('token', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            await refreshToken(); // Refresh the token immediately after signup
            setTimeout(() => navigate('/verify-email', { 
              state: { 
                token: result.verificationToken,
                email: formData.email 
              } 
            }), 500);
          } else {
            if (result.errors) {
              const errorMessages = result.errors
                .map((err) => `${err.field}: ${err.message}`)
                .join(", ");
              handleError(errorMessages);
            } else {
              handleError(result.message);
            }
          }
        } catch (err) {
          handleError("Network error. Please check your connection and try again.");
        } finally {
          setLoading(false);
        }
      }, 250);
    }, 1000);
  };

  return (
    <div className={`signup-page__container fade-in ${fadeIn ? 'fade-in-bottom' : ''}`}>
      <img src="/images/icon/app-icon.png" alt="App Icon" className="signup-page__app-icon" />
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
          <Link to="/terms" className="signup-page__terms-link">
            {" "}Terms of Use
          </Link>
          {" "}and
          <Link to="/privacy-policy" className="signup-page__terms-link">
            {" "}Privacy Policy
          </Link>
          .
        </span>
      </div>
      <ToastContainer />
      <LoadingOverlay loading={loading} fadeOut={fadeOut} />
    </div>
  );
}

export default Signup;
