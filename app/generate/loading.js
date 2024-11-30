"use client";

import { useState, useEffect } from "react";

/**
 * A loading component that displays a spinner and a countdown timer
 * @returns {JSX.Element} A div containing a spinning border and a loading message
 */
const Loading = () => {
  // Declare the component first
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 2980); // Adjust this interval if you want

      return () => clearInterval(timer);
    }
  }, [seconds]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#e2f5f3]">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-14 h-14 border-4 border-t-4 border-t-green-800 border-blue-200 rounded-full"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading; // Export it at the end
