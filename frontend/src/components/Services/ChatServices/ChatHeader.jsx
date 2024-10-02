import React from 'react';
import '../../../assets/style/ServicesStyle/ChatServicesStyle/ChatHeader.css';

const ChatHeader = ({ selectedUser }) => {
  return (
    <div className="massage-box-chat-header">
      <div className="user-profile-section">
        <div className="avatar-container">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="chat-avatar"
          />
        </div>
        <div className="massage-box-top-bar-user-info">
          <p className="massage-box-top-bar-user-name">
            {selectedUser.name}
          </p>
          <div className="user-status">
            {selectedUser.active && (
              <p className="active-now ">Active now</p>
            )}

            {selectedUser.active && (
              <div className="active-status"></div>
            )}
          </div>
        </div>
      </div>
      <div className="call-buttons-container">
        <button
          className="icon-btn-video-call-btn"
          aria-label="Video Call"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 48 48"
          >
            <path d="M32 32.5c0 3.59-2.91 6.5-6.5 6.5h-15C6.91 39 4 36.09 4 32.5v-17C4 11.91 6.91 9 10.5 9h15c3.59 0 6.5 2.91 6.5 6.5V32.5zM43.239 13.195c-.47-.266-1.047-.259-1.511.019L34 17.851v12.298l7.729 4.637C41.966 34.929 42.232 35 42.5 35c.255 0 .51-.065.739-.195C43.709 34.539 44 34.041 44 33.5v-19C44 13.959 43.709 13.461 43.239 13.195z" />
          </svg>
        </button>
        <button
          className="icon-btn-audio-call-btn"
          aria-label="Audio Call"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
            />
          </svg>
        </button>
        <button
          className="icon-btn-user-info-btn"
          aria-label="User info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;