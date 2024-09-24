"use client";

import { PlusCircle, Edit, Trash2, ArrowUpDown, Search, CheckCircle } from "lucide-react"; // Import necessary icons

const FeaturesSection = () => {
    const features = [
        {
            icon: <PlusCircle className="h-10 w-10 mb-2" />,
            title: "Add Items",
            description: "Easily add new items to your inventory with name and quantity.",
        },
        {
            icon: <Edit className="h-10 w-10 mb-2" />,
            title: "Edit Items",
            description: "Update item details anytime with our intuitive editing feature.",
        },
        {
            icon: <Trash2 className="h-10 w-10 mb-2" />,
            title: "Remove Items",
            description: "Easily remove items from your inventory when they're used up.",
        },
        {
            icon: <ArrowUpDown className="h-10 w-10 mb-2" />,
            title: "Sort Items",
            description: "Keep your inventory organized with our sorting feature.",
        },
        {
            icon: <Search className="h-10 w-10 mb-2" />,
            title: "Search Items",
            description: "Quickly find what you need with our powerful search function.",
        },
        {
            icon: <CheckCircle className="h-10 w-10 mb-2" />,
            title: "Real-Time Updates",
            description: "See changes instantly with our real-time update feature.",
        },
    ];

    const FeatureCard = ({ icon, title, description }) => {
        return (
            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                {icon}
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {description}
                </p>
            </div>
        );
    };

    return (
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
    );
};

export default FeaturesSection;
