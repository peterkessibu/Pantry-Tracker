"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AuthHeader from "../components/AuthHeader";
import Footer from "../components/Footer";

/**
 * SignUpPage component for user registration
 * Handles email/password and Google sign-up, creates user in Firestore, and manages form state
 * @returns {JSX.Element} A sign-up form with email/password inputs and Google sign-up option
 */
const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Function to create a new user in Firestore
  const createFirestoreUser = async (user) => {
    const userDocRef = doc(db, "users", user.uid); // Reference to user's Firestore document
    const userDoc = await getDoc(userDocRef);

    // Check if user already exists in Firestore
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date(),
        inventory: [], // Initialize empty inventory
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear any existing error

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user; // Get the authenticated user

      await createFirestoreUser(user); // Create user document in Firestore

      router.push("/generate"); // Redirect to generate page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user; // Get Google authenticated user

      await createFirestoreUser(user); // Create user document in Firestore

      router.push("/generate"); // Redirect to generate page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#e2f5f3]">
      <AuthHeader />
      <div className="flex-grow w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white mx-4 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 flex items-center flex-col">
            <span className="text-gray-700">Or</span>
            <button
              onClick={handleGoogleSignUp}
              className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign up with Google
            </button>
          </div>
          <p className="text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
