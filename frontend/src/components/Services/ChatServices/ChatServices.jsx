import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../../assets/style/ServicesStyle/ChatServicesStyle/ChatService.css";
import MessageInput from "./MessageInput";
import StarIcon from "../../StarIcon";

const ChatService = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);

  const updateMessageStatus = useCallback(
    (messageObj, newStatus) => {
      if (selectedUser) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser.id]: prevMessages[selectedUser.id].map((msg) =>
            msg === messageObj ? { ...msg, status: newStatus } : msg
          ),
        }));
      }
    },
    [selectedUser]
  );

  const handleSendMessage = useCallback(
    (newMessage) => {
      if (newMessage.trim() && selectedUser) {
        const newMessageObj = {
          text: newMessage,
          sender: "user",
          timestamp: new Date(),
          status: "sent",
          type: "text",
        };
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser.id]: [
            ...(prevMessages[selectedUser.id] || []),
            newMessageObj,
          ],
        }));

        // Simulate message status changes
        setTimeout(() => updateMessageStatus(newMessageObj, "delivered"), 1000);
        setTimeout(() => updateMessageStatus(newMessageObj, "seen"), 2000);
      }
    },
    [selectedUser, updateMessageStatus]
  );

  const handleSendFile = useCallback(
    (file) => {
      if (file && selectedUser) {
        const newMessageObj = {
          file: file,
          sender: "user",
          timestamp: new Date(),
          status: "sent",
          type: file.type.startsWith("image/") ? "image" : "file",
        };
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser.id]: [
            ...(prevMessages[selectedUser.id] || []),
            newMessageObj,
          ],
        }));

        // Simulate message status changes
        setTimeout(() => updateMessageStatus(newMessageObj, "delivered"), 1000);
        setTimeout(() => updateMessageStatus(newMessageObj, "seen"), 2000);
      }
    },
    [selectedUser, updateMessageStatus]
  );

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    setMessages((prevMessages) => {
      if (!prevMessages[user.id]) {
        return {
          ...prevMessages,
          [user.id]: [
            {
              text: `Hey there! This is a demo message for ${user.name}.`,
              sender: "other",
              timestamp: new Date(Date.now() - 1000000),
              status: "seen",
              type: "text",
            },
            {
              text: "How can I help you today?",
              sender: "other",
              timestamp: new Date(Date.now() - 500000),
              status: "seen",
              type: "text",
            },
          ],
        };
      }
      return prevMessages;
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const renderChatList = useCallback(
    () => (
      <ul className="chat-list">
        {[
          {
            id: 1,
            name: "John Doe",
            lastMessage: "Hey, how are you?",
            time: "2:30 PM",
            avatar: "/images/avatar/avatar-Alice.png",
            unread: 2,
            active: true,
          },
          {
            id: 2,
            name: "Jane Smith",
            lastMessage: "Can we meet tomorrow?",
            time: "Yesterday",
            avatar: "/images/avatar/avatar-Bob.png",
            unread: 0,
            active: false,
          },
          {
            id: 3,
            name: "Bob Johnson",
            lastMessage: "Thanks for your help!",
            time: "2 days ago",
            avatar: "/images/avatar/avatar-Charlie.png",
            unread: 5,
            active: true,
          },
        ].map((user) => (
          <li
            key={user.id}
            className={`chat-list-item ${
              selectedUser?.id === user.id ? "active" : ""
            }`}
            onClick={() => handleUserSelect(user)}
          >
            <div className="chat-item-content">
              <div className="avatar-container">
                <img
                  src={user.avatar}
                  alt={user.name}
                  
                  className="chat-avatar"
                />
                
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{user.name}</span>
                  <span className="chat-time">{user.time}</span>
                </div>
                <div className="chat-footer">
                  <span className="chat-last-message">{user.lastMessage}</span>
                  {user.unread > 0 && (
                    <span className="unread-badge">{user.unread}</span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ),
    [selectedUser, handleUserSelect]
  );

  const renderMessageGroups = useCallback(() => {
    if (!selectedUser || !messages[selectedUser.id]) {
      return null;
    }

    return messages[selectedUser.id]
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
                <div key={msgIndex} className="message-bubble">
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
                  {msg.type === "file" && (
                    <div className="message-file">
                      <a
                        href={URL.createObjectURL(msg.file)}
                        download={msg.file.name}
                      >
                        {msg.file.name}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message status displayed below the message bubble */}
          {group[group.length - 1].sender === "user" && (
            <div className="message-status">
              {group[group.length - 1].status === "sent" && <span>sent</span>}
              {group[group.length - 1].status === "delivered" && (
                <span>delivered</span>
              )}
              {group[group.length - 1].status === "seen" && (
                <div className="seen-status">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="seen-avatar"
                  />
                  <span className="seen-text"></span>
                </div>
              )}
            </div>
          )}
        </div>
      ));
  }, [messages, selectedUser, formatTime]);

  return (
    <div className="chat-container-main-wrapper">
      <div className="chat-sidebar">
        <div className="chat-header-top-bar">
          <input type="text" className="user-search-bar" placeholder="Search" />
        </div>
        {renderChatList()}
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
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
      
                  {selectedUser.active && <div className="active-status"></div>}

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

            <div className="chat-messages-container">
              {renderMessageGroups()}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
              />
            </div>
          </>
        ) : (
          <div className="welcome-container">
            <StarIcon
              width={64}
              height={64}
              fill="#5E5CE6"
              className="welcome-icon"
            />
            <h1 className="welcome-title">Hello...</h1>
            <p className="welcome-message">
              Connect with friends and colleagues in a secure environment.
              Select a user from the list to start chatting!
            </p>
            <div className="encryption-notice">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatService;
