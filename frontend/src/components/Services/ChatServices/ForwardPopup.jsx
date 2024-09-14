import React, { useState } from 'react';
import '../../../assets/style/ServicesStyle/ChatServicesStyle/ForwardPopup.css';

const demoUsers = [
  { id: 1, name: 'John Doe', avatar: '/images/avatar/avatar-Charlie.png' },
  { id: 2, name: 'Jane Smith', avatar: '/images/avatar/avatar-Charlie.png' },
  { id: 3, name: 'Alice Johnson', avatar: '/images/avatar/avatar-Charlie.png' },
  { id: 4, name: 'Bob Williams', avatar: '/images/avatar/avatar-Charlie.png' },
  { id: 5, name: 'Eva Brown', avatar: '/images/avatar/avatar-Charlie.png' },
];

const ForwardPopup = ({ onConfirm, onCancel }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleUser = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedUsers);
  };

  const filteredUsers = demoUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="forward-message-popup-overlay">
      <div className="forward-message-popup-container">
        <h2 className="forward-message-popup-title">Forward Message</h2>
        <div className="forward-message-user-search-container">
          <input 
            type="text" 
            className="forward-message-user-search-input"
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="forward-message-chat-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="forward-message-chat-list-item">
              <div className="forward-message-chat-item-content">
                <div className="forward-message-avatar-container">
                  <img src={user.avatar} alt={user.name} className="forward-message-chat-avatar" />
                </div>
                <div className="forward-message-chat-info">
                  <span className="forward-message-chat-name">{user.name}</span>
                </div>
                <div className="forward-message-checkbox-container">
                  <input
                    type="checkbox"
                    id={`forward-message-user-${user.id}`}
                    className="forward-message-checkbox-input"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="forward-message-action-buttons">
          <button className="forward-message-cancel-button" onClick={onCancel}>Cancel</button>
          <button 
            className="forward-message-confirm-button" 
            onClick={handleConfirm} 
            disabled={selectedUsers.length === 0}
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardPopup;
