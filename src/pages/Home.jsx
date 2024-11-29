import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [speechStarted, setSpeechStarted] = useState(false);
  useEffect(() => {
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

    // Message to be read out
    const welcomeMessage =
      "Welcome to Lululemon. I am VOI, your personal voice assistant. Are you looking for a list of products or do you have something specific in your mind?";

    speakMessage(welcomeMessage);
  }, []); // Empty dependency array to ensure this runs only once on page load

  return (
    <div className="container mx-auto">
      {/* Banner Section */}
      <div className="relative">
        <img
          src="https://images.lululemon.com/is/image/lululemon/NA_NOV24_HMD24_BlackFriday_Ecomm_Homepage_1_1_Med_MediaAction_D_Shorts_Pants?wid=1600&op_usm=0.5,2,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72"
          alt="Shop the latest"
          className="w-full h-[400px] object-cover rounded-lg shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Discover Your Style</h1>
            <p className="mt-4 text-lg">
              Shop the latest collection of activewear and casual wear.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-4 p-4">
        <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <img
              src="https://images.lululemon.com/is/image/lululemon/LW3FGDS_026865_1?wid=1440&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72"
              alt="Collection 1"
              className="w-full h-[300px] object-cover rounded-lg shadow-md"
            />
            <h3 className="mt-4 text-lg font-semibold">Activewear</h3>
            <p className="text-gray-600">Stay fit in style.</p>
          </div>
          <div>
            <img
              src="https://images.lululemon.com/is/image/lululemon/LM3DSKS_038570_1?wid=1440&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72"
              alt="Collection 2"
              className="w-full h-[300px] object-cover rounded-lg shadow-md"
            />
            <h3 className="mt-4 text-lg font-semibold">Casual Wear</h3>
            <p className="text-gray-600">Effortless comfort for your day.</p>
          </div>
          <div>
            <img
              src="https://images.lululemon.com/is/image/lululemon/LW3DAMS_032894_1?wid=1440&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72"
              alt="Collection 3"
              className="w-full h-[300px] object-cover rounded-lg shadow-md"
            />
            <h3 className="mt-4 text-lg font-semibold">Accessories</h3>
            <p className="text-gray-600">Gear up for your workout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
