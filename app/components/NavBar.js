'use client'
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();

        router.push('/');
    };

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
                    <span className="text-white hidden sm:block">{user.displayName}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-[#d13b3b] text-white p-2 rounded-lg transition duration-300 ease-in-out mx-4"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;