'use client';
import React from 'react';

const Header = ({ title }) => {
    return (
        <div className="p-4 m-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <p className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">
                {title}
            </p>
        </div>
    );
};

export default Header;
