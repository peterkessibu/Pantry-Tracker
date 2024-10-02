"use client";

import Carousel from "./Carousel"; // Import Carousel Component
import FeaturesSection from "./FeaturesSection"; // Import Features Section Component
import Link from "next/link";

const MainSection = () => {
  const images = [
    "/images/pan.png",
    "/images/pantry.png",
    "/images/food.png",
    "/images/cutlery.png",
    "/images/cutting-board.png",
    "/images/diet.png",
    "/images/kitchen-appliance.png",
    "/images/oil-bottle.png",
    "/images/juice.png",
    "/images/inventory.png",
    "/images/trolley.png",
    "/images/colander.png",
    "/images/fast-food.png",
    "/images/blender.png",
    "/images/hand.png",
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <section className="w-full h-3/4 py-12 md:py-24 flex flex-col items-center justify-center">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-4 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Manage Your Pantry with Ease
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
              Shelfsense helps you keep track of your pantry inventory, so you
              always know what you have and what you need.
            </p>
          </div>
          <div>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Carousel Section */}
        <Carousel images={images} />
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </main>
  );
};
function Button({ children, variant, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        variant === "outline"
          ? "border border-gray-300"
          : "bg-green-800 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default MainSection;
