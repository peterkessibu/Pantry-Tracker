'use client'

import { ArrowRight, CheckCircle, Edit, Search, Trash2, ArrowUpDown, PlusCircle } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <ShelfIcon className="h-6 w-6" />
          <span className="sr-only">Shelfsense</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Pantry with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Shelfsense helps you keep track of your pantry inventory, so you always know what you have and what you need.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full h-screen py-12 md:py-24 lg:py-32 bg-gray-100 ">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Organize Your Pantry?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of happy users who have transformed their pantry management with Shelfsense.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Shelfsense. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

const features = [
  { icon: <PlusCircle className="h-10 w-10 mb-2" />, title: "Add Items", description: "Easily add new items to your inventory with name and quantity." },
  { icon: <Edit className="h-10 w-10 mb-2" />, title: "Edit Items", description: "Update item details anytime with our intuitive editing feature." },
  { icon: <Trash2 className="h-10 w-10 mb-2" />, title: "Remove Items", description: "Easily remove items from your inventory when they're used up." },
  { icon: <ArrowUpDown className="h-10 w-10 mb-2" />, title: "Sort Items", description: "Keep your inventory organized with our sorting feature." },
  { icon: <Search className="h-10 w-10 mb-2" />, title: "Search Items", description: "Quickly find what you need with our powerful search function." },
  { icon: <CheckCircle className="h-10 w-10 mb-2" />, title: "Real-Time Updates", description: "See changes instantly with our real-time update feature." },
]

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
      {icon}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{description}</p>
    </div>
  )
}

function Button({ children, variant, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${variant === 'outline' ? 'border border-gray-300' : 'bg-blue-600 text-white'}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Input({ className, ...props }) {
  return <input className={`border rounded-md p-2 text-sm ${className}`} {...props} />
}

function Link({ children, ...props }) {
  return (
    <a className="hover:underline" {...props}>
      {children}
    </a>
  )
}

function ShelfIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="6" x="2" y="4" rx="2" />
      <rect width="20" height="6" x="2" y="14" rx="2" />
    </svg>
  )
}
