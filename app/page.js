"use client";

import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e2f5f3]">
      <Header />
      <MainSection />
      <Footer />
    </div>
  );
}
