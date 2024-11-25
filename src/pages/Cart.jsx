import React from "react";

const Cart = () => {
  const cartItems = [
    { id: 1, name: "Yoga Pants", price: 59.99, quantity: 1 },
    { id: 2, name: "Sports Bra", price: 39.99, quantity: 2 },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            <p>{item.name} (x{item.quantity})</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <p className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</p>
      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Checkout
      </button>
    </div>
  );
};

export default Cart;
