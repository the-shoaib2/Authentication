// FindUserForgotPassword.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  handleSuccess,
  handleError,
  ToastContainer,
} from "../../utils/ReactToastify";
import "../../assets/style/styleutils/ReactToastifyCustom.css";
import "../../assets/style/styleutils/animations.css";
import "../../assets/style/VerificationStyle/FindUserForgotPassword.css";
import StarIcon from '../../components/StarIcon';

function FindUserForgotPassword() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (fadeIn) {
      const timeoutId = setTimeout(() => setFadeIn(false), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [fadeIn]);

  useEffect(() => {
    const timerId = setTimeout(() => setShowContent(!loading), 500);
    return () => clearTimeout(timerId);
  }, [loading]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowContent(false);

    try {
      const response = await fetch(
        "http://localhost:8080/verification/find-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailOrUsername }),
        }
      );

      const result = await response.json();

      setTimeout(() => {
        if (response.ok) {
          handleSuccess(result.message);
          setUser(result.data.user);
        } else {
          handleError(result.message);
          setUser(null);
        }
        setFadeIn(true);
        setLoading(false);
        setSearchCompleted(true);
      }, 500);
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
      setFadeIn(true);
      setLoading(false);
      setSearchCompleted(true);
    }
  };

  const handleProceed = () => {
    if (user && searchCompleted) {
      // handleSendOtp();
      navigate("/forgot-password/verification-code", {
        state: { email: user.email },
      });
    } else {
      handleError("No user found. Please search for a valid user.");
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setEmailOrUsername(value);
    updateSuggestions(value);
  };

  const updateSuggestions = (value) => {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    let suggestionList = [];

    if (value.includes("@")) {
      const [, domain] = value.split("@");
      if (domain.length > 0) {
        suggestionList = domains
          .filter((d) => d.startsWith(domain))
          .map((d) => `${value.split("@")[0]}@${d}`);
      }
    } else {
      suggestionList = domains.map((d) => `${value}@${d}`);
    }

    setSuggestions(suggestionList);
    setShowSuggestions(suggestionList.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setEmailOrUsername(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`find-user-container container ${fadeIn ? "fade-in" : ""}`}>
      <div className="header-container">
        <div className="icon-container-position">
          <Link to="/login" className="icon-container">
            <img
              src="/images/icon/back-icon.png"
              alt="Back"
              className="back-icon"
            />
          </Link>
        </div>

        <div className="center-content">
          <div className="logo-container">
            <StarIcon width={80} height={80}/>
          </div>
          <h1 className="page-title">Forgot Password</h1>
        </div>
      </div>

      <form onSubmit={handleSearch}>
        <div className="input-container">
          <input
            type="search"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="search-icon-wrapper"
          >
            <img
              src="/images/icon/search.ico"
              alt="Search icon"
              className="search-icon-img"
            />
          </button>
          {showSuggestions && (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      <div className="confirmation-message">
        {!searchCompleted ? (
          <br />
        ) : (
          <>
            {user ? (
              <p>Is this you? Please confirm.</p>
            ) : (
              <p>Please try again with a different email or username.</p>
            )}
          </>
        )}
      </div>

      <div className="found-user-wrapper">
        {loading && !showContent ? (
          <div className="loading-overlay">
            <img
              src="/images/icon/apple-loading.gif"
              alt="Loading spinner"
              className="loading-spinner"
            />
          </div>
        ) : (
          <div
            className={`found-user-content ${
              user && searchCompleted ? "fade-in-bottom" : ""
            }`}
          >
            {user ? (
              <div
                className="user-card"
                onClick={handleProceed}
                style={{ cursor: "pointer" }}
              >
                <div className="user-card-image">
                  <img
                    src={user.avatar || "/images/avatar/avatar-Alice.png"}
                    alt="User avatar"
                    className="profilePicture"
                  />
                </div>
                <div className="user-card-details">
                  <h3>{user.name}</h3>
                  <p>{user.username}</p>
                </div>
              </div>
            ) : (
              <div className="placeholder-message">
                <p>Find your profile using Gmail and username</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default FindUserForgotPassword;
