import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/ReactToastify";
import { ToastContainer } from "react-toastify";
import "../assets/style/styleutils/ReactToastifyCustom.css";
import "../assets/style/PagesStyle/Home/Home.css";
import "../assets/style/PagesStyle/Home/TopBar.css";
import "../assets/style/styleutils/loading.css";
import LoadingOverlay from "../components/LoadingOverlay";
import ConfirmAccountPopup from "../components/EmailVerification/ConfirmAccountEmail";
import HistorySidebar from "../components/HomeComponents/HistorySidebar";
import ServicesSection from "../components/HomeComponents/ServicesSection";
import PromptInput from '../Extension/PromptInput';
import ChatService from '../components/Services/ChatServices/ChatServices';
import { fetchLoggedInUser } from '../utils/ApiService';

const LazyUserProfile = lazy(() => import('./UserProfile'));
const ProfileLoadingSpinner = () => <div className="loading-spinner"></div>;

function Home() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [activeService, setActiveService] = useState(() => {
    return localStorage.getItem('activeService') || null; // Restore active service from localStorage
  });
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLoggedInUser();
      setLoggedInUser(result);
    } catch (err) {
      handleError(err.message || "Failed to fetch user data. Please try again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loggedInUser.isActive) {
      setShowConfirmPopup(true);
    }
  }, [loggedInUser.isActive]);

  // Refetch user data when the profile is closed
  useEffect(() => {
    if (!showProfile) {
      fetchUser();
    }
  }, [showProfile, fetchUser]);

  const toggleProfile = useCallback(() => {
    setShowProfile(prev => !prev);
    if (!showProfile) setActiveService(null); 
  }, [showProfile]);

  const handleServiceClick = (serviceName) => {
    setActiveService(serviceName);
    localStorage.setItem('activeService', serviceName); // Persist active service to localStorage
  };

  const handleCloseService = () => {
    setActiveService(null); // Reset active service
    localStorage.removeItem('activeService'); // Clear active service from localStorage
  };

  if (loading) {
    return <LoadingOverlay loading={loading} />;
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
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5E5CE6" className="bi bi-clock-history" viewBox="0 0 16 16">
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
            </svg>
            
          </button>
          <div className="user-icon-image" onClick={toggleProfile}>
          <img 
                    src={loggedInUser.avatar} 
                    className={`profilePicture ${showProfile ? 'fade-out' : ''}`} 
                    alt="Profile" 
                />
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
          onClose={() => setShowConfirmPopup(false)}
        />

        <div className={`main-container ${showProfile ? 'hide-services' : ''}`}>
          {loggedInUser.isActive ? (
            activeService ? (
              <div>
                <ChatService onClose={handleCloseService} />
                <button className="services-close-button" onClick={handleCloseService}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x services-close-icon" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="fade-in">
                <ServicesSection userName={loggedInUser.name} onServiceClick={handleServiceClick} />
              </div>
            )
          ) : (
            <div className="fade-in-bottom-disabled">
              <ServicesSection 
                userName={loggedInUser.name} 
                onServiceClick={handleServiceClick} 
                disabled={true} 
              />
            </div>
          )}
        </div>

        <Suspense fallback={<ProfileLoadingSpinner />}>
          {showProfile && (
            <div className="centered-profile fade-in-center-profile">
              <LazyUserProfile user={loggedInUser} onClose={toggleProfile} />
            </div>
          )}
        </Suspense>

      </div>
      <HistorySidebar
        show={showHistorySidebar}
        onClose={() => setShowHistorySidebar(false)}
      />
      {!activeService && !showProfile && <PromptInput className="fade-in" />} 
      <ToastContainer />
    </div>
  );
}

export default Home;