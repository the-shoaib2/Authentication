import React from 'react';
import "../../../assets/style/ServicesStyle/ChatServicesStyle/MessageReactions.css";
import { LikeIcon, LoveIcon, LaughingIcon, WowIcon, SadIcon, AngryIcon } from './ReactionIcons';

const MessageReactions = ({
  messageId,
  reaction,
  isOpen,
  onReaction,
  onToggleReactionMenu,
  isCurrentUser,
}) => {
  const getReactionIcon = (reactionType) => {
    switch (reactionType) {
      case "like":
        return <LikeIcon />;
      case "love":
        return <LoveIcon />;
      case "laughing":
        return <LaughingIcon />;
      case "wow":
        return <WowIcon />;
      case "sad":
        return <SadIcon />;
      case "angry":
        return <AngryIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={`message-reaction-container ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      {reaction ? (
        <span
          className="reaction"
          onClick={() => onToggleReactionMenu(messageId)}
        >
          {getReactionIcon(reaction)}
        </span>
      ) : (
        <button
          onClick={() => onToggleReactionMenu(messageId)}
          className="add-reaction-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="reaction-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
      )}
      {isOpen && (
        <div className="reaction-menu">
          <button
            onClick={() => onReaction(messageId, "like")}
            className="reaction-btn"
          >
            <LikeIcon />
          </button>
          <button
            onClick={() => onReaction(messageId, "love")}
            className="reaction-btn"
          >
            <LoveIcon />
          </button>
          <button
            onClick={() => onReaction(messageId, "laughing")}
            className="reaction-btn"
          >
            <LaughingIcon />
          </button>
          <button
            onClick={() => onReaction(messageId, "wow")}
            className="reaction-btn"
          >
            <WowIcon />
          </button>
          <button
            onClick={() => onReaction(messageId, "sad")}
            className="reaction-btn"
          >
            <SadIcon />
          </button>
          <button
            onClick={() => onReaction(messageId, "angry")}
            className="reaction-btn"
          >
            <AngryIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageReactions;
