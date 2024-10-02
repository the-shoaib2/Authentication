import React from "react";
import "../../../assets/style/ServicesStyle/ChatServicesStyle/ChatList.css";

const ChatList = ({ selectedUser, handleUserSelect }) => {
  return (
    <div className="chat-sidebar">

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
            status: "seen",
          },
          {
            id: 2,
            name: "Jane Smith",
            lastMessage: "Can we meet tomorrow?",
            time: "Yesterday",
            avatar: "/images/avatar/avatar-Bob.png",
            unread: 0,
            active: false,
            status: "delivered",
          },
          {
            id: 3,
            name: "Bob Johnson",
            lastMessage: "Thanks for your help!",
            time: "2 days ago",
            avatar: "/images/avatar/avatar-Charlie.png",
            unread: 5,
            active: true,
            status: "sent",
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
                  <span
                    className={`chat-name ${user.unread > 0 ? "unread" : ""}`}
                  >
                    {user.name}
                  </span>
                  <span className="chat-time">{user.time}</span>
                </div>
                <div className="chat-footer">
                  <span className="chat-last-message">
                    {user.status && (
                      <span className={`message-status ${user.status}`}>
                        {user.status === "seen" ? (
                          <img
                            src={user.avatar}
                            alt={`${user.name} avatar`}
                            className="seen-avatar"
                          />
                        ) : user.status === "delivered" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                          </svg>
                        )}
                      </span>
                    )}
                    {user.lastMessage}
                  </span>
                  {user.unread > 0 && (
                    <span className="unread-badge">{user.unread}</span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
