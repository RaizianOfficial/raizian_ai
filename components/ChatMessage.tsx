import React from "react";
import { type DisplayMessage, MessageAuthor } from "../types";

export const ChatMessage: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`p-3 rounded-lg max-w-lg whitespace-pre-wrap leading-relaxed ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
        }`}
      >
        {/* ✅ Render the message text, never a function */}
        {message.text || ""}
      </div>
    </div>
  );
};
