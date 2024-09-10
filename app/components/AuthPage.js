'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '../firebase'; // Import Firestore and Firebase
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import Link from 'next/link';
import { bouncy } from 'ldrs'

const AuthPage = ({ isSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Start with loading state set to true
    const router = useRouter();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Simulate a 2-second delay before showing the sign-in/sign-up form
    bouncy.register()
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Stop loading after 2 seconds
        }, 2000); // 2-second loading animation

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);

    // Function to create a new user in Firestore
    const createFirestoreUser = async (user) => {
        const userDocRef = doc(db, 'users', user.uid); // Reference to user's Firestore document
        const userDoc = await getDoc(userDocRef);

        // Check if user already exists in Firestore
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: user.email,
                createdAt: new Date(),
                inventory: [] // Initialize empty inventory
            });
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loading when submitting form

        try {
            let userCredential;
            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user; // Get the authenticated user
            await createFirestoreUser(user); // Create or retrieve user document in Firestore

            router.push('/generate'); // Redirect to generate page after successful auth
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true); // Start loading

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user; // Get Google authenticated user

            await createFirestoreUser(user); // Create or retrieve user document in Firestore

            router.push('/generate'); // Redirect to generate page
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="h-[80vh] flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
                {isLoading ? (
                    <div className="flex justify-center mb-8">
                        <l-bouncy size="100" speed="1.95" color="green"></l-bouncy>
                    </div>
                ) : (
                    <>
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
                                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                            </button>
                        </div>

                        <p className="text-gray-600 text-center mt-6">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="text-blue-500 hover:underline">
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
