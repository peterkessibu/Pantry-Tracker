"use client";

/**
 * Renders a footer component with copyright information
 * @returns {JSX.Element} A footer element with centered copyright text
 */
const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-6 border-t">
      <p className="text-xs text-gray-500 items-center mx-auto">
        © 2024 Shelfsense. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
