import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Voice from "./components/Voice";
import VoiceContextProvider from "./components/VoiceContextProvider";
import ImageSearch from "./pages/ImageSearch";

const App = () => (
  <Router>
    <VoiceContextProvider>
      <Voice />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/imageSearch" element={<ImageSearch />} />
      </Routes>
      <Footer />
    </VoiceContextProvider>
  </Router>
);

export default App;
