"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

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
        // Clear all local and session storage
        localStorage.clear();
        sessionStorage.clear();

        // Sign out the user
        auth.signOut().then(() => {
            // Optionally, clear any additional application state if needed
            // e.g., clearing Redux store or context
            router.push("/"); // Redirect to the home page
        }).catch((error) => {
            console.error("Logout error: ", error);
            // Handle errors here if necessary (e.g., showing an alert)
        });
    };

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-[#408d86]">
            <Link className="flex items-center justify-center md:justify-start" href="#">
                <ShelfIcon className="h-6 w-6" />
                <span className="text-white ml-2 text-xl">Shelfsense</span>
            </Link>
            <div className="flex items-center">
                {user ? (
                    <>
                        <img
                            src={user.photoURL || "/default-avatar.png"}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <span className="text-white hidden sm:block">{user.displayName}</span>
                        <Button
                            onClick={handleLogout}
                            className="bg-[#d13b3b] text-white p-2 rounded-lg transition duration-300 ease-in-out mx-4"
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button className="text-sm font-medium bg-green-800 text-white px-4 py-2 rounded-md">
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
};

function Button({ children, variant, ...props }) {
    return (
        <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${variant === "outline" ? "border border-gray-300" : "bg-green-800 text-white"
                }`}
            {...props}
        >
            {children}
        </button>
    );
}

function Link({ children, ...props }) {
    return (
        <a className="hover:underline" {...props}>
            {children}
        </a>
    );
}

function ShelfIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="12" x="2" y="4" rx="2" />
            <rect width="20" height="12" x="2" y="14" rx="2" />
        </svg>
    );
}

export default Header;
