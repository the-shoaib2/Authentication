import React from 'react';
import '../assets/style/ServiceCard.css';

function ServiceCard({ name, icon }) {
    return (
        <div className="service-card">
            <img src={`/images/icon/${icon}`} alt={name} className="service-icon" />
            <h3 className="service-name">{name}</h3>
        </div>
    );
}

export default ServiceCard;
