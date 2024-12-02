import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Voice from "./components/Voice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ImageSearch from "./pages/ImageSearch";
import RecommendationsPage from "./pages/Recommendation";
import Footer from "./components/Footer";
import Thank from "./pages/Thank";

const App = () => {
  // Add useState for filters
  const [filters, setFilters] = useState(null);

  return (
    <Router>
      <Voice setFilters={setFilters} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={<Products filters={filters} />} // Pass filters and setFilters to Products
        />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/image-search" element={<ImageSearch />} />
        <Route path="/recommendation" element={<RecommendationsPage />} />
        <Route path="/thank-you" element={<Thank />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
