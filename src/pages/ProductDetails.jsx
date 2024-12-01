import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../urls/urls"; // Assuming you have a base URL for the API

const ProductDetails = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");

        if (!searchQuery) {
          setError("No search query provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}particular_search/`, {
          params: { q: searchQuery },
        });

        // Assuming the response structure is like the schema you provided
        const fetchedProduct = response.data.results;

        // Modify the fetched product to have colors as an array
        const productWithColors = {
          ...fetchedProduct,
          color: [fetchedProduct.color], // Convert single color to an array
          sizes: ["S", "M", "L", "XL"], // Adding static sizes for now (this can be dynamic if needed)
        };

        setProduct(productWithColors);
        setError(null);
      } catch (error) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [location.search]);

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

  const { name, price, description, image1_url, image2_url, image3_url, color, sizes } = product;

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className="w-full md:w-1/2">
          <div className="flex gap-4 overflow-x-scroll overflow-hidden">
            {[image1_url, image2_url, image3_url].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${name} - ${index + 1}`}
                className="h-96 w-auto object-contain rounded-lg shadow-lg transition-transform transform hover:scale-105"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-lg text-gray-600 mt-4">{description}</p>

          <p className="text-2xl text-gray-800 mt-6">
            <span className="font-semibold">Price:</span> ₹{price}
          </p>

          {/* Color Selection */}
          {color && color.length > 0 && (
            <div className="mt-6">
              <span className="font-semibold">Color:</span>
              <div className="flex gap-2 mt-2">
                {color.map((col, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 border-gray-300 ${selectedColor === col ? "ring-2 ring-blue-500" : ""
                      }`}
                    style={{ backgroundColor: col }}
                    onClick={() => setSelectedColor(col)}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes && sizes.length > 0 && (
            <div className="mt-6">
              <span className="font-semibold">Size:</span>
              <div className="flex gap-2 mt-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 flex justify-center items-center rounded-full border-2 border-gray-300 text-gray-800 font-semibold ${selectedSize === size ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
              Add to Cart
            </button>
            <Link to="/products">
              <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition">
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
