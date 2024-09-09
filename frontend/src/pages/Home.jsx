import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/ReactToastify";
import { ToastContainer } from "react-toastify";
import "../assets/style/ReactToastifyCustom.css";
import "../assets/style/home.css";
import "../assets/style/loading.css";
import LoadingOverlay from "../components/LoadingOverlay";
import ConfirmAccountPopup from "../components/ConfirmAccountEmail";
import HistorySidebar from "../components/HistorySidebar";
import ServicesSection from "../components/ServicesSection";
import PromptInput from '../Services/PromptInput';

const LazyUserProfile = lazy(() => import('./UserProfile'));
const ProfileLoadingSpinner = () => <div className="loading-spinner"></div>;

function Home() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const navigate = useNavigate();
  const [accountStatus, setAccountStatus] = useState(null);
  const [showAccountStatus, setShowAccountStatus] = useState(false);

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
        setLoggedInUser(result);
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
      }, 30  * 1000); // Show popup after 30 minutes
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

  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/check-account-status', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAccountStatus(data);
        setShowAccountStatus(true);
      } catch (error) {
        console.error('Error checking account status:', error);
        setShowAccountStatus(false);
      }
    };

    checkAccountStatus();
    const intervalId = setInterval(checkAccountStatus, 100); // Check every 1 mili

    return () => clearInterval(intervalId);
  }, []);
  if (loading) {
    return <LoadingOverlay loading={loading} fadeOut={false} />;
  }

  return (
    <div className="home-container">
      <div className="background-overlay"></div>
      {showAccountStatus && accountStatus && (
        <div className="account-status-banner">
          Account Status: {accountStatus.status}
        </div>
      )}
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
            <img src="/images/avater/avater.png" className={`profilePicture ${showProfile ? 'fade-out' : ''}`} alt="Profile" />
            {showProfile && (
              <div className="close-profile-button fade-in" onClick={(e) => {
                e.stopPropagation();
                toggleProfile();
              }}>
                
              </div>
            )}
          </div>
        </div>
        
        <ConfirmAccountPopup
          isActive={loggedInUser.isActive}
          email={loggedInUser.email}
          token={localStorage.getItem("token")}
          show={showConfirmPopup}
          onClose={handleClosePopup}
        />

        <div className={`main-container ${showProfile ? 'hide-services' : ''}`}>
          <ServicesSection userName={loggedInUser.name} />
        </div>

        <Suspense fallback={<ProfileLoadingSpinner />}>
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
      <PromptInput />
    </div>
  );
}

export default Home;
