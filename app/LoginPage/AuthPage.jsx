// LoginPage.js
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      // After successful login, route to the inventory page
      router.push('/UserInventoryPage'); // Adjust the path as necessary
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to PantryMaster</h1>
      <button 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
