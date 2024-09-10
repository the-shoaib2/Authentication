// frontend/src/components/LoadingOverlay.jsx
import React from 'react';
import '../assets/style/styleutils/loading.css';

function LoadingOverlay({ loading, fadeOut }) {
    if (!loading) return null;

    return (
        <div className={`loading-overlay ${fadeOut ? 'hidden' : ''}`}>
            <img src='/images/icon/apple-loading.gif' alt='Loading...' className='loading-spinner' />
        </div>
    );
}

export default LoadingOverlay;
