import { Poppins } from "next/font/google";
import "./globals.css";

// Import the Poppins font
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata = {
  title: "Shelfsense",
  description: "Inventory Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
