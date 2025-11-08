import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { type DisplayMessage, MessageAuthor } from "./types";
import { ChatMessage } from "./components/ChatMessage";
import { SendIcon } from "./components/Icons";

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      author: MessageAuthor.MODEL,
      text:
        "Hey there 👋 I'm Raizian Mentor. Let's build your learning roadmap step by step! What skill or goal are you focusing on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [nextStepLabel, setNextStepLabel] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isLoading]);

  // init chat session
  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({
          apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        });
        const chatSession = ai.chats.create({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
          },
        });
        setChat(chatSession);
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        setMessages((prev) => [
          ...prev,
          {
            author: MessageAuthor.MODEL,
            text:
              "There was an error initializing the AI. Please check your API key and refresh.",
          },
        ]);
      }
    };
    console.log("Gemini key:", import.meta.env.VITE_GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");
    initChat();
  }, []);

  // helper: simulate typing effect
  function typeOut(
    text: string,
    onUpdate: (cumulativeText: string) => void,
    onDone: () => void
  ) {
    const chunks = text.split(/(?<=[.!?])\s+/);
    let currentText = "";
    let i = 0;
    const tick = () => {
      if (i >= chunks.length) return onDone();
      currentText += chunks[i++] + " ";
      onUpdate(currentText); // Pass the cumulative text string
      setTimeout(tick, 320); // tweak 250–450ms
    };
    tick();
  }

  // send handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: DisplayMessage = { author: MessageAuthor.USER, text: input };
    // Add user message
    setMessages((prev) => [...prev, userMessage]);

    // This is the index the *new* model message placeholder will have
    // e.g., [M1, U1] (length 2). Placeholder will be at index 2.
    const newIndex = messages.length + 1;

    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setSuggestions([]);
    setNextStepLabel("");

    try {
      const schemaHint = `Always respond in JSON with keys: 
      reply (3–6 short sentences, <=2 emojis, end with 1 question), 
      suggested_questions (3 short items), 
      next_step_label (CTA).`;

      const result = await chat.sendMessage({
        message: `${schemaHint}\n\nUser: ${currentInput}`,
      });

      console.log("Raw Gemini response:", result);

      let payload: {
        reply?: string;
        suggested_questions?: string[];
        next_step_label?: string;
      } = {};

      // 🧠 Parse the response
      if (typeof result.text === "string" && result.text.trim().startsWith("{")) {
        try {
          payload = JSON.parse(result.text);
        } catch (err) {
          console.warn("Could not parse JSON text:", err);
          payload = { reply: result.text }; // Fallback
        }
      } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        try {
          payload = JSON.parse(result.candidates[0].content.parts[0].text);
        } catch {
          payload = { reply: result.candidates[0].content.parts[0].text }; // Fallback
        }
      }

      const finalText = payload.reply || "Oops! I couldn't find a reply. Please try again.";
      
      setSuggestions(
        Array.isArray(payload.suggested_questions)
          ? payload.suggested_questions.slice(0, 3)
          : []
      );
      setNextStepLabel(payload.next_step_label || "");

      // Add placeholder for typing
      setMessages((prev) => [
        ...prev,
        { author: MessageAuthor.MODEL, text: "..." }, // Placeholder
      ]);

      // Start typing effect
      typeOut(
        finalText,
        (cumulativeText) => { // This callback receives the full string
          setMessages((prev) => {
            const copy = [...prev];
            // Update the placeholder message at its correct index
            copy[newIndex] = {
              author: MessageAuthor.MODEL,
              text: cumulativeText,
            };
            return copy;
          });
        },
        () => {
          // Done typing
        }
      );

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: DisplayMessage = {
        author: MessageAuthor.MODEL,
        text:
          "Oops! Something went wrong while getting a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Raizian AI Mentor
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707-.707M6.343 17.657l-.707.707m12.728 0l.707.707M12 21v-1"
                  ></path>
                </svg>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 max-w-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 p-4 sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto flex items-center space-x-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Ask for a skill roadmap..."
            rows={1}
            className="flex-1 bg-gray-700 text-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>

        {(!isLoading && (suggestions.length > 0 || nextStepLabel)) && (
          <div className="max-w-3xl mx-auto mt-3">
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      setInput(q);
                    }}
                    className="px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-sm transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {nextStepLabel && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setInput(nextStepLabel);
                }}
                className="mt-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm transition"
              >
                {nextStepLabel}
              </button>
            )}
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;