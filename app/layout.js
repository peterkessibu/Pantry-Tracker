import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Shelfsense",
  description: "Inventory Tracker",
};

/**
 * RootLayout component that serves as the base layout for the application.
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} A JSX element representing the root HTML structure with the provided children.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-zinc-900`}>{children}</body>
    </html>
  );
}
