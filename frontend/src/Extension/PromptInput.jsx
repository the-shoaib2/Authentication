
import React, { useState, useRef, useEffect } from "react";
import "../assets/style/ExtensionStyle/PromptInput.css";

const MAX_CHARS = 5000;

const PromptInput = () => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isGenerateMode, setIsGenerateMode] = useState(true);
  const textareaRef = useRef(null);

  const handleSendMessage = () => {
    console.log("Sending message:", message);
    setMessage("");
    setIsGenerateMode(true);
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
    <div className={`prompt-container ${isFocused ? "focused" : ""}`}>
      <div className="prompt-input-wrapper">
        <div className="document-btn-wrapper">
          <button
            className="document-btn"
            id="add-document"
            onClick={toggleOptions}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5E5CE6" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg>
          </button>
          {showOptions && (
            <div className="document-options">
              <button className="option-btn" title="Camera">
                <img src="/images/icon/camera-fill.svg" alt="Camera" />
              </button>
              <button className="option-btn" title="Photos">
                <img src="/images/icon/image-fill.svg" alt="Photos" />
              </button>
              <button className="option-btn" title="File">
                <img src="/images/icon/file-earmark-fill.svg" alt="File" />
              </button>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          id="message-input"
          className="message-input"
          placeholder="Enter prompt.."
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

        <button
          className={`generate-send-btn ${!message.trim() ? 'deactivated' : ''}`}
          id="generate-send-btn"
          title={message.trim() ? "Send Message" : "Generate"}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
          </svg>
        </button>
      </div>
      <div className="char-count">
        {message.length}/{MAX_CHARS}
      </div>
    </div>
  );
};

export default PromptInput;
