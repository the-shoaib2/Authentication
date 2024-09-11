import React from 'react';

function DetailsSection({ title, items, expanded, onToggle }) {
  return (
    <div className={`details-container ${expanded ? 'expanded' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <p>{title}</p>
        <span className="expand-icon">{expanded ? '−' : '+'}</span>
      </div>
      {expanded && (
        <div className="section-buttons">
          {items.map((item, index) => (
            <button key={index} className="section-button">{item}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DetailsSection;
