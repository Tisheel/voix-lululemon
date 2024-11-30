import React, { useContext } from "react";
import VoiceContext from "./VoiceContext";


const Voice = () => {

  const { handleButtonClick, isListening } = useContext(VoiceContext)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex justify-center items-center">
      {/* Toggle Circle */}
      <div
        onClick={handleButtonClick} // Use handleButtonClick to toggle state
        className={`circle ${isListening ? "listening" : ""}`}
      >
        {isListening ? (
          <div className="wavy">
            <div className="cylinder delay-0"></div>
            <div className="cylinder delay-200"></div>
            <div className="cylinder delay-400"></div>
          </div>
        ) : <span className="font-mono font-bold">Nova</span>}
      </div>

      <style jsx>{`
      .circle {
        width: 60px;
        height: 60px;
        background-color: gold;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
        position: relative;
      }

      .circle.listening {
        background-color: transparent; /* Hide the black background */
      }

      .wavy {
        display: flex;
        gap: 4px;
        position: absolute;
      }

      .cylinder {
        width: 18px;
        height: 40px;
        background-color: gold;
        border-radius: 50px;
        animation: wave 1.5s infinite;
      }

      .cylinder.delay-200 {
        animation-delay: 0.2s;
      }

      .cylinder.delay-400 {
        animation-delay: 0.4s;
      }

      @keyframes wave {
        0%,
        100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.5);
        }
      }
    `}</style>
    </div>
  );
};

export default Voice;
