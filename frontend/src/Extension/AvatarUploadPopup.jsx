import React, { useState, useRef } from "react";
import "../assets/style/ExtensionStyle/AvatarUploadPopup.css";
import { uploadAvatar, deleteAvatar } from "../utils/ApiService"; 
import LoadingOverlay from "../components/LoadingOverlay";
import { handleError } from "../utils/ReactToastify"; // Import handleError

const AvatarUploadPopup = ({ onClose, onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const { url, message } = await uploadAvatar(file);
        onUploadSuccess(url, message); // Pass the new URL and message
        onClose();
      } catch (error) {
        handleError("Upload failed. Please try again."); // Show error message
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    try {
      await deleteAvatar();
      onUploadSuccess(); // Pass null or a default URL if needed
      onClose();
    } catch (error) {
      handleError("Error removing avatar. Please try again."); // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avatar-upload-popup-overlay">
      <div className="avatar-upload-popup">
        <LoadingOverlay loading={loading} />
        <p className="popup-title">Change Avatar</p>
        <div className="popup-options">
          <button className="popup-option-button upload-button" onClick={handleUploadClick}>
            Upload
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            ref={fileInputRef}
            style={{ display: "none" }} 
          />
          <button className="popup-option-button remove-button" onClick={handleRemoveAvatar}>
            Remove Avatar
          </button>
          <button className="popup-option-button cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadPopup;