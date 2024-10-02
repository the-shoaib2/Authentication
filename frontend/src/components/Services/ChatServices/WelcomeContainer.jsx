import React from 'react';
import StarIcon from "../../StarIcon";
import '../../../assets/style/ServicesStyle/ChatServicesStyle/WelcomeContainer.css';

const WelcomeContainer = () => {
  return (
    <div className="welcome-container">
      <StarIcon
        width={64}
        height={64}
        fill="#5E5CE6"
        className="welcome-icon"
      />
      <h1 className="welcome-title">Hello...</h1>
      <p className="welcome-message">
        Connect with friends and colleagues in a secure environment.
        Select a user from the list to start chatting!
      </p>
      <div className="encryption-notice">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        </svg>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
};

export default WelcomeContainer;
