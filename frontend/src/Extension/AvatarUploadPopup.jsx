import React, { useState, useRef } from "react";
import "../assets/style/ExtensionStyle/AvatarUploadPopup.css";
import { uploadAvatar, deleteAvatar } from "../utils/ApiService"; 
import LoadingOverlay from "../components/LoadingOverlay";

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
        const newAvatarUrl = await uploadAvatar(file);
        onUploadSuccess(newAvatarUrl); // Pass the new URL
        onClose();
      } catch (error) {
        console.error("Upload failed:", error);
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
      console.error("Error removing avatar:", error);
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
