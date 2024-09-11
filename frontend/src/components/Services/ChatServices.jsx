import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../assets/style/ServicesStyle/ChatService.css';
import MessageInput from '../../Extension/MessageInput';

const ChatService = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && selectedUser) {
      const newMessage = { 
        text: message, 
        sender: 'user', 
        timestamp: new Date(),
        status: 'sent' // Initial status
      };
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedUser.id]: [...(prevMessages[selectedUser.id] || []), newMessage]
      }));
      setMessage('');
      
      // Simulate message status changes
      setTimeout(() => updateMessageStatus(newMessage, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(newMessage, 'seen'), 2000);
    }
  }, [message, selectedUser]);

  const updateMessageStatus = (message, status) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedUser.id]: prevMessages[selectedUser.id].map(msg =>
        msg === message ? { ...msg, status } : msg
      )
    }));
  };

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedUser.id]: prevMessages[selectedUser.id] || [{
          text: "Hey there! This is a demo message.",
          sender: 'other',
          timestamp: new Date(),
          status: 'seen'
        }]
      }));
    }
  }, [selectedUser]);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const renderChatList = useCallback(() => (
    <ul className="chat-list">
      {[
        { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", time: "2:30 PM", avatar: "/images/avatar/avatar-Alice.png", unread: 2, active: true },
        { id: 2, name: "Jane Smith", lastMessage: "Can we meet tomorrow?", time: "Yesterday", avatar: "/images/avatar/avatar-Bob.png", unread: 0, active: false },
        { id: 3, name: "Bob Johnson", lastMessage: "Thanks for your help!", time: "2 days ago", avatar: "/images/avatar/avatar-Charlie.png", unread: 5, active: true }
      ].map((user) => (
        <li key={user.id} className={`chat-list-item ${selectedUser?.id === user.id ? 'active' : ''}`} onClick={() => handleUserSelect(user)}>
          <div className="chat-item-content">
            <div className="avatar-container">
              <img src={user.avatar} alt={user.name} className="chat-avatar" />
              {user.active && <div className="active-status"></div>}
            </div>
            <div className="chat-info">
              <div className="chat-header">
                <span className="chat-name">{user.name}</span>
                <span className="chat-time">{user.time}</span>
              </div>
              <div className="chat-footer">
                <span className="chat-last-message">{user.lastMessage}</span>
                {user.unread > 0 && <span className="unread-badge">{user.unread}</span>}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ), [selectedUser, handleUserSelect]);

  const renderMessageGroups = useCallback(() => (
    messages[selectedUser.id]?.reduce((groups, msg, index, array) => {
      const prevMsg = array[index - 1];
      const timeDiff = prevMsg ? msg.timestamp - prevMsg.timestamp : Infinity;
      const isNewGroup = !prevMsg || timeDiff > 30000 || prevMsg.sender !== msg.sender;
  
      if (isNewGroup) {
        groups.push([msg]);
      } else {
        groups[groups.length - 1].push(msg);
      }
      return groups;
    }, []).map((group, groupIndex) => (
      <div key={groupIndex} className={`message-group ${group[0].sender === 'user' ? 'user-group' : 'other-group'}`}>
        <div className="message-timestamp-center">
          {formatTime(group[0].timestamp)}
        </div>
        <div className='message-group-content'>
          {group[0].sender !== 'user' && (
            <img src={selectedUser.avatar} alt={selectedUser.name} className="message-avatar" />
          )}
          <div className="message-bubble-group">
            {group.map((msg, msgIndex) => (
              <div key={msgIndex} className="message-bubble">
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message status displayed below the message bubble */}
        {group[group.length - 1].sender === 'user' && (
          <div className="message-status">
            {group[group.length - 1].status === 'sent' && <span>sent</span>}
            {group[group.length - 1].status === 'delivered' && <span>delivered</span>}
            {group[group.length - 1].status === 'seen' && (
              <div className="seen-status">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="seen-avatar" />
                <span className="seen-text"></span>
              </div>
            )}
          </div>
        )}
      </div>
    ))
  ), [messages, selectedUser, formatTime]);
  

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
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="chat-avatar" />
                  {selectedUser.active && <div className="active-status"></div>}
                </div>
                <div className="massage-box-top-bar-user-info">
                  <p className="massage-box-top-bar-user-name">{selectedUser.name}</p>
                  {selectedUser.active && <p className="active-now">Active now</p>}
                </div>
              </div>
              <div className="call-buttons-container">
                <button className="icon-btn-video-call-btn" aria-label="Video Call">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M32 32.5c0 3.59-2.91 6.5-6.5 6.5h-15C6.91 39 4 36.09 4 32.5v-17C4 11.91 6.91 9 10.5 9h15c3.59 0 6.5 2.91 6.5 6.5V32.5zM43.239 13.195c-.47-.266-1.047-.259-1.511.019L34 17.851v12.298l7.729 4.637C41.966 34.929 42.232 35 42.5 35c.255 0 .51-.065.739-.195C43.709 34.539 44 34.041 44 33.5v-19C44 13.959 43.709 13.461 43.239 13.195z" />
                  </svg>
                </button>
                <button className="icon-btn-audio-call-btn" aria-label="Audio Call">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="chat-messages-container">
              {renderMessageGroups()}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-section">
              <div className="input-wrapper">
                <button className="attachment-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5E5CE6" viewBox="0 0 16 16">
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                  </svg>
                </button>
                <textarea
                  className="message-input"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                {message.trim() ? (
                  <button className="send-btn" onClick={handleSendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007AFF" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                    </svg>
                  </button>
                ) : (
                  <button className="voice-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5E5CE6" viewBox="0 0 16 16">
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                      <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#5E5CE6" viewBox="0 0 16 16">
              <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258a1.16 1.16 0 0 0 .732-.732l.258-.774z"/>
            </svg>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatService;