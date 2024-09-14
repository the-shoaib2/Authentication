import React from 'react';
import '../../../assets/style/ServicesStyle/ChatServicesStyle/ConfirmationPopup.css';

const ConfirmationPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup-container">
      <div className="confirmation-popup">
        <p>Are you sure you want to unsend this message?</p>
        <div className="confirmation-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Unsend</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
