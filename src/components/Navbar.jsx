import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/outline";

const Navbar = () => (
  <nav className="bg-white shadow-md">
    <div className="container mx-auto flex justify-between items-center p-4">
      <Link to="/" className="text-2xl font-bold text-gray-800">Lululemon</Link>
      <div className="flex space-x-6">
        <Link to="/products" className="text-gray-700 hover:text-gray-900">Shop</Link>
        <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
          <ShoppingCartIcon className="h-5 w-5" />
          <span>2</span>
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
