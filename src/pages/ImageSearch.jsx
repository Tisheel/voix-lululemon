import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from '../data/products'

const ImageSearch = () => {
    const [image, setImage] = useState(null); // For previewing the image
    const [similarProducts, setSimilarProducts] = useState(products); // Store products from the backend
    const [loading, setLoading] = useState(false); // To show a loading state
    const [error, setError] = useState(null); // To handle errors

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file)); // Preview the image
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", document.getElementById("imageInput").files[0]);

            const response = await fetch("http://your-backend-url/api/search", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch similar products");
            }

            const data = await response.json();
            setSimilarProducts(data.products); // Assume the backend responds with { products: [...] }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Upload Section */}
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
                <label
                    htmlFor="imageInput"
                    className="block text-center text-lg font-medium text-gray-700 mb-4"
                >
                    Upload an image to find similar products
                </label>
                <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {image && (
                    <div className="mt-6 text-center">
                        <img
                            src={image}
                            alt="Uploaded Preview"
                            className="w-48 h-48 object-cover rounded-md shadow-md mx-auto"
                        />
                        <button
                            onClick={handleSearch}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Find Similar Products"}
                        </button>
                    </div>
                )}
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mt-6 text-center text-red-500 font-medium">
                    {error}
                </div>
            )}

            {/* Results Section */}
            <div className="mt-12">
                {loading && (
                    <p className="text-center text-gray-500 font-medium">Loading...</p>
                )}
                {!loading && similarProducts.length === 0 && image && (
                    <p className="text-center text-gray-500 font-medium">
                        No similar products found. Try a different image.
                    </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {similarProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSearch;