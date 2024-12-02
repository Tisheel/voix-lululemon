import React from "react";

const Thank = () => {
  return (
    <div className="container mx-auto">
      {/* Banner Section - Similar to Homepage */}
      <div className="relative">
        <img
          src="https://images.lululemon.com/is/image/lululemon/NA_NOV24_HMD24_BlackFriday_Ecomm_Homepage_1_1_Med_MediaAction_D_Shorts_Pants?wid=1600&op_usm=0.5,2,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72"
          alt="Thank You Background"
          className="w-full h-[400px] object-cover rounded-lg shadow-md opacity-50"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl font-bold mb-6">Thank You!</h1>
            <p className="text-xl mb-8">
              We appreciate your purchase and trust in our brand. Your order is
              being processed with care.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/shop"
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Continue Shopping
              </a>
              <a
                href="/orders"
                className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition duration-300"
              >
                View Order
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
            <p className="text-gray-700">
              Order Number: #12345
              <br />
              Estimated Delivery: 3-5 Business Days
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <p className="text-gray-700">
              Questions? Contact us at:
              <br />
              support@example.com
              <br />
              1-800-HELP-NOW
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-6">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h4 className="font-semibold mb-2">Order Confirmation</h4>
            <p className="text-gray-600">Check your email for order details</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h4 className="font-semibold mb-2">Track Shipment</h4>
            <p className="text-gray-600">Monitor your package online</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h4 className="font-semibold mb-2">Customer Support</h4>
            <p className="text-gray-600">We're here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thank;
