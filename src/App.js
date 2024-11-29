import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import TemporarySearch from "./components/TemporarySearch";
import Voice from "./components/Voice";

const App = () => (
  <Router>
    {/* <TemporarySearch /> */}
    <Voice />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
