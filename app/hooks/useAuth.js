
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user === null) {
                setUser(null);
            } else {
                setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                });
            }
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return { user };
};

export default useAuth;
