import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleError } from "../utils/ReactToastify";
import { ToastContainer } from "react-toastify";
import "../assets/style/ReactToastifyCustom.css";
import "../assets/style/home.css";
import "../assets/style/loading.css";
import LoadingOverlay from "../components/LoadingOverlay";
import ConfirmAccountPopup from "../components/ConfirmAccountPopup";
import HistorySidebar from "../components/HistorySidebar";
import ServicesSection from "../components/ServicesSection";

const LazyUserProfile = lazy(() => import('./UserProfile'));

function Home() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const navigate = useNavigate();

  const fetchLoggedInUser = useCallback(async () => {
    setLoading(true);
    try {
      const url = "http://localhost:8080/Users/me";
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await fetch(url, headers);
      const result = await response.json();
      if (response.ok) {
        setLoggedInUser({
          ...result,
          isActive: result.isActive,
          accountExpiryDate: result.accountExpiryDate
        });
      } else {
        handleError(
          result.message || "Failed to fetch user data. Please try again."
        );
        navigate("/login");
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLoggedInUser();

    let popupTimer;

    if (!loggedInUser.isActive) {
      popupTimer = setTimeout(() => {
        setShowConfirmPopup(true);
      }, 30 * 60 * 1000); // Show popup after 30 minutes
    }

    return () => {
      if (popupTimer) clearTimeout(popupTimer);
    };
  }, [fetchLoggedInUser, loggedInUser.isActive]);

  const toggleProfile = useCallback(() => {
    setShowProfile(prev => !prev);
  }, []);

  const handleClosePopup = () => {
    setShowConfirmPopup(false);
  };

  const handleLogout = useCallback(async () => {
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
        navigate("/login");
      } else {
        handleError("Failed to log out. Please try again.");
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
    }
  }, [navigate]);

  if (loading) {
    return <LoadingOverlay loading={loading} fadeOut={false} />;
  }

  return (
    <div className="home-container">
      <div className="background-overlay"></div>
      <div className={`content-wrapper ${showProfile ? 'blur-background' : ''}`}>
        <div className="top-bar">
          <button 
            className={`history-button ${showHistorySidebar ? 'active' : ''}`} 
            onClick={() => setShowHistorySidebar(prev => !prev)}
            disabled={showHistorySidebar}
          >
            <img src="/images/icon/history-icon.png" alt="History" />
          </button>
          <div className="user-icon-image" onClick={toggleProfile}>
            <img src="/images/avater/avater.png" className="profilePicture" alt="Profile" />
          </div>
        </div>
        
        <ConfirmAccountPopup
          isActive={loggedInUser.isActive}
          email={loggedInUser.email}
          token={localStorage.getItem("token")}
          show={showConfirmPopup}
          onClose={handleClosePopup}
          accountExpiryDate={loggedInUser.accountExpiryDate}
          onLogout={handleLogout}
        />

        <div className={`main-container ${showProfile ? 'hide-services' : ''}`}>
          <ServicesSection userName={loggedInUser.name} />
        </div>

        <Suspense fallback={<div className="loading-profile">Loading profile...</div>}>
          {showProfile && (
            <div className="centered-profile fade-in-center-profile">
              <LazyUserProfile user={loggedInUser} onClose={toggleProfile} />
            </div>
          )}
        </Suspense>

      </div>
      <ToastContainer />
      <HistorySidebar
        show={showHistorySidebar}
        onClose={() => setShowHistorySidebar(false)}
      />
    </div>
  );
}

export default Home;
