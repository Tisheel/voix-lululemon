import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  return (
    <div className="container mx-auto py-12">
      <div className="flex space-x-8">
        <img src={product.image} alt={product.name} className="w-1/2 rounded-md" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-4">${product.price.toFixed(2)}</p>
          <p className="mt-4">{product.description}</p>
          <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
