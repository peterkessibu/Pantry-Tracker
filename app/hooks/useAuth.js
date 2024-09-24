"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to the Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set user info when logged in
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        // Reset user state when logged out
        setUser(null);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { user };
};

export default useAuth;
