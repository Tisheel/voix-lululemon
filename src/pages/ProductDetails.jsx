import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../urls/urls";

const ProductDetails = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Get search parameter from URL
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");

        console.log("Search Query:", searchQuery); // Debug log

        if (!searchQuery) {
          setError("No search query provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}particular_search/`, {
          params: {
            q: searchQuery,
          },
        });

        console.log("API Response:", response.data); // Debug log
        setProduct(response.data.results);
        setError(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [location.search]); // Dependency on location.search

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12">
        <p className="text-red-500">{error || "Product not found"}</p>
        <Link to="/products">
          <button className="mt-4 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition">
            Back to Products
          </button>
        </Link>
      </div>
    );
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
            <Link to="/products">
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
