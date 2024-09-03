'use client'
import React from 'react';

const MessagePopup = ({ message, onClose }) => {
    return (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
            <p>{message}</p>
            <button
                className="text-white ml-4"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default MessagePopup;
