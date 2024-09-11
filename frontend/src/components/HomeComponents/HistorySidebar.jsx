import React from 'react';
import '../../assets/style/PagesStyle/Home/HistorySidebar.css';

function HistorySidebar({ show, onClose }) {
  return (
    <div className={`history-sidebar ${show ? 'show' : ''}`}>
      <button className="close-sidebar" onClick={onClose}></button>
      <h2>History</h2>
      <ul className="history-list">
        <li>History Item 1</li>
        <li>History Item 2</li>
        <li>History Item 3</li>
        {/* Add more history items as needed */}
      </ul>
    </div>
  );
}

export default HistorySidebar;
