"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import AuthHeader from "./AuthHeader";
import UserHeader from "./UserHeader";

const Header = () => {
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

        auth.signOut()
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
