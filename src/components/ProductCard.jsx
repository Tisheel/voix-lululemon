import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="border rounded-lg shadow hover:shadow-lg p-4">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-56 object-cover rounded-md"
    />
    <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
    <p className="text-gray-600">${product.price.toFixed(2)}</p>
    <Link to={'/products/' + product.id}>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        View Details
      </button>
    </Link>
  </div>
);

export default ProductCard;
