import React from "react";

const Footer = () => (
  <footer className="bg-gray-100 py-6">
    <div className="container mx-auto text-center text-gray-600">
      <p>&copy; 2024 Lululemon Clone. All Rights Reserved.</p>
      <div className="mt-4 flex justify-center space-x-4">
        <a href="/about" className="hover:underline">About</a>
        <a href="/contact" className="hover:underline">Contact</a>
        <a href="/terms" className="hover:underline">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;
