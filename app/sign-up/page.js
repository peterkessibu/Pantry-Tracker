'use client'
// pages/signup.js
import AuthPage from '../components/AuthPage';
import Header from '../components/Header'

const SignUp = () => {
    return (
        <div>
            <Header title='Shelfsense' />
            <AuthPage isSignUp={true} />
        </div>
    )
};
export default SignUp;
