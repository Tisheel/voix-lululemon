import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex(
      (currentImageIndex + 1) % product.additionalImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (currentImageIndex - 1 + product.additionalImages.length) %
      product.additionalImages.length
    );
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Image Slider */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <img
              src={product.additionalImages[currentImageIndex]}
              alt={`${product.name} - ${currentImageIndex}`}
              className="w-full h-96 object-cover rounded-md"
            />
            {/* Slider Controls */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black p-2 rounded-full"
            >
              &#9664;
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black p-2 rounded-full"
            >
              &#9654;
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex space-x-2 mt-4">
            {product.additionalImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} - Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${index === currentImageIndex
                    ? "border-2 border-blue-500"
                    : "border border-gray-300"
                  }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-4">${product.price.toFixed(2)}</p>
          {product.discount > 0 && (
            <p className="text-red-500 mt-1">
              Discount: {product.discount}% off
            </p>
          )}
          <p className="mt-4">{product.description}</p>

          {/* Features */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Features:</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Color Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Colors:</h3>
            <div className="flex space-x-4 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color
                      ? "border-blue-500"
                      : "border-gray-300"
                    }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected Color: <span className="font-semibold">{selectedColor}</span>
            </p>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Sizes:</h3>
            <div className="flex space-x-4 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${selectedSize === size
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-700"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected Size: <span className="font-semibold">{selectedSize}</span>
            </p>
          </div>

          {/* Add to Cart Button */}
          <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
