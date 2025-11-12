import React from "react";
import { useTheme } from "../context/ThemeContext";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold text-[#0CF] mb-3">Settings</h2>
      <p className="text-gray-400 text-sm mb-6">Customize your Raizian AI Mentor theme ⚙️</p>

      <div
        className={`${
          theme === "cyan"
            ? "bg-[#111]/80 border-[#0CF]/30 shadow-[inset_0_0_10px_rgba(0,204,255,0.25)]"
            : "bg-[#111]/80 border-[#ff009d]/30 shadow-[inset_0_0_10px_rgba(255,0,157,0.25)]"
        } border p-5 rounded-xl w-[300px] transition-all duration-300`}
      >
        <label className="block mb-2 text-sm font-medium text-gray-300">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "cyan" | "pink")}
          className="w-full bg-[#1b1b1b] border border-[#333] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0CF] text-[#ddd]"
        >
          <option value="cyan">💠 Cyan Glow (Default)</option>
          <option value="pink">🌸 Neon Pink Glow</option>
        </select>
      </div>

      <p className="mt-5 text-xs text-gray-500">Theme changes instantly — no reload needed ⚡</p>
    </div>
  );
};

export default Settings;
