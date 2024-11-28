import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import axios from "axios";
import { BASE_URL } from "../urls/urls";
import { useLocation } from "react-router-dom"; // Import useLocation

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedFits, setSelectedFits] = useState([]);
  const [products, setProducts] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get("search");

        // If there's a search parameter in the URL, use it
        if (searchParam) {
          setSearchQuery(searchParam);
          const response = await axios.get(`${BASE_URL}group_search`, {
            params: { q: searchParam },
          });
          setProducts(response.data.results);
        } else {
          // Only fetch all products if there's no search parameter
          const response = await axios.get(`${BASE_URL}get_all_products`);
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [location.search]);
  // Extract unique filter values
  const allColors = Array.from(new Set(products.map((p) => p.color)));
  const allCategories = Array.from(new Set(products.map((p) => p.category)));
  const allGenders = Array.from(new Set(products.map((p) => p.gender)));
  const allFits = Array.from(new Set(products.map((p) => p.fit)));

  //Filtering logic
  const filteredProducts = products.filter((product) => {
    // const matchesSearch =
    //   product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColors =
      selectedColors.length === 0 || selectedColors.includes(product.color);

    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesGenders =
      selectedGenders.length === 0 || selectedGenders.includes(product.gender);

    const matchesFits =
      selectedFits.length === 0 || selectedFits.includes(product.fit);

    return (
      // matchesSearch &&
      matchesColors && matchesCategories && matchesGenders && matchesFits
    );
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
        {/* Filters Sidebar */}
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          {/* Filter by Color */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded ${
                    selectedColors.includes(color)
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => toggleSelection(color, setSelectedColors)}
                >
                  {color}
                </button>
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

          {/* Filter by Gender */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Gender</h3>
            <div className="space-y-2">
              {allGenders.map((gender) => (
                <label key={gender} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(gender)}
                    onChange={() => toggleSelection(gender, setSelectedGenders)}
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Fit */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Fit</h3>
            <div className="space-y-2">
              {allFits.map((fit) => (
                <label key={fit} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFits.includes(fit)}
                    onChange={() => toggleSelection(fit, setSelectedFits)}
                  />
                  <span>{fit}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-3/4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ml-8">
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
