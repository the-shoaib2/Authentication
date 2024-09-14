import React, { useState, useRef, useEffect } from "react";
import "../../../assets/style/ServicesStyle/ChatServicesStyle/MessageInput.css";

const MAX_CHARS = 5000;

const MessageInput = ({ onSendMessage, onSendFile }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const photoVideoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARS) {
      setMessage(inputValue);
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 100) {
      alert('You can only select up to 100 files at once.');
      return;
    }
    files.forEach(file => {
      onSendFile(file);
    });
  };

  const handlePhotoVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      onSendFile(file);
    } else {
      alert('Please select a valid image or video file.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualization(stream);
      startTimer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopVisualization();
      stopTimer();
    }
  };

  const startVisualization = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    visualize();
  };

  const stopVisualization = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const visualize = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  const startTimer = () => {
    setRecordingDuration(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordingDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setRecordingDuration(0);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCancel = () => {
    setAudioURL(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSendAudio = () => {
    if (audioURL) {
      fetch(audioURL)
        .then(res => res.blob())
        .then(blob => {
          const audioFile = new File([blob], "audio_message.wav", { type: 'audio/wav' });
          onSendFile(audioFile);
          handleCancel();
        });
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "5px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  useEffect(() => {
    return () => {
      stopVisualization();
      stopTimer();
    };
  }, []);

  return (
    <div className={`mi-container ${isFocused ? "mi-focused" : ""}`}>
      <div className="mi-input-container-with-buttons">
        <button
          className="mi-document-btn"
          id="mi-add-document"
          onClick={() => fileInputRef.current.click()}
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

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          multiple
        />

        <input
          type="file"
          ref={photoVideoInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoVideoUpload}
          accept="image/*,video/*"
        />

        <button 
          className="mi-camera-btn" 
          title="Upload Photo/Video"
          onClick={() => photoVideoInputRef.current.click()}
        >
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

        {isRecording || audioURL ? (
          <div className="mi-recording-container">
            <canvas ref={canvasRef} className="mi-waveform" width="200" height="50" />
            <span className="mi-recording-duration">{formatDuration(recordingDuration)}</span>
            {isRecording ? (
              <button className="btn btn-link mi-stop-recording" onClick={stopRecording}>
                <img src="/images/icon/pause-circle-fill.svg" alt="Stop" width="24" height="24" />
              </button>
            ) : (
              <>
                <audio ref={audioRef} src={audioURL} style={{ display: 'none' }} />
                <button className="btn btn-link mi-audio-control" onClick={handlePlayPause}>
                  <img 
                    src={isPlaying ? "/images/icon/pause-circle-fill.svg" : "/images/icon/play-circle-fill.svg"} 
                    alt={isPlaying ? "Pause" : "Play"} 
                    width="24" 
                    height="24" 
                  />
                </button>
                <button className="btn btn-link mi-audio-cancel" onClick={handleCancel}>
                  <img src="/images/icon/x-circle-fill.svg" alt="Cancel" width="24" height="24" />
                </button>
              </>
            )}
          </div>
        ) : (
          <button 
            className="mi-mic-btn" 
            title="Start Recording"
            onClick={startRecording}
          >
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
        )}

        <div className={`mi-input-wrapper ${!message.trim() ? "mi-empty" : ""}`}>
          <textarea
            ref={textareaRef}
            id="mi-message-input"
            className="mi-message-input"
            placeholder="Aa.."
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
            !message.trim() && !audioURL ? "mi-deactivated" : ""
          }`}
          id="mi-generate-send-btn"
          title="Send Message"
          onClick={audioURL ? handleSendAudio : handleSendMessage}
          disabled={!message.trim() && !audioURL}
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
