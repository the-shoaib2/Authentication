import React from 'react';

function ServicesSection({ userName }) {
  return (
    <div className="services-section">
      <h1 className="user-name">{userName}</h1>
      <div className="top-services-main-container">
        <div className="top-services-container">
          <label className="services-level">Chat</label>
        </div>
        <div className="top-services-container">
          <label className="services-level">AI</label>
        </div>
        <div className="top-services-container">
          <label className="services-level">AI</label>
        </div>
        <div className="top-services-container">
          <label className="services-level">AI</label>
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
