'use client';

import AuthPage from '../components/AuthPage';
import useAuth from '../hooks/useAuth'; // Ensure this hook provides current user info

const SignIn = () => {
    const { user } = useAuth();

    if (user) {
        return <p>Redirecting...</p>; // Optionally show a loading state or redirecting message
    }

    return <AuthPage isSignUp={false} />;
};

export default SignIn;
