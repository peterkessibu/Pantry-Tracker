"use client";
// pages/signup.js
import AuthPage from "../components/AuthPage";
import Header from "../components/Header";

const SignUp = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex-grow">
        <AuthPage isSignUp={false} />
      </div>
    </div>
  );
};

export default SignUp;
 