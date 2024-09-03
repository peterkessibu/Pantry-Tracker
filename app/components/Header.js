'use client'
import React from 'react';

const Header = ({ title }) => {
    return (
        <div className="p-4 m-4 bg-gray-100 rounded-lg flex justify-center brightness-200">
            <p className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {title}
            </p>
        </div>
    );
};

export default Header;
