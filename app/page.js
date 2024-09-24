"use client";

import Image from "next/image";
import {
  CheckCircle,
  Edit,
  Search,
  Trash2,
  ArrowUpDown,
  PlusCircle,
} from "lucide-react";

export default function Component() {
  const images = [
    "/images/pan.png",
    "/images/pantry.png",
    "/images/food.png",
    "/images/cutlery.png",
    "/images/cutting-board.png",
    "/images/diet.png",
    "/images/fast-food.png",
    "/images/kitchen-appliance.png",
    "/images/oil-bottle.png",
    "/images/juice.png",
    "/images/inventory.png",
    "/images/trolley.png",
    "/images/colander.png",
    "/images/blender.png",
    "/images/hand.png",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#e2f5f3]">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        {/* Logo and Text */}
        <Link className="flex items-center justify-center md:justify-start" href="#">
          <ShelfIcon className="h-6 w-6" />
          <span className="text-black ml-2 text-xl">Shelfsense</span>
        </Link>

        {/* Sign In Button with Link */}
        <Link href="/signin">
          <Button className="text-sm font-medium bg-green-800 text-white px-4 py-2 rounded-md">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 md:py-24 flex flex-col items-center justify-center">
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
          <div className="w-full overflow-hidden py-8 mt-8">
            <div className="flex gap-4 sm:gap-8 w-full items-center justify-start animate-scroll whitespace-nowrap">
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Image ${index + 1}`}
                  width={48}
                  height={48}
                  className="object-cover rounded-lg"
                />
              ))}
            </div>

            <style jsx>{`
              @keyframes scroll {
                0% {
                  transform: translateX(100%);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
              .animate-scroll {
                animation: scroll 13s linear infinite;
              }
            `}</style>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-100 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-6 border-t">
        <p className="text-xs text-gray-500 items-center mx-auto">
          © 2024 Shelfsense. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <PlusCircle className="h-10 w-10 mb-2" />,
    title: "Add Items",
    description:
      "Easily add new items to your inventory with name and quantity.",
  },
  {
    icon: <Edit className="h-10 w-10 mb-2" />,
    title: "Edit Items",
    description:
      "Update item details anytime with our intuitive editing feature.",
  },
  {
    icon: <Trash2 className="h-10 w-10 mb-2" />,
    title: "Remove Items",
    description:
      "Easily remove items from your inventory when they're used up.",
  },
  {
    icon: <ArrowUpDown className="h-10 w-10 mb-2" />,
    title: "Sort Items",
    description: "Keep your inventory organized with our sorting feature.",
  },
  {
    icon: <Search className="h-10 w-10 mb-2" />,
    title: "Search Items",
    description:
      "Quickly find what you need with our powerful search function.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 mb-2" />,
    title: "Real-Time Updates",
    description: "See changes instantly with our real-time update feature.",
  },
];

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
      {icon}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {description}
      </p>
    </div>
  );
}

function Button({ children, variant, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${variant === "outline" ? "border border-gray-300" : "bg-green-800 text-white"
        }`}
      {...props}
    >
      {children}
    </button>
  );
}

function Link({ children, ...props }) {
  return (
    <a className="hover:underline" {...props}>
      {children}
    </a>
  );
}

function ShelfIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="12" x="2" y="4" rx="2" />
      <rect width="20" height="12" x="2" y="14" rx="2" />
    </svg>
  );
}
