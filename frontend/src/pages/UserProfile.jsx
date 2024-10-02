import React, { useState } from "react";
import { handleError, handleSuccess } from "../utils/ReactToastify";
import '../assets/style/styleutils/ReactToastifyCustom.css';
import "../assets/style/PagesStyle/Profile.css";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../utils/ApiService';
import '../assets/style/styleutils/animations.css';
// Function to clear all cookies
const clearCookies = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
};

function UserProfile({ user, onClose }) {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response.status === 200) {
                handleSuccess("Logged out successfully!");
                // Clear local storage
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("loggedInUser");
                // Clear cookies
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
                    <img src='images/avatar/avatar-Alice.png' className='profile-picture' alt='Profile' />
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

