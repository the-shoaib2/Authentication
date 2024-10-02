import React from 'react';
import '../assets/style/PagesStyle/AgreementStyle/AgreementPopup.css';

const Popup = ({ title, content, onClose }) => {
    return (
        <div className="popup-overlay "> 
            <div className="popup-content ">
                <button className="close-button" onClick={onClose}>
                    <i className="fa fa-times close-icon" aria-hidden="true"></i>
                </button>
                <div>{content}</div>
            </div>
        </div>
    );
};

export default Popup;
