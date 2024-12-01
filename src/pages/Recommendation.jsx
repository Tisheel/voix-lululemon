import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { BASE_URL } from "../urls/urls";

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [seasonalProducts, setSeasonalProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Simulating fetching data from backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Replace these URLs with actual API endpoints
                const response = await fetch(
                    BASE_URL + 'recommendations/'
                );

                const data = await response.json();

                setRecommendations(data.frequency_based_products);
                setSeasonalProducts(data.seasonal_based_products);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Recommendations & Seasonal Picks
            </h1>

            {/* Recommendations Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-700">Recommendations</h2>
                {loading && <p className="text-gray-500">Loading recommendations...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recommendations.length > 0 ? (
                        recommendations.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        !loading && <p className="text-gray-500">No recommendations available.</p>
                    )}
                </div>
            </div>

            {/* Seasonal Picks Section */}
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-700">Seasonal Picks</h2>
                {loading && <p className="text-gray-500">Loading seasonal products...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {seasonalProducts.length > 0 ? (
                        seasonalProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        !loading && <p className="text-gray-500">No seasonal products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationsPage;
