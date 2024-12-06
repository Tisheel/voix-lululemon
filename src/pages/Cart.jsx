import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../urls/urls";
import RecommendationsPage from "./Recommendation";

const Cart = () => {
  // const cartItems = [
  //   { id: 1, name: "Yoga Pants", price: 59.99, quantity: 1 },
  //   { id: 2, name: "Sports Bra", price: 39.99, quantity: 2 },
  // ];
  const [cartItems, setCartItems] = useState([]);

  // const total = cartItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  useEffect(() => {
    const handleCartData = async () => {
      const response = await axios.get(`${BASE_URL}get_cart_products/`);
      console.log(response);
      setCartItems(response.data.cart);
      console.log(cartItems);
    };
    handleCartData();
  }, []);

  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <img
                src={item.image1_url}
                alt={item.name}
                className="w-36 h-36 object-cover rounded-lg border"
              />
              <p>{item.name}</p>
              <p>${item.price}</p>
            </div>
          ))}
        </div>
        {/* <p className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</p> */}
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Checkout
        </button>
      </div>
      <RecommendationsPage />
    </>
  );
};

export default Cart;
