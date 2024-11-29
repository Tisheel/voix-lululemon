import React, { useEffect, useState, useRef } from "react";
import annyang from 'annyang'

const Voice = () => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Speech synthesis function
    const speakText = (text) => {
        if (!('speechSynthesis' in window)) {
            console.error('Text-to-Speech is not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Get available voices
        const voices = window.speechSynthesis.getVoices();

        // Look for a British female voice
        const britishFemaleVoice = voices.find(voice =>
            voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('female')
        ) || // First choice: Explicitly labeled British female voice
            voices.find(voice =>
                voice.lang.includes('en-GB')
            ) || // Second choice: Any British voice
            voices.find(voice =>
                voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
            ) || // Third choice: Any English female voice
            voices.find(voice =>
                voice.lang.startsWith('en')
            ); // Fallback: Any English voice

        if (britishFemaleVoice) {
            utterance.voice = britishFemaleVoice;
            console.log('Selected voice:', britishFemaleVoice.name);
        } else {
            console.warn('No suitable British female voice found');
        }

        // Configure speech properties
        utterance.pitch = 1.1;    // Slightly higher pitch for female voice
        utterance.rate = 0.9;     // Slightly slower for British accent clarity
        utterance.volume = 1;

        // Add event handlers
        utterance.onstart = () => {
            console.log('Speech started');
            setIsSpeaking(true);

            // Pause listening while speaking
            if (isListening) {
                annyang.pause();
            }
        };

        utterance.onend = () => {
            console.log('Speech ended');
            setIsSpeaking(false);

            // Resume listening after speaking if it was previously active
            if (isListening) {
                setTimeout(() => {
                    annyang.resume();
                }, 250);
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
            setIsSpeaking(false);

            // Resume listening after error if it was previously active
            if (isListening) {
                annyang.resume();
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    // Initialize Annyang on component mount
    useEffect(() => {
        // Load voices when they're ready
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }

        // Check if annyang is available
        if (annyang) {
            // Define commands
            const commands = {
                'Hey nova': () => {
                    speakText("Welcome to lulu lemon, I am NOVA your personal voice assistant. Are you looking for a list of products or do you have something specific in your mind ?");
                },
                'hello': () => {
                    speakText("Hi there! How can I assist you?");
                }
            };

            // Add commands to annyang
            annyang.addCommands(commands);

            // Add event listeners
            annyang.addCallback('start', () => {
                console.log('Speech recognition started');
                setIsListening(true);
            });

            annyang.addCallback('end', () => {
                console.log('Speech recognition ended');
                setIsListening(false);
            });

            annyang.addCallback('error', (error) => {
                console.error('Speech recognition error:', error);
                setIsListening(false);
            });

            // Set language
            annyang.setLanguage('en-US');
        } else {
            console.error('Annyang not available');
        }

        // Cleanup
        return () => {
            if (annyang) {
                annyang.abort();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    // Toggle listening function
    const toggleListening = () => {
        if (annyang) {
            if (isListening) {
                annyang.abort();
                setIsListening(false);
            } else {
                annyang.start({ autoRestart: true, continuous: false });
                setIsListening(true);
            }
        }
    };

    return (
        <div>
            {/* Voice Control Buttons */}
            <div className="fixed bottom-4 right-4 z-50 flex gap-4">
                <button
                    onClick={toggleListening}
                    className={`${isListening ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
                        } text-white font-bold py-2 px-4 rounded flex items-center gap-2`}
                >
                    {isListening ? (
                        <>
                            <span className="animate-pulse">●</span>
                            Stop Listening
                        </>
                    ) : (
                        'Start Listening'
                    )}
                </button>
            </div>
        </div>
    )
}

export default Voice