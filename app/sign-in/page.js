"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import AuthHeader from "../components/AuthHeader";
import Footer from "../components/Footer";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/generate");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/generate");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#e2f5f3]">
      <AuthHeader />
      <div className="flex-grow w-full flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignIn}>
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
              Sign In
            </button>
          </form>
          <div className="mt-4 flex items-center flex-col">
            <span className="text-gray-700">Or</span>
            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
          <p className="text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;
