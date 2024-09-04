'use client'
import React, { useEffect, useState } from 'react';

const MessagePopup = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Automatically close the message after 5 seconds
        const timeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 500); // Delay closing after the animation
        }, 2000);

        
        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <p>{message}</p>
            
        </div>
    );
};

export default MessagePopup;
