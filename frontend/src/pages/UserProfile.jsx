import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../utils/ReactToastify";
import "../assets/style/styleutils/ReactToastifyCustom.css";
import "../assets/style/PagesStyle/Profile.css";
import { useNavigate } from "react-router-dom";
import { logoutUser, fetchLoggedInUser } from "../utils/ApiService"; 
import "../assets/style/styleutils/animations.css";
import AvatarUploadPopup from "../Extension/AvatarUploadPopup";
import LoadingOverlay from "../components/LoadingOverlay"; 

// Function to clear all cookies
const clearCookies = () => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
};

function UserProfile({ onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false); 
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isAvatarLoading, setIsAvatarLoading] = useState(true); 
  const [isProfileLoading, setIsProfileLoading] = useState(true); 

  const fetchUserData = async () => {
    try {
      const userData = await fetchLoggedInUser();
      setUser(userData);
      setAvatarUrl(userData.avatar);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        handleSuccess("Logged out successfully!");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedInUser");
        clearCookies();
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

  const openAvatarPopup = () => {
    setShowAvatarPopup(true);
  };

  const closeAvatarPopup = () => {
    setShowAvatarPopup(false);
  };

  const settingsItems = [
    { title: "Account", icon: "👤" },
    { title: "Privacy", icon: "🔐" },
    { title: "Appearance", icon: "🎨" },
    { title: "Notifications", icon: "🔔" },
    { title: "Language", icon: "🌐" },
    { title: "Help", icon: "❓" },
  ];

  if (isProfileLoading) {
    return <LoadingOverlay loading={true} />; 
  }

  return (
    <div className="profile-container">
      <LoadingOverlay loading={isAvatarLoading} />
      <div className="profile-header">
        <div className="avatar-container" onClick={openAvatarPopup}>
          <div className="avatar">
            <img
              src={avatarUrl}
              className="profile-picture"
              alt="Profile"
              loading="lazy"
              onLoad={() => setIsAvatarLoading(false)}
              onError={() => setIsAvatarLoading(false)}
            />
            <div className="camera-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-camera-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.828 2H3.172a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 2 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="user-name">{`${user.first_name || ""} ${user.last_name || ""}`}</h1>
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
      </div>

      {showLogoutModal && (
        <div className={`logout-modal-overlay ${isModalActive ? "active fade-in" : ""}`}>
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

      {showAvatarPopup && (
        <AvatarUploadPopup
          onClose={closeAvatarPopup}
          onUploadSuccess={(newAvatarUrl, message) => {
            handleSuccess(message); // Show success message from backend
            setAvatarUrl(`${newAvatarUrl}?t=${new Date().getTime()}`);
            setIsAvatarLoading(true);
            fetchUserData(); // Refetch user data to update the profile
          }}
        />
      )}
    </div>
  );
}

export default React.memo(UserProfile);