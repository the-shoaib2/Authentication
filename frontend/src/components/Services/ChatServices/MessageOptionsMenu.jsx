import React, { useState, useEffect, useRef } from 'react';
import "../../../assets/style/ServicesStyle/ChatServicesStyle/MessageOptionsMenu.css";
import ConfirmationPopup from './ConfirmationPopup';
import ForwardPopup from './ForwardPopup';

const MessageOptions = ({ message, onReply, onCopy, onUnsendForMe, onForward, onBump, onPin, onMore, showMoreOptions, setShowMoreOptions }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUnsendForMe = (e) => {
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const handleConfirmUnsend = () => {
    onUnsendForMe();
    setShowConfirmation(false);
  };

  const handleCancelUnsend = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className={`message-options ${showMoreOptions ? 'show-more' : ''}`}>
        <div className="options-main">
          <button onClick={(e) => onReply(e)}>Reply</button>
          <button onClick={(e) => onCopy(e)}>Copy</button>
          <button onClick={handleUnsendForMe}>Unsend for me</button>
          <button className="more-button" onClick={() => setShowMoreOptions(true)}>More</button>
        </div>
        <div className="options-more">
          <button onClick={(e) => onForward(e)}>Forward</button>
          <button onClick={(e) => onBump(e)}>Bump</button>
          <button onClick={(e) => onPin(e)}>Pin</button>
          <button onClick={() => setShowMoreOptions(false)}>Back</button>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationPopup
          message={message}
          onConfirm={handleConfirmUnsend}
          onCancel={handleCancelUnsend}
        />
      )}
    </>
  );
};

const MessageOptionsMenu = ({ message, isMobile, onOptionClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const optionsRef = useRef(null);

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(prev => !prev);
  };

  const handleOptionClick = (e, option) => {
    e.stopPropagation();
    if (option === 'unsendForMe') {
      // Don't close the menu, let the confirmation handle it
      return;
    }
    if (option === 'forward') {
      setShowForwardPopup(true);
      setShowOptions(false);
      setShowMoreOptions(false);
      return;
    }
    onOptionClick(option, message);
    if (option !== 'more') {
      setShowOptions(false);
      setShowMoreOptions(false);
    }
  };

  const handleForwardConfirm = (selectedUsers) => {
    onOptionClick('forward', message, selectedUsers);
    setShowForwardPopup(false);
  };

  const handleForwardCancel = () => {
    setShowForwardPopup(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isUserMessage = message.sender === "user";

  return (
    <div className={`message-options-container ${isUserMessage ? 'user-message' : 'other-message'}`} ref={optionsRef}>
      <div className="message-content-wrapper">
        {/* Your message content goes here */}
        <div className="message-options-toggle-wrapper">
          {!isMobile && (
            <button 
              className={`message-options-toggle ${isUserMessage ? 'current-user' : 'other-user'}`}
              onClick={toggleOptions}
            >
              ⋮
            </button>
          )}
        </div>
      </div>
      {showOptions && (
        <MessageOptions
          message={message}
          onReply={(e) => handleOptionClick(e, 'reply')}
          onCopy={(e) => handleOptionClick(e, 'copy')}
          onUnsendForMe={(e) => handleOptionClick(e, 'unsendForMe')}
          onForward={(e) => handleOptionClick(e, 'forward')}
          onBump={(e) => handleOptionClick(e, 'bump')}
          onPin={(e) => handleOptionClick(e, 'pin')}
          onMore={(e) => handleOptionClick(e, 'more')}
          showMoreOptions={showMoreOptions}
          setShowMoreOptions={setShowMoreOptions}
        />
      )}
      {showForwardPopup && (
        <ForwardPopup
          users={[]} // You need to provide the list of users here
          onConfirm={handleForwardConfirm}
          onCancel={handleForwardCancel}
        />
      )}
    </div>
  );
};

export default MessageOptionsMenu;
