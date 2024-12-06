import React, { useEffect, useState } from "react";
import annyang from "annyang";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../urls/urls";

// Gemini API initialization
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyC1fTExs1RW4FQ2ZiscaPB0BbJDnRl17SM");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: {
    functionDeclarations: [
      {
        name: "addToCart",
        description: "Add an item to the shopping cart",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Name of the product to be added to the cart",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "groupSearch",
        description: "Search for a group of products",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
      {
        name: "finalizeCart",
        description: "Finalize and checkout",
        parameters: {
          type: "object",
          properties: {
            confirmation: {
              type: "boolean",
              description: "Confirmation to finalize",
            },
          },
          required: ["confirmation"],
        },
      },
      {
        name: "particularSearch",
        description: "Search for a specific product and view its details",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query for the specific product",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "filterInteraction",
        description: "Apply filters to the current product list",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The filter message containing filter criteria",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "fetchProductDescriptionOrDetails",
        description:
          "Fetch descriptions or details based on the provided search query for a particular product after searching for particular product. If asked for more details execute this function. ",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The search query containing criteria to fetch product descriptions.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "recommendProducts",
        description:
          "Recommend products based on user preferences or popular items. This function is called when the user requests product recommendations without providing any details. If details are provided use the groupSearch or particularSearch appropriately.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The search query containing criteria to fetch product descriptions.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "resetFilters",
        description:
          "Reset all applied filters to their default state. This function is called when the user requests to clear all filters without providing any specific details. It ensures that the product list is displayed without any filtering criteria.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The search query containing criteria to fetch product descriptions.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "searchByImage",
        description: "Allows a user to search using an image. ",
        parameters: {
          type: "object",
          properties: {
            placeholder: {
              type: "string",
              description:
                "A placeholder parameter when no specific parameters are needed",
            },
          },
          required: [],
        },
      },
      {
        name: "thankAndDeliver",
        description:
          "If the user mentions a delivery location then call this function. ",
        parameters: {
          type: "object",
          properties: {
            placeholder: {
              type: "string",
              description: "A delivery location. ",
            },
          },
          required: [],
        },
      },
      {
        name: "generalPrompt",
        description: "Execute this if no other function qualifies. ",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query that the user mentioned. ",
            },
          },
          required: ["query"],
        },
      },
    ],
  },
});

const Voice = ({ setFilters }) => {
  const [initialized, setInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Gemini model setup

  // Speech synthesis function
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find(
        (v) =>
          v.lang.includes("en-GB") && v.name.toLowerCase().includes("female")
      ) ||
      voices.find((v) => v.lang.includes("en-GB")) ||
      voices[0];
    utterance.pitch = 1.1;
    utterance.rate = 0.9;
    utterance.onstart = () => {
      setIsListening(false);
    };

    utterance.onend = () => {
      setIsListening(true);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleUnrecognizedCommand = async (userQuery) => {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userQuery }] }],
      });
      const response = await result.response;

      const functionCall =
        response?.candidates[0]?.content?.parts[0]?.functionCall;

      if (functionCall) {
        executeGeminiFunction(functionCall);
      }
    } catch (error) {
      console.error("Gemini error:", error);
      // speakText("An error occurred while processing your request.");
    }
  };

  const executeGeminiFunction = async (functionCall) => {
    const { name, args } = functionCall;

    switch (name) {
      case "addToCart":
        await addToCart(args.query);
        break;
      case "groupSearch":
        groupSearch(args.query);
        break;
      case "finalizeCart":
        await finalizeCart(args.confirmation);
        break;
      case "particularSearch":
        await particularSearch(args.query);
        break;
      case "filterInteraction":
        await filterInteraction(args.query);
        break;
      case "fetchProductDescription":
        await fetchProductDescription(args.query);
        break;
      case "recommendProducts":
        await getRecommendations();
        break;
      case "resetFilters":
        await resetFilters();
        break;
      case "searchByImage":
        await searchByImage();
        break;
      case "thankAndDeliver":
        await thankAndDeliveryDate();
        break;
      default:
        await generalPrompt();
    }
  };

  const generalPrompt = async (query) => {
    const response = await axios.get(`${BASE_URL}general_salesman/`, {
      params: { data: query },
    });
    console.log(response);
    speakText(response.data.message);
  };

  // Functions to execute specific commands
  const groupSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const addToCart = async (query) => {
    const urlParamsCart = new URLSearchParams(window.location.search);
    const searchQueryCart = urlParamsCart.get("search-item") || query;
    await axios.get(`${BASE_URL}add_to_cart/`, {
      params: { q: searchQueryCart },
    });
    navigate("/cart");
    speakText(
      `The products have been added to your cart. Do you want to checkout or do you want some recommendations. `
    );
  };
  const particularSearch = async (query) => {
    navigate({
      pathname: "/product",
      search: `?search-item=${encodeURIComponent(query)}`,
    });
    annyang.abort();
    // speakText(
    //   `Here are the details you asked for. Do you wanna know more about the product. `
    // );
    annyang.start();
  };

  const finalizeCart = async (confirmation) => {
    if (confirmation) {
      const response = await axios.get(`${BASE_URL}finalize_cart/`);
      speakText(response.data.message);
    }
  };

  const filterInteraction = async (query) => {
    const response = await axios.get(BASE_URL + "filter_conversationalist/", {
      params: {
        filterMsg: query,
      },
    });
    console.log(response);
    setFilters(response.data.filters);
    speakText(response.data.message);
  };

  const fetchProductDescription = async () => {
    const urlparams = new URLSearchParams(window.location.search);
    const searchQuery = urlparams.get("search-item") || "";
    console.log(searchQuery);
    const response = await axios.get(
      BASE_URL + "product_description_conversationalist/",
      { params: { search: searchQuery } }
    );
    console.log(response);
    speakText(response.data.message);
  };

  const getRecommendations = async () => {
    navigate("/recommendation");
    const response = await axios.get(
      `${BASE_URL}recommendations_conversationalist/`
    );
    console.log(response);
    speakText(response.data.message);
  };

  const resetFilters = async () => {
    const response = await axios.get(`${BASE_URL}filter_reset/`);
    speakText("The filters have been reset");
    setFilters([]);
  };

  const searchByImage = async () => {
    navigate("/image-search");
  };

  const thankAndDeliveryDate = async () => {
    navigate("thank-you");
    speakText(
      "Your order has been placed. Your purchase will be delivered within 7 to 10 business days. Thanks for shopping with us."
    );
  };

  const interactivityEnabler = async () => {
    switch (location.pathname) {
      case "/":
        const home_response = await axios.get(
          BASE_URL + "home_page_conversationalist"
        );
        console.log(home_response.data.message);
        speakText(home_response.data.message);
        break;
      case "/products":
        const urlParamsList = new URLSearchParams(window.location.search);
        const searchQueryList = urlParamsList.get("search") || "";
        const product_list_response = await axios.get(
          BASE_URL + "product_list_page_conversationalist",
          { params: { search: searchQueryList } }
        );
        console.log(product_list_response.data.message);
        speakText(product_list_response.data.message);
        break;
      case "/product":
        const urlParamsDetails = new URLSearchParams(window.location.search);
        const searchQueryDetails = urlParamsDetails.get("search-item") || "";
        const product_details_response = await axios.get(
          BASE_URL + "product_details_page_conversationalist",
          { params: { search: searchQueryDetails } }
        );
        console.log(product_details_response);
        speakText(product_details_response.data.message);
        break;
      case "/cart":
        const cart_response = await axios.get(
          BASE_URL + "cart_conversationalist/"
        );
        console.log(cart_response);
        speakText(cart_response.data.message);
        break;
      default:
      // alert("Navigated to a new page");
    }
  };

  useEffect(() => {
    const annyangInitiation = async () => {
      if (annyang) {
        // const commands = {
        //   "Hey nova": () => speakText("Hello! How can I help you?"),
        //   // GROUP SEARCH COMMANDS  ---------------------------------------------------
        //   // "*anything show *term": (anything, term) => groupSearch(term),
        //   // "*anything show me *term": (anything, term) => groupSearch(term),
        //   // "*anything are available *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything what are available *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything search *term": (anything, term) => groupSearch(term),
        //   // "*anything search for *term": (anything, term) => groupSearch(term),
        //   // "*anything find *term": (anything, term) => groupSearch(term),
        //   // "*anything find me *term": (anything, term) => groupSearch(term),
        //   // "*anything look for *term": (anything, term) => groupSearch(term),
        //   // "*anything look up *term": (anything, term) => groupSearch(term),
        //   // "*anything show results for *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything what *term": (anything, term) => groupSearch(term),
        //   // "*anything which *term": (anything, term) => groupSearch(term),
        //   // "*anything where can I find *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything do you have *term": (anything, term) => groupSearch(term),
        //   // "*anything is there *term": (anything, term) => groupSearch(term),
        //   // "*anything can I see *term": (anything, term) => groupSearch(term),
        //   // "*anything get me *term": (anything, term) => groupSearch(term),
        //   // "*anything show all *term": (anything, term) => groupSearch(term),
        //   // "*anything any *term available": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything list *term": (anything, term) => groupSearch(term),
        //   // "*anything list all *term": (anything, term) => groupSearch(term),
        //   // "*anything display *term": (anything, term) => groupSearch(term),
        //   // "*anything display all *term": (anything, term) => groupSearch(term),
        //   // "*anything search up *term": (anything, term) => groupSearch(term),
        //   // "*anything can you show me *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything give me *term": (anything, term) => groupSearch(term),
        //   // "*anything find results for *term": (anything, term) =>
        //   //   groupSearch(term),
        //   // "*anything help me find *term": (anything, term) => groupSearch(term),
        //   //GROUP SEARCH COMMANDS ------------------------------------------------------

        //   //PREVIOUS PAGE -------------------------------------------------------------
        //   "*something1 previous page": () => navigate(-1),
        //   // -------------------------------------------------------------------------
        //   // ADD ITEMS TO CART --------------------------------------------------------
        //   "add *item cart": (item) => addToCart(item),
        //   // --------------------------------------------------------------------------
        //   // SCROLL COMMANDS ----------------------------------------------------------
        //   "scroll down": () => window.scrollBy(0, 300), // Scroll down by 300px
        //   "scroll up": () => window.scrollBy(0, -300), // Scroll up by 300px
        //   //-----------------------------------------------------------------------------
        //   "*text1 filter *text2": (text1, text2) => {
        //     filterInteraction(text1 + text2);
        //     console.log("here");
        //   },
        // };
        const commands = {
          "*text1 description": () => fetchProductDescription(),
          "scroll down": () => window.scrollBy(0, 300), // Scroll down by 300px
          "scroll up": () => window.scrollBy(0, -300), // Scroll up by 300px
          "*text previous page": () => navigate(-1),
          "add it to my cart": () => addToCart("dummy"),
          "*text nova": async () => {
            setInitialized(!initialized)
            await interactivityEnabler()
          },
          "*text stop": async () => {
            setInitialized(!initialized)
            annyang.abort()
          } 
        };

        annyang.addCommands(commands);

        annyang.addCallback("resultNoMatch", (userSaid) => {
          setTranscript(userSaid[0]);
          console.log(transcript);
          handleUnrecognizedCommand(userSaid[0]);
        });

        // annyang.addCallback("start", () => setIsListening(true));
        // annyang.addCallback("end", () => setIsListening(false));

        annyang.setLanguage("en-US");
      }
    };
    annyangInitiation();
  }, []);

  useEffect(() => {
    if (!initialized) {
      return
    }
    interactivityEnabler();
  }, [location]);

  const handleButtonClick = () => {
    if (!isListening) {
      annyang.start({ autoRestart: true, continuous: false });
    } else {
      annyang.abort();
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    annyang.start({ autoRestart: true, continuous: false });
  }, [])

  return (

    <div className="fixed bottom-4 right-4 z-50 flex justify-center items-center">
      {/* Voice Bot Button */}
      <div
        onClick={handleButtonClick}
        className={`voice-bot ${initialized ? "active" : ""}`}
      >
        <div className="center-icon">🎙️</div>
        {initialized && (
          <>
            <div className="pulse"></div>
            <div className="orbit">
              <span className="dot"></span>
              <span className="dot delay-1"></span>
              <span className="dot delay-2"></span>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
    .voice-bot {
      position: relative;
      width: 80px;
      height: 80px;
      background-color: black;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .voice-bot.active {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(0, 200, 255, 0.8),
        0 0 40px rgba(0, 200, 255, 1);
    }

    .center-icon {
      font-size: 28px;
      color: white;
      z-index: 2;
    }

    .pulse {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 3px solid rgba(0, 200, 255, 0.6);
      border-radius: 50%;
      animation: pulseEffect 1.5s infinite;
      z-index: 1;
    }

    @keyframes pulseEffect {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    .orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120px;
      height: 120px;
      transform: translate(-50%, -50%);
      animation: rotate 3s linear infinite;
      z-index: 0;
    }

    @keyframes rotate {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    .dot {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: rgba(0, 200, 255, 0.8);
      border-radius: 50%;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: orbitDot 1.5s infinite;
    }

    .dot.delay-1 {
      animation-delay: 0.5s;
    }

    .dot.delay-2 {
      animation-delay: 1s;
    }

    @keyframes orbitDot {
      0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
      100% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `}</style>
    </div>

  );
};

export default Voice;
