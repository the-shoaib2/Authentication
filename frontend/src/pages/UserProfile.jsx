// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { handleError, handleSuccess } from "../utils/ReactToastify";
// import { ToastContainer } from "react-toastify";
// import "../utils/ReactToastifyCustom.css";
// import "../utils/style/profile.css";

// function UserProfile() {
//   const [user, setUser] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [rotate, setRotate] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:8080/Users/me", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setUser(result);
//       } else {
//         handleError(result.message || "Failed to fetch user data. Please try again.");
//         navigate("/login");
//       }
//     } catch (err) {
//       handleError("Network error. Please check your connection and try again.");
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/auth/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           refreshToken: localStorage.getItem("refreshToken"),
//         }),
//       });
//       if (response.ok) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");
//         localStorage.removeItem("loggedInUser");
//         handleSuccess("Logged out successfully!");
//         setTimeout(() => navigate("/login"), 500);
//       } else {
//         handleError("Failed to log out. Please try again.");
//       }
//     } catch (err) {
//       handleError("Network error. Please check your connection and try again.");
//     }
//   };

//   const openLogoutModal = () => {
//     setShowLogoutModal(true);
//   };

//   const closeLogoutModal = () => {
//     setShowLogoutModal(false);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     setRotate(true);
//     setTimeout(() => setRotate(false), 500); // Adjust timing as needed
//   };

//   const rotateClass = rotate ? (darkMode ? "rotate-right" : "rotate-left") : "";

//   const fullName = `${user.first_name || ''} ${user.last_name || ''}`;

//   return (
//     <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
//       {loading ? (
//         <div className="loading-overlay">
//           <img
//             src="/apple-loading.gif"
//             alt="Loading..."
//             className="loading-spinner"
//           />
//         </div>
//       ) : (
//         <>
//           <button
//             className="back-button icon-button"
//             onClick={() => navigate(-1)}
//           >
//             <img src="/back-icon.png" alt="Back" />
//           </button>
//           <button
//             className="edit-button icon-button"
//             onClick={() => navigate("/edit-profile")}
//           >
//             <img src="/edit-icon.png" alt="Edit" />
//           </button>
//           <div className="user-info">
//             <div className="avatar">
//             <img src='/avater.png' className='profile-picture' alt='Profile' />
//               {/* <img
//                 src={user.profile_picture || "/avatar.png"}
//                 className="profile-picture"
//                 alt="Profile"
//               /> */}
//             </div>
//             <h1 className="user-name">{fullName}</h1>
//           </div>

//           {/* User Information */}
//           <div className="details-container">
//             <p>User Information</p>
//             <ul className="user-details">
//               <li data-label="Name:">{fullName}</li>
//               <li data-label="Email:">{user.email}</li>
//               <li data-label="Username:">{user.username}</li>
//               <li data-label="Joined:">
//                 {new Date(user.createdAt).toLocaleDateString()}
//               </li>
//             </ul>
//           </div>

//           {/* Account Settings */}
//           <div className="details-container">
//             <p>Account Settings</p>
//             <ul className="user-details">
//               <li>Change Password</li>
//               <li>Update Email</li>
//               <li>Manage Two-Factor Authentication</li>
//             </ul>
//           </div>

//           {/* Notifications */}
//           <div className="details-container">
//             <p>Notifications</p>
//             <ul className="user-details">
//               <li>Email Notifications</li>
//               <li>Push Notifications</li>
//               <li>SMS Notifications</li>
//             </ul>
//           </div>

//           {/* Privacy */}
//           <div className="details-container">
//             <p>Privacy</p>
//             <ul className="user-details">
//               <li>Manage Blocked Users</li>
//               <li>Privacy Settings</li>
//               <li>Data Sharing Preferences</li>
//             </ul>
//           </div>

//           {/* Data & Storage */}
//           <div className="details-container">
//             <p>Data & Storage</p>
//             <ul className="user-details">
//               <li>Data Usage</li>
//               <li>Storage Space</li>
//               <li>Download Your Data</li>
//             </ul>
//           </div>

//           <div className="details-container">
//             <p>Appearance</p>
//             <ul className="user-details">
//               <li>
//                 Theme:
//                 <button
//                   className={`theme-icon-action-button ${rotateClass}`}
//                   onClick={toggleDarkMode}
//                 >
//                   <img
//                     src={darkMode ? "/moon.ico" : "/sun.ico"}
//                     alt="Theme Icon"
//                     className="theme-icon"
//                   />
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </>
//       )}
//       <div className="actions">
//         <button className="action-button" onClick={openLogoutModal}>
//           Logout
//         </button>
//       </div>
//       {showLogoutModal && (
//         <div className="logout-modal">
//           <div className="logout-modal-content">
//             <p>Are you sure you want to logout?</p>
//             <div className="modal-actions">
//               <button
//                 className="modal-cancel-button"
//                 onClick={closeLogoutModal}
//               >
//                 Cancel
//               </button>
//               <button className="modal-logout-button" onClick={handleLogout}>
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </div>
//   );
// }

// export default UserProfile;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/ReactToastify";
import { ToastContainer } from "react-toastify";
import "../utils/ReactToastifyCustom.css";
import "../utils/style/profile.css";

function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rotate, setRotate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/Users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result);
      } else {
        handleError(result.message || "Failed to fetch user data. Please try again.");
        navigate("/login");
      }
    } catch (err) {
      handleError("Network error. Please check your connection and try again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

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
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setRotate(true);
    setTimeout(() => setRotate(false), 500); // Adjust timing as needed
  };

  const rotateClass = rotate ? (darkMode ? "rotate-right" : "rotate-left") : "";

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`;

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
      {loading ? (
        <div className="loading-overlay">
          <img
            src="/apple-loading.gif"
            alt="Loading..."
            className="loading-spinner"
          />
        </div>
      ) : (
        <>
          <button
            className="back-button icon-button"
            onClick={() => navigate(-1)}
          >
            <img src="/back-icon.png" alt="Back" />
          </button>
          <button
            className="edit-button icon-button"
            onClick={() => navigate("/edit-profile")}
          >
            <img src="/edit-icon.png" alt="Edit" />
          </button>
          <div className="user-info">
            <div className="avatar">
              <img src='/avater.png' className='profile-picture' alt='Profile' />
              {/* <img
                src={user.profile_picture || "/avatar.png"}
                className="profile-picture"
                alt="Profile"
              /> */}
            </div>
            <h1 className="user-name">{fullName}</h1>
          </div>

          {/* User Information */}
          <div className="details-container">
            <p>User Information</p>
            <ul className="user-details">
              <li data-label="Name:">{fullName}</li>
              <li data-label="Email:">{user.email}</li>
              <li data-label="Username:">{user.username}</li>
              <li data-label="Joined:">
                {new Date(user.createdAt).toLocaleDateString()}
              </li>
            </ul>
          </div>

          {/* Account Settings */}
          <div className="details-container">
            <p>Account Settings</p>
            <ul className="user-details">
              <li>Change Password</li>
              <li>Update Email</li>
              <li>Manage Two-Factor Authentication</li>
              <li>Change Security Questions</li>
              <li>Connected Accounts</li>
              <li>Account Activity</li>
            </ul>
          </div>

          {/* Notifications */}
          <div className="details-container">
            <p>Notifications</p>
            <ul className="user-details">
              <li>Email Notifications</li>
              <li>Push Notifications</li>
              <li>SMS Notifications</li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="details-container">
            <p>Privacy</p>
            <ul className="user-details">
              <li>Manage Blocked Users</li>
              <li>Privacy Settings</li>
              <li>Data Sharing Preferences</li>
            </ul>
          </div>

          {/* Data & Storage */}
          <div className="details-container">
            <p>Data & Storage</p>
            <ul className="user-details">
              <li>Data Usage</li>
              <li>Storage Space</li>
              <li>Download Your Data</li>
            </ul>
          </div>

          <div className="details-container">
            <p>Appearance</p>
            <ul className="user-details">
              <li>
                Theme:
                <button
                  className={`theme-icon-action-button ${rotateClass}`}
                  onClick={toggleDarkMode}
                >
                  <img
                    src={darkMode ? "/moon.ico" : "/sun.ico"}
                    alt="Theme Icon"
                    className="theme-icon"
                  />
                </button>
              </li> 
            </ul>
          </div>
        </> 
      )} 
      <div className="actions">
        <button className="action-button" onClick={openLogoutModal}>
          Logout
        </button>
      </div>
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button
                className="modal-cancel-button"
                onClick={closeLogoutModal} 
              >
                Cancel
              </button>
              <button className="modal-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserProfile;
