'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '../firebase'; // Import the necessary Firebase functions
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth'; // Assuming you have a custom hook for auth

const AuthPage = ({ isSignUp }) => {
    const { user } = useAuth(); // Get user from auth hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/generate'); // Redirect to the generate page if already signed in
        }
    }, [user, router]);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let userCredential;
            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
            await setUserData(user); // Save user data to Firestore
            router.push('/generate'); // Redirect to the generate page
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            await setUserData(user); // Save user data to Firestore
            router.push('/generate'); // Redirect to the generate page
        } catch (err) {
            setError(err.message);
        }
    };

    const setUserData = async (user) => {
        try {
            const userRef = doc(db, `users/${user.uid}`);
            await setDoc(userRef, {
                email: user.email,
                // Add other user-specific data here
            });
        } catch (err) {
            console.error("Error saving user data:", err.message);
        }
    };

    if (user) {
        return <p>Redirecting...</p>; // Optionally show a loading state or redirecting message
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-8">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleAuth}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
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
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center flex-col justify-between">
                    <span className="text-gray-700">Or</span>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Sign in with Google
                    </button>
                </div>

                <p className="text-gray-600 text-center mt-6">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <a href={isSignUp ? '/signin' : '/signup'} className="text-blue-500 hover:underline">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
