import React, { useState, useEffect, useRef } from "react";
import { chatBotResponse } from "../services/api";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: "assistant", content: "Hi! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to newest message on new message or open toggle
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Send user message and get bot reply
  async function handleSend() {
    if (!input.trim()) return;
    const userMessage = { id: messages.length, role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatBotResponse(input.trim());
      const botMessage = {
        id: messages.length + 1,
        role: "assistant",
        content: response.message || "Sorry, I didn’t get that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log(error);
      
      setMessages((prev) => [
        ...prev,
        { id: messages.length + 1, role: "assistant", content: "Error contacting chatbot." },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        aria-label="Toggle chat"
        title="Chat with us"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-red-900 shadow-lg p-4 hover:from-red-800 hover:via-red-900 hover:to-red-950 focus:outline-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h7m-2 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-8 w-80 max-h-[500px] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden z-50">
          <header className="bg-gradient-to-r from-red-700 to-red-800 p-4 text-white font-bold text-lg flex justify-between items-center rounded-t-3xl">
            Chatbot
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white hover:text-red-300 text-2xl select-none"
            >
              &times;
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-red-50">
            {messages.map(({ id, role, content }) => (
              <div
                key={id}
                className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 text-sm whitespace-pre-line font-sans ${
                    role === "user"
                      ? "bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg"
                      : "bg-white border border-red-200 shadow-sm text-red-900"
                  }`}
                >
                  {content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl p-4 text-sm bg-white border border-red-200 italic text-red-400 shadow-sm">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Softened red input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-red-300 flex items-center gap-3 rounded-b-3xl bg-red-100"
          >
            <input
              type="text"
              className="flex-1 rounded-xl border border-red-200 p-3 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none transition font-sans"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-red-700 px-5 py-2 text-white font-semibold hover:bg-red-800 disabled:opacity-50 transition"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
