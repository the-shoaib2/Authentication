import React, { useState, useRef, useEffect } from "react";
import "../../../assets/style/ServicesStyle/ChatServicesStyle/MessageInput.css";

const MAX_CHARS = 5000;

const MessageInput = ({ onSendMessage, onSendFile }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isGenerateMode, setIsGenerateMode] = useState(true);
  const textareaRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setIsGenerateMode(true);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARS) {
      setMessage(inputValue);
      setIsGenerateMode(!inputValue.trim());
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "5px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className={`mi-container ${isFocused ? "mi-focused" : ""}`}>
      <div className="mi-input-container-with-buttons">
        <button
          className="mi-document-btn"
          id="mi-add-document"
          onClick={toggleOptions}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#5E5CE6"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
        </button>

        <button className="mi-camera-btn" title="Camera">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#5E5CE6"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
          </svg>
        </button>

        <button className="mi-mic-btn" title="Microphone">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#5E5CE6"
            viewBox="0 0 16 16"
          >
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>

        <div className={`mi-input-wrapper ${!message.trim() ? "mi-empty" : ""}`}>
          <textarea
            ref={textareaRef}
            id="mi-message-input"
            className="mi-message-input"
            placeholder="Enter message.."
            value={message}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </div>

        <button
          className={`mi-generate-send-btn ${
            !message.trim() ? "mi-deactivated" : ""
          }`}
          id="mi-generate-send-btn"
          title={message.trim() ? "Send Message" : "Generate"}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
