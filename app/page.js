'use client'
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to ShelfSense</h1>
      <p className="text-lg text-gray-800 mb-12 text-center">
        Easily track and manage your inventory with real-time updates. Sign up or sign in to get started.
      </p>
      <div className="space-x-4">
        <Link href="/sign-in" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Sign In 
        </Link>
        <Link href="/sign-up" className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;



