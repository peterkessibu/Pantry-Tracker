"use client";
// pages/signup.js
import AuthPage from "../components/AuthPage";
import Header from "../components/Header";

const SignUp = () => {
  return (
    <div>
      <Header title="Shelfsense" />
      <AuthPage isSignUp={false} />
    </div>
  );
};

export default SignUp;
