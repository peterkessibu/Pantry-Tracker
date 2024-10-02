// app/sign-up/loading.tsx
"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 2000);

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
}
