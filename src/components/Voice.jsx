import React, { useEffect, useState } from "react";
import annyang from "annyang";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../urls/urls";

// Gemini API initialization
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDj4YHEMjddEOTxlyfgdM4eu2glzCHQsFI");

const Voice = () => {
  const [initialized, setInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Gemini model setup
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
              query: { type: "string", description: "The item to add" },
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
          name: "fetchProductDescription",
          description:
            "Fetch product descriptions based on the provided search query for a particular product.",
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
      ],
    },
  });

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
      setIsSpeaking(true);
      setIsListening(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
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
      } else {
      }
    } catch (error) {
      console.error("Gemini error:", error);
      speakText("An error occurred while processing your request.");
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
        console.log("here too");
        await filterInteraction(args.query);
        break;
      case "fetchProductDescription":
        await fetchProductDescription(args.query);
        break;
      default:
        speakText("I couldn't perform that action.");
    }
  };

  // Functions to execute specific commands
  const groupSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const addToCart = async (query) => {
    await axios.get(`${BASE_URL}add_to_cart/`, { params: { q: query } });
    navigate("/cart");
    speakText(`${query} has been added to your cart.`);
  };
  const particularSearch = async (query) => {
    navigate({
      pathname: "/product",
      search: `?search=${encodeURIComponent(query)}`,
    });
    annyang.abort();
    speakText(
      `Here are the details you asked for. Do you wanna know more about the product. `
    );
    annyang.start();
  };

  const finalizeCart = async (confirmation) => {
    if (confirmation) {
      await axios.get(`/finalize_cart/`);
      speakText("Your cart has been finalized.");
    } else {
      speakText("Cart finalization canceled.");
    }
  };

  const filterInteraction = async (query) => {
    const response = await axios.get(BASE_URL + "filter_conversationalist/", {
      params: {
        filterMsg: query,
      },
    });
    console.log(response);
    speakText(response.data.message);
  };

  const fetchProductDescription = async (query) => {
    const response = await axios.get(
      BASE_URL + "product_description_conversationalist/",
      {
        params: {
          filterMsg: query,
        },
      }
    );
    console.log(response);
    speakText(response.data.message);
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

        // annyang.addCommands(commands);

        annyang.addCallback("resultNoMatch", (userSaid) => {
          setTranscript(userSaid[0]);
          console.log(transcript);
          handleUnrecognizedCommand(userSaid[0]);
        });

        annyang.addCallback("start", () => setIsListening(true));
        annyang.addCallback("end", () => setIsListening(false));

        annyang.setLanguage("en-US");
      }
    };
    annyangInitiation();
  }, []);

  useEffect(() => {
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
          const searchQueryDetails = urlParamsDetails.get("search") || "";
          const product_details_response = await axios.get(
            BASE_URL + "product_details_page_conversationalist",
            { params: { search: searchQueryDetails } }
          );
          console.log(product_details_response);
          speakText(product_details_response.data.message);
          break;
        case "/cart":
          alert("Checking out Cart");
          break;
        default:
          alert("Navigated to a new page");
      }
    };
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

  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <button
          onClick={handleButtonClick}
          className={`${
            isListening ? "bg-red-500" : "bg-green-500"
          } text-white font-bold py-2 px-4 rounded`}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
    </div>
  );
};

export default Voice;
