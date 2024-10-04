"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { LogOut } from "lucide-react";

export const UserHeader = () => {
  const { user } = useAuth(); // Access user from useAuth
  const router = useRouter(); // Initialize router for navigation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State to manage dropdown visibility

  const handleLogout = () => {
    // Clear all caches
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-[#408d86] fixed top-0 left-0 w-full shadow-md z-10"> 
      <Link className="flex items-center justify-start md:ml-8 ml-2" href="/">
        <ShelfIcon className="h-6 w-6" />
        <span className="text-white ml-2 text-xl">Shelfsense</span>
      </Link>
      <div className="flex justify-center items-center md:mr-8 mr-2 relative">
        {/* Display user first name if user exists */}
        {user && (
          <span className="text-white mr-4">
            {user.displayName?.split(" ")[0]}
          </span>
        )}
        <Button
          onClick={() => setShowLogoutConfirm(!showLogoutConfirm)} // Toggle confirmation dropdown
          className="bg-[#0e503c] text-white p-2 rounded-lg transition duration-300 ease-in-out"
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>

      {/* Confirmation Dropdown */}
      {showLogoutConfirm && (
        <div className="mt-4 bg-white shadow-lg rounded-md p-6 mr-4 w-auto absolute top-full right-0"> 
          <p className="text-gray-700 mb-2">Are you sure you want to log out?</p>
          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)} // Close confirmation dropdown
            >
              Cancel
            </Button>
            <Button onClick={handleLogout}>Confirm</Button>
          </div>
        </div>
      )}
    </header>
  );
};

function Button({ children, variant, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${variant === "outline"
        ? "border border-gray-300 text-gray-700"
        : "bg-green-800 text-white"
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

export default UserHeader;
