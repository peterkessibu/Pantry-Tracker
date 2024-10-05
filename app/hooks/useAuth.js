"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Custom hook for managing authentication state
 * @returns {Object} An object containing the current user's information
 * @returns {Object|null} user - The current user object, or null if not logged in
 * @returns {string} user.uid - The unique identifier of the user
 * @returns {string|null} user.displayName - The display name of the user
 * @returns {string} user.email - The email address of the user
 */
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
