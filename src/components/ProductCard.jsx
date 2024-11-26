import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link to={'/products/' + product.id}>
    <div className="w-64 m-2 border shadow hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-2">
        {/* Color selection */}
        <div className="mt-4">
          <div className="flex space-x-2 mt-2">
            {product.colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
        <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>

    </div>
  </Link>
);

export default ProductCard;
