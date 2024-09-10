import React, { useState, useRef, useEffect } from "react";

const OtpInput = ({
  length = 6,
  onOtpSubmit = () => {},
  onOtpComplete = () => {},
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    onOtpComplete(otp.every((value) => value !== ""));
  }, [otp, onOtpComplete]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value) || value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value; // Directly replace the value
    setOtp(newOtp);

    // Focus on the next input field if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      onOtpSubmit(newOtp.join(""));
    }
  };

  const moveCursorToEnd = (inputElement) => {
    if (inputElement) {
      const length = inputElement.value.length;
      inputElement.setSelectionRange(length, length);
      inputElement.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      // Move focus to the previous input if the current one is empty
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        moveCursorToEnd(inputRefs.current[index - 1]);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Move focus to the previous input field
      if (index > 0) {
        inputRefs.current[index - 1].focus();
        setTimeout(() => moveCursorToEnd(inputRefs.current[index - 1]), 0);
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      // Move focus to the next input field
      if (index < length - 1) {
        inputRefs.current[index + 1].focus();
        setTimeout(() => moveCursorToEnd(inputRefs.current[index + 1]), 0);
      }
    } else if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      if (e.shiftKey && index > 0) {
        inputRefs.current[index - 1].focus();
        moveCursorToEnd(inputRefs.current[index - 1]);
      } else if (!e.shiftKey && index < length - 1) {
        inputRefs.current[index + 1].focus();
        moveCursorToEnd(inputRefs.current[index + 1]);
      }
    } else if (e.key === "Enter") {
      // Move focus to the next input field or trigger submission
      if (index < length - 1) {
        inputRefs.current[index + 1].focus();
        setTimeout(() => moveCursorToEnd(inputRefs.current[index + 1]), 0);
      } else if (index === length - 1 && otp.every((value) => value !== "")) {
        onOtpSubmit(otp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length)
      .split("");

    const newOtp = [...otp];
    pasteData.forEach((digit, i) => {
      newOtp[i] = digit;
      inputRefs.current[i].value = digit;
    });

    setOtp(newOtp);
    if (pasteData.length === length) {
      onOtpSubmit(newOtp.join(""));
      setTimeout(() => moveCursorToEnd(inputRefs.current[length - 1]), 0);
    } else {
      const nextIndex = Math.min(pasteData.length, length - 1);
      setTimeout(() => moveCursorToEnd(inputRefs.current[nextIndex]), 0);
    }
  };

  const handleClick = (index) => {
    const input = inputRefs.current[index];
    const length = input.value.length;
    
    // Focus on the clicked input field and set cursor position
    input.focus();
    input.setSelectionRange(length, length); // Keep the cursor at the end without selecting the value
  };

  return (
    <div className="otp-input-wrapper">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => (inputRefs.current[index] = input)}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(e)}
          onClick={() => handleClick(index)}
          className="otpField"
          maxLength={1}
          inputMode="numeric"
          autoComplete="off" // Disable autocomplete/suggestions
        />
      ))}
    </div>
  );
};

export default OtpInput;
