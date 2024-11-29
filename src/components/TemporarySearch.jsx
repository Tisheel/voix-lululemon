// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../urls/urls";
// import axios from "axios";

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI("AIzaSyCAUsw6x2fBnBseE5BazF0F-cwKAtO5Tic");

// // Define the function declarations for the model
// const functionDeclarations = [
//   {
//     name: "addToCart",
//     description: "Add an item to the shopping cart",
//     parameters: {
//       type: "object",
//       properties: {
//         query: {
//           type: "string",
//           description: "The search query or item description to add to cart",
//         },
//       },
//       required: ["query"],
//     },
//   },
//   {
//     name: "finalizeCart",
//     description: "Finalize and checkout the shopping cart",
//     parameters: {
//       type: "object",
//       properties: {
//         confirmation: {
//           type: "boolean",
//           description: "Confirmation to finalize the cart",
//         },
//       },
//       required: ["confirmation"],
//     },
//   },
//   {
//     name: "particularSearch",
//     description: "Search for a specific product and view its details",
//     parameters: {
//       type: "object",
//       properties: {
//         query: {
//           type: "string",
//           description: "The search query for the specific product",
//         },
//       },
//       required: ["query"],
//     },
//   },
//   {
//     name: "groupSearch",
//     description: "Search for a group of products",
//     parameters: {
//       type: "object",
//       properties: {
//         query: {
//           type: "string",
//           description: "The search query for the group of products",
//         },
//       },
//       required: ["query"],
//     },
//   },
// ];

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   tools: {
//     functionDeclarations: functionDeclarations,
//   },
// });

// const TemporarySearch = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [aiResponse, setAiResponse] = useState("");
//   const navigate = useNavigate();

//   const groupSearch = (query) => {
//     navigate({
//       pathname: "/products",
//       search: `?search=${encodeURIComponent(query)}`,
//     });
//   };

//   const addToCart = async (query) => {
//     const response = await axios.get(`${BASE_URL}add_to_cart/`, {
//       params: { q: query },
//     });
//     console.log(response);
//     navigate("/cart");
//   };

//   const finalizeCart = async (confirmation) => {
//     if (confirmation) {
//       const response = await axios.get(`${BASE_URL}finalize_cart/`);
//       console.log(response);
//       return response.data;
//     }
//     return "Cart finalization cancelled";
//   };

//   const particularSearch = async (query) => {
//     navigate({
//       pathname: "/product",
//       search: `?search=${encodeURIComponent(query)}`,
//     });
//   };

//   const handleAIChat = async (prompt) => {
//     try {
//       const result = await model.generateContent({
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//       });

//       const response = await result.response;
//       const text = response.text();
//       setAiResponse(text);

//       // Handle function calls based on AI response
//       if (response.candidates[0].content.parts[0].functionCall) {
//         const functionCall =
//           response.candidates[0].content.parts[0].functionCall;
//         switch (functionCall.name) {
//           case "addToCart":
//             await addToCart(functionCall.args.query);
//             break;
//           case "finalizeCart":
//             await finalizeCart(functionCall.args.confirmation);
//             break;
//           case "particularSearch":
//             await particularSearch(functionCall.args.query);
//             break;
//           case "groupSearch":
//             groupSearch(functionCall.args.query);
//             break;
//         }
//       }
//     } catch (error) {
//       console.error("Error in AI chat:", error);
//       setAiResponse("Sorry, I encountered an error processing your request.");
//     }
//   };

//   const handleInputChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (searchTerm.toLowerCase().includes("previous page")) {
//       navigate(-1); // Go back to the previous page
//       setSearchTerm("");
//       return; // Exit the function to prevent further execution
//     }
//     if (searchTerm.trim()) {
//       const prompt = `
//         User Query: ${searchTerm}

//         Based on this query, please help me with one of the following actions:
//         1. If it's a specific product search (e.g., "show me the blue nike shoes"), use particularSearch
//         2. If it's a category or multiple products search (e.g., "show all t-shirts"), use groupSearch
//         3. If it's about adding items to cart (e.g., "add blue shirt to cart"), use addToCart
//         4. If it's about checking out or finalizing cart (e.g., "checkout my cart"), use finalizeCart with confirmation=true

//         Please analyze the query and call the appropriate function with the relevant parameters.

//       `;

//       handleAIChat(prompt);
//       setSearchTerm("");
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       {/* <form onSubmit={handleSubmit} className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={handleInputChange}
//           placeholder="Search or ask about products..."
//           className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
//         >
//           Search
//         </button>
//       </form> */}
//       <p>
//         <strong>Status:</strong>{" "}
//         {isListening ? "Listening..." : "Not Listening"}
//       </p>{" "}
//       {/* Show listening status */}
//       <p>
//         <strong>Transcription:</strong> {transcript || "Speak something..."}
//       </p>{" "}
//       {/* Display the transcript */}
//       {aiResponse && (
//         <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//           <p className="text-gray-700">{aiResponse}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemporarySearch;
