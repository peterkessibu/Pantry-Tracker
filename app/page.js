"use client";

import MainSection from "./components/MainSection";
import Footer from "./components/Footer";
import AuthHeader from "./components/AuthHeader";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e2f5f3]">
      <AuthHeader />
      <MainSection />
      <Footer />
    </div>
  );
}
