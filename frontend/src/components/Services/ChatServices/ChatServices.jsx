import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../../assets/style/ServicesStyle/ChatServicesStyle/ChatService.css";
import SelectedUserMessages from './SelectedUserMessages';
import MessageInput from "./MessageInput";
import ChatList from './ChatList';
import socketService from '../../../utils/socketService';
import WelcomeContainer from './WelcomeContainer';
import ChatHeader from './ChatHeader';
import ChatNavbar from './ChatNavbar';
import ActiveUsersList from './ActiveUsersList';
import FriendsList from './Friends/FriendsList';
import AddFriend from './Friends/AddFriend'; 

const ChatService = ({ onClose }) => {
  const navigate = useNavigate(); 
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);
  const [reactions, setReactions] = useState({});
  const [openReactionMenuId, setOpenReactionMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState('chatlist');
  const [loading, setLoading] = useState(true); // Assuming you have a loading state

  useEffect(() => {
    // Remove loading state when the component mounts
    setLoading(false);
  }, []);

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
          id: Date.now(),
        };
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser.id]: [
            ...(prevMessages[selectedUser.id] || []),
            newMessageObj,
          ],
        }));

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
          id: Date.now(),
        };
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser.id]: [
            ...(prevMessages[selectedUser.id] || []),
            newMessageObj,
          ],
        }));

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
              text: `Hii.`,
              sender: "other",
              timestamp: new Date(Date.now() - 1000000),
              status: "seen",
              type: "text",
              id: Date.now(),
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

  const handleReaction = useCallback((messageId, reaction) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [messageId]: reaction === prevReactions[messageId] ? null : reaction,
    }));
    setOpenReactionMenuId(null);
  }, []);

  const toggleReactionMenu = useCallback((messageId) => {
    setOpenReactionMenuId((prevId) => (prevId === messageId ? null : messageId));
  }, []);

  useEffect(() => {
    socketService.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketService.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socketService.off('connect');
      socketService.off('disconnect');
    };
  }, []);

  const handleClose = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="chat-container-main-wrapper fade-in"> 
      <button className="close-button" onClick={handleClose}>
        X
      </button>
      <div className="chat-sidebar">
        <div className="chat-header-top-bar">
          <input type="text" className="user-search-bar" placeholder="Search" />
        </div>
        <ChatNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'chatlist' && (
          <ChatList selectedUser={selectedUser} handleUserSelect={handleUserSelect} />
        )}
        {activeTab === 'activeusers' && <ActiveUsersList />}
        {activeTab === 'friends' && <FriendsList />}
        {activeTab === 'addfriends' && <AddFriend />}
      </div>
      
      <div className="chat-main">
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} />
            <SelectedUserMessages
              selectedUser={selectedUser}
              messages={messages}
              formatTime={formatTime}
              reactions={reactions}
              openReactionMenuId={openReactionMenuId}
              handleReaction={handleReaction}
              toggleReactionMenu={toggleReactionMenu}
            />
            <div className="chat-input-container">
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
              />
            </div>
          </>
        ) : (
          <WelcomeContainer />
        )}
      </div>
    </div>
  );
};

export default ChatService;