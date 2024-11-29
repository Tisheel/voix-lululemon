import React, { useEffect, useState } from "react";
import annyang from "annyang";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../urls/urls";

// Gemini API initialization
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCAUsw6x2fBnBseE5BazF0F-cwKAtO5Tic");

const Voice = () => {
  const [initialized, setInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

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
    //speakText("I didn't understand that. Let me check.");
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
        speakText("Sorry, I couldn't find an appropriate action.");
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

  const getFilters = async (query) => {
    const prompt = "";
  };

  useEffect(() => {
    const annyangInitiation = async () => {
      if (annyang) {
        const commands = {
          "Hey nova": () => speakText("Hello! How can I help you?"),
          // GROUP SEARCH COMMANDS  ---------------------------------------------------
          "*anything show *term": (anything, term) => groupSearch(term),
          "*anything show me *term": (anything, term) => groupSearch(term),
          "*anything are available *term": (anything, term) =>
            groupSearch(term),
          "*anything what are available *term": (anything, term) =>
            groupSearch(term),
          "*anything search *term": (anything, term) => groupSearch(term),
          "*anything search for *term": (anything, term) => groupSearch(term),
          "*anything find *term": (anything, term) => groupSearch(term),
          "*anything find me *term": (anything, term) => groupSearch(term),
          "*anything look for *term": (anything, term) => groupSearch(term),
          "*anything look up *term": (anything, term) => groupSearch(term),
          "*anything show results for *term": (anything, term) =>
            groupSearch(term),
          "*anything what *term": (anything, term) => groupSearch(term),
          "*anything which *term": (anything, term) => groupSearch(term),
          "*anything where can I find *term": (anything, term) =>
            groupSearch(term),
          "*anything do you have *term": (anything, term) => groupSearch(term),
          "*anything is there *term": (anything, term) => groupSearch(term),
          "*anything can I see *term": (anything, term) => groupSearch(term),
          "*anything get me *term": (anything, term) => groupSearch(term),
          "*anything show all *term": (anything, term) => groupSearch(term),
          "*anything any *term available": (anything, term) =>
            groupSearch(term),
          "*anything list *term": (anything, term) => groupSearch(term),
          "*anything list all *term": (anything, term) => groupSearch(term),
          "*anything display *term": (anything, term) => groupSearch(term),
          "*anything display all *term": (anything, term) => groupSearch(term),
          "*anything search up *term": (anything, term) => groupSearch(term),
          "*anything can you show me *term": (anything, term) =>
            groupSearch(term),
          "*anything give me *term": (anything, term) => groupSearch(term),
          "*anything find results for *term": (anything, term) =>
            groupSearch(term),
          "*anything help me find *term": (anything, term) => groupSearch(term),
          //GROUP SEARCH COMMANDS ------------------------------------------------------
          //PARTICULAR SEARCH COMMANDS -------------------------------------------------
          "*anything tell me about the *product": (anything, product) =>
            particularSearch(product),
          "*anything tell me about *product": (anything, product) =>
            particularSearch(product),
          "*anything can you show me *product": (anything, product) =>
            particularSearch(product),
          "*anything what can you tell me about *product": (
            anything,
            product
          ) => particularSearch(product),
          "*anything what is *product": (anything, product) =>
            particularSearch(product),
          "*anything do you have *product": (anything, product) =>
            particularSearch(product),
          "*anything I want to know about *product": (anything, product) =>
            particularSearch(product),
          "*anything show me *product": (anything, product) =>
            particularSearch(product),
          "*anything can you give me details about *product": (
            anything,
            product
          ) => particularSearch(product),
          "*anything tell me more about *product": (anything, product) =>
            particularSearch(product),
          //----------------------------------------------------------------------------

          //PREVIOUS PAGE -------------------------------------------------------------
          "*something1 previous page": () => navigate(-1),
          // -------------------------------------------------------------------------
          // ADD ITEMS TO CART --------------------------------------------------------
          "add *item cart": (item) => addToCart(item),
          // --------------------------------------------------------------------------
          // SCROLL COMMANDS ----------------------------------------------------------
          "scroll down": () => window.scrollBy(0, 300), // Scroll down by 300px
          "scroll up": () => window.scrollBy(0, -300), // Scroll up by 300px
        };

        annyang.addCommands(commands);

        annyang.addCallback("resultNoMatch", (userSaid) => {
          setTranscript(userSaid[0]);
          console.log(transcript);
          handleUnrecognizedCommand(userSaid[0]);
        });

        annyang.addCallback("start", () => setIsListening(true));
        annyang.addCallback("end", () => setIsListening(false));

        annyang.setLanguage("en-US");
        // annyang.start({ autoRestart: true, continuous: false });
        // annyang.abort();
      }
    };
    annyangInitiation();
  }, []);

  // useEffect(() => {
  //   const speakWelcomeMessage = () => {
  //     if (window.speechSynthesis.getVoices().length > 0) {
  //       speakText(
  //         "Welcome to lulu lemon, I am voi your personal voice assistant. Are you looking for a list of products or do you have something specific in your mind?"
  //       );
  //     } else {
  //       window.speechSynthesis.onvoiceschanged = () => {
  //         speakText(
  //           "Welcome to lulu lemon, I am voi your personal voice assistant. Are you looking for a list of products or do you have something specific in your mind?"
  //         );
  //       };
  //     }
  //   };
  //   setTimeout(speakWelcomeMessage, 500);
  // }, []);
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
