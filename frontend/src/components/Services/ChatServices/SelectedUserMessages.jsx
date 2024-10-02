import React, { useState, useEffect, useCallback, useRef } from 'react';
import MessageReactions from './MessageReactions';
import MessageOptionsMenu from './MessageOptionsMenu';
import ConfirmationPopup from './ConfirmationPopup';
import '../../../assets/style/ServicesStyle/ChatServicesStyle/SelectedUserMessages.css';
import { FaFile } from 'react-icons/fa'; 

const SelectedUserMessages = ({ selectedUser, messages, formatTime, reactions, openReactionMenuId, handleReaction, toggleReactionMenu, onEditMessage }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageToUnsend, setMessageToUnsend] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOptionClick = (option, message) => {
    console.log(`${option} clicked for message:`, message);
    
    if (option === 'edit') {
      setEditingMessageId(message.id);
    } else if (option === 'unsendForMe') {
      handleUnsendForMe(message);
    } else {
      // Implement the logic for other options here
    }
  };

  const handleEditSubmit = (messageId, newText) => {
    onEditMessage(messageId, newText);
    setEditingMessageId(null);
  };

  const handleUnsendForMe = (message) => {
    setMessageToUnsend(message);
    setShowConfirmation(true);
  };

  const handleConfirmUnsend = () => {
    if (messageToUnsend) {
      // Perform the actual unsend action here
      // This could be a call to an API or updating local state
      console.log(`Unsending message: ${messageToUnsend.id}`);
    }
    setShowConfirmation(false);
    setMessageToUnsend(null);
  };

  const handleCancelUnsend = () => {
    setShowConfirmation(false);
    setMessageToUnsend(null);
  };

  const renderMessageGroups = useCallback(() => {
    if (!selectedUser || !messages[selectedUser.id] || messages[selectedUser.id].length === 0) {
      return null;
    }

    return (
      <>
        {messages[selectedUser.id]
          .reduce((groups, msg, index, array) => {
            const prevMsg = array[index - 1];
            const timeDiff = prevMsg ? msg.timestamp - prevMsg.timestamp : Infinity;
            const isNewGroup =
              !prevMsg || timeDiff > 30000 || prevMsg.sender !== msg.sender;

            if (isNewGroup) {
              groups.push([msg]);
            } else {
              groups[groups.length - 1].push(msg);
            }
            return groups;
          }, [])
          .map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`message-group ${
                group[0].sender === "user" ? "user-group" : "other-group"
              }`}
            >
              <div className="message-timestamp-center">
                {formatTime(group[0].timestamp)}
              </div>
              <div className="message-group-content">
                {group[0].sender !== "user" && (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="message-avatar"
                  />
                )}
                <div className="message-bubble-group">
                  {group.map((msg, msgIndex) => (
                    <div
                      key={msgIndex}
                      className="message-bubble"
                    >
                      {editingMessageId === msg.id ? (
                        <EditMessageForm
                          message={msg}
                          onSubmit={(newText) => handleEditSubmit(msg.id, newText)}
                          onCancel={() => setEditingMessageId(null)}
                        />
                      ) : (
                        <>
                          {msg.type === "text" && (
                            <div className="message-content">{msg.text}</div>
                          )}
                          {msg.type === "image" && (
                            <img
                              src={URL.createObjectURL(msg.file)}
                              alt="Sent image"
                              className="message-image"
                            />
                          )}
                          {msg.type === "video" && (
                            <video
                              src={URL.createObjectURL(msg.file)}
                              className="message-video"
                              controls
                            />
                          )}
                          {msg.type === "file" && (
                            <div className="message-file">
                              <a
                                href={URL.createObjectURL(msg.file)}
                                download={msg.file.name}
                                title={msg.file.name}
                              >
                                <FaFile className="message-file-icon" />
                                <span className="message-file-name">{msg.file.name}</span>
                              </a>
                            </div>
                          )}
                          <MessageReactions
                            messageId={msg.id}
                            reaction={reactions[msg.id]}
                            isOpen={openReactionMenuId === msg.id}
                            onReaction={handleReaction}
                            onToggleReactionMenu={toggleReactionMenu}
                            isCurrentUser={msg.sender === "user"}
                          />
                          {!isMobile && (
                            <MessageOptionsMenu
                              message={msg}
                              isMobile={isMobile}
                              onOptionClick={(option) => handleOptionClick(option, msg)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message status displayed below the message bubble */}
              {group[group.length - 1].sender === "user" && (
                <div className="message-status">
                  {group[group.length - 1].status === "sent" && <span>Sent</span>}
                  {group[group.length - 1].status === "delivered" && <span>Delivered</span>}
                  {group[group.length - 1].status === "seen" && (
                    <div className="seen-status">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="seen-avatar"
                      />
                      <span className="seen-text">Seen</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </>
    );
  }, [messages, selectedUser, formatTime, reactions, openReactionMenuId, handleReaction, toggleReactionMenu, isMobile, editingMessageId]);

  return (
    <div className="chat-messages-container">
      {renderMessageGroups()}
      {showConfirmation && (
        <ConfirmationPopup
          onConfirm={handleConfirmUnsend}
          onCancel={handleCancelUnsend}
          message="Are you sure you want to unsend this message?"
        />
      )}
    </div>
  );
};


const EditMessageForm = ({ message, onSubmit, onCancel }) => {
  const [editedText, setEditedText] = useState(message.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedText);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-message-form">
      <input
        type="text"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        autoFocus
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default SelectedUserMessages;
