import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Voice from "./components/Voice";
import ImageSearch from "./pages/ImageSearch";
import RecommendationsPage from "./pages/Recommendation";

const App = () => (
  <Router>
    <Voice />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/image-search" element={<ImageSearch />} />
      <Route path="/recommendation" element={<RecommendationsPage />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
