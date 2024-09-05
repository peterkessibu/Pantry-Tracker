'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this imports the initialized auth

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user };
};

export default useAuth;
