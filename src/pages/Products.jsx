import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Extract unique values for filters
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const allCategories = Array.from(new Set(products.map((p) => p.category)));
  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));

  // Handle filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColors =
      selectedColors.length === 0 ||
      product.colors.some((color) => selectedColors.includes(color));

    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesSizes =
      selectedSizes.length === 0 ||
      product.sizes.some((size) => selectedSizes.includes(size));

    return matchesSearch && matchesColors && matchesCategories && matchesSizes;
  });

  // Toggle filter selection
  const toggleSelection = (value, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="container mx-auto py-12">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar Filters */}
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">

          {/* Filter by Color */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color)
                      ? "border-blue-500"
                      : "border-gray-300"
                    }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => toggleSelection(color, setSelectedColors)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-2">
              {allCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      toggleSelection(category, setSelectedCategories)
                    }
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Size */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded ${selectedSizes.includes(size)
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-700"
                    }`}
                  onClick={() => toggleSelection(size, setSelectedSizes)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-3/4 overflow-y-auto flex flex-wrap gap-6 ml-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
