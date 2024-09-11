import React, { useState } from "react";
import { handleError, handleSuccess } from "../utils/ReactToastify";
import '../assets/style/styleutils/ReactToastifyCustom.css';
import "../assets/style/PagesStyle/Profile.css";
import { useNavigate } from "react-router-dom";

function UserProfile({ user, onClose }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedInUser");
        handleSuccess("Logged out successfully!");
        setTimeout(() => navigate("/login"), 500);
      } else {
        handleError("Failed to log out. Please try again.");
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setTimeout(() => setIsModalActive(true), 10);
  };

  const closeLogoutModal = () => {
    setIsModalActive(false);
    setTimeout(() => setShowLogoutModal(false), 300);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/auth/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        handleSuccess(data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedInUser");
        setTimeout(() => navigate("/login"), 500);
      } else {
        handleError(data.message || "Failed to delete user. Please try again.");
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
    }
  };

  const settingsItems = [
    { title: "Account", icon: "👤" },
    { title: "Privacy", icon: "🔐" },
    { title: "Appearance", icon: "🎨" },
    { title: "Notifications", icon: "🔔" },
    { title: "Language", icon: "🌐" },
    { title: "Help", icon: "❓" }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          <img src='/images/avater/avater.png' className='profile-picture' alt='Profile' />
        </div>
        <h1 className="user-name">{`${user.first_name || ''} ${user.last_name || ''}`}</h1>
        <p className="user-email">{user.email}</p>
      </div>

      <div className="settings-grid">
        {settingsItems.map((item, index) => (
          <div key={index} className="settings-item">
            <span className="settings-icon">{item.icon}</span>
            <span className="settings-title">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={openLogoutModal}>
          Logout
        </button>
        <button className="delete-button" onClick={handleDeleteUser}>
          Delete Account
        </button>
      </div>

      {showLogoutModal && (
        <div className={`logout-modal-overlay ${isModalActive ? 'active fade-in' : ''}`}>
          <div className="logout-modal scale-in">
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="modal-cancel-button" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="modal-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(UserProfile);

