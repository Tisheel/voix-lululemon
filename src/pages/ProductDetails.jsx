import React from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <p>Product not found</p>;
  }

  const {
    name,
    color,
    price,
    gender,
    category,
    length,
    fit,
    activity,
    fabric,
    description,
    image1_url,
    image2_url,
    image3_url,
  } = product;

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className="w-full md:w-1/2">
          <div className="flex gap-4 overflow-x-scroll">
            {[image1_url, image2_url, image3_url].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${name} - ${index + 1}`}
                className="h-96 w-auto object-contain rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h1 className="text-2xl font-bold">{name}</h1>
          {/* <p className="text-gray-600 mt-2">{description}</p> */}
          <p className="text-gray-700 mt-4">
            <span className="font-semibold">Price:</span> ₹{price}
          </p>

          {/* Product Details */}
          <div className="mt-6 space-y-2">
            <p>
              <span className="font-semibold">Color:</span> {color}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {gender}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {category}
            </p>
            <p>
              <span className="font-semibold">Length:</span> {length}
            </p>
            <p>
              <span className="font-semibold">Fit:</span> {fit}
            </p>
            <p>
              <span className="font-semibold">Activity:</span> {activity}
            </p>
            <p>
              <span className="font-semibold">Fabric:</span> {fabric}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
              Add to Cart
            </button>
            <Link to='/products'>
            <button className="ml-4 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition">
              Back to Products
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
