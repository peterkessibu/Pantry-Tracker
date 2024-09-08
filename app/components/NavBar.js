'use client'
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (!user) return null;

    return (
        <nav className="bg-[#408d86] p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">Shelfsense</h1>
                <div className="flex items-center">
                    <img
                        src={user.photoURL || '/default-avatar.png'}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-4"
                    />
                    <span className="text-white">{user.displayName}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;