import React from "react";
import { DisplayMessage, MessageAuthor } from "../types";
import { useTheme } from "../context/ThemeContext";

interface Props {
  message: DisplayMessage;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const { theme } = useTheme();

  const isUser = message.author === MessageAuthor.USER;
  const bubbleColor =
    theme === "cyan"
      ? isUser
        ? "bg-[#0CF]/20 border border-[#0CF]/40"
        : "bg-[#002233]/70 border border-[#0CF]/20"
      : isUser
        ? "bg-[#ff009d30] border border-[#ff009d60]"
        : "bg-[#111]/70 border border-[#ff009d30]";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} transition-all duration-300`}
    >
      <div
        className={`max-w-[100%] md:max-w-[70%] text-sm rounded-2xl px-4 py-3 mb-3 shadow-[0_0_10px_rgba(0,0,0,0.3)] ${bubbleColor}`}
      >
        {message.text}
      </div>
    </div>
  );
};
