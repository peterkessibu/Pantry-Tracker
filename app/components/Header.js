"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import AuthHeader from "./AuthHeader";
import UserHeader from "./UserHeader";

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  /**
   * Sets up an authentication state listener and handles cleanup
   * @param {void} None
   * @returns {Function} Cleanup function to unsubscribe from the listener
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    ```
    /**
     * Handles user logout by clearing local storage, session storage, and signing out the user.
     * @returns {Promise<void>} A promise that resolves when the logout process is complete and the user is redirected to the home page, or rejects with an error if the logout fails.
     */
    ```    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    auth
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout error: ", error);
      });
  };

  return user ? (
    <UserHeader user={user} handleLogout={handleLogout} />
  ) : (
    <AuthHeader />
  );
};

export default Header;
