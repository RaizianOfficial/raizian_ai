import React from "react";
import { useTheme } from "../context/ThemeContext";

interface HomeProps {
  setActivePage: (page: string) => void;
  setInput: (text: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActivePage, setInput }) => {
  const { theme } = useTheme();
  const glow = theme === "cyan" ? "#00CCFF" : "#ff009d";

  const quickPrompts = [
    {
      title: "Build a Skill Roadmap",
      desc: "Get a step-by-step learning plan for any skill like web dev, AI, or design.",
      prompt: "Create a learning roadmap for becoming a front-end developer",
      icon: "🚀",
    },
    {
      title: "Learn Something New",
      desc: "Let’s start from scratch — I’ll guide you through basics to advanced.",
      prompt: "Teach me the basics of JavaScript in a structured way",
      icon: "📘",
    },
    {
      title: "Career Guidance",
      desc: "Ask AI about trending skills, job paths, and what to learn next.",
      prompt: "Which tech skills are high in demand for 2025?",
      icon: "💼",
    },
    {
      title: "AI Productivity",
      desc: "Use Raizian for real-life help — study plans, projects, and goal setup.",
      prompt: "Make me a 30-day learning plan for AI tools and automation",
      icon: "🤖",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full px-6 py-12 transition-all duration-500`}
    >
      {/* Hero Section */}
      <div className="text-center mb-14">
        <h1
          className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${
            theme === "cyan" ? "text-[#0CF]" : "text-[#ff66c4]"
          }`}
        >
          Welcome to Raizian AI Mentor
        </h1>
        <p className="text-gray-400 text-base max-w-2xl mx-auto">
          Your personal AI guide for learning, growth, and skill-building.  
          Choose a prompt below to get started instantly 🚀
        </p>
      </div>

      {/* Prompt Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {quickPrompts.map((p, index) => (
          <div
            key={index}
            onClick={() => {
              setInput(p.prompt);
              setActivePage("chat");
            }}
            style={{
              borderColor: glow,
              boxShadow:
                theme === "cyan"
                  ? "0 0 15px rgba(0,204,255,0.25)"
                  : "0 0 15px rgba(255,0,157,0.25)",
            }}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl border bg-[#0a0a0a]/80 backdrop-blur-md p-6 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-2xl"
              style={{
                background:
                  theme === "cyan"
                    ? "linear-gradient(135deg, rgba(0,204,255,0.1), rgba(0,255,255,0.08))"
                    : "linear-gradient(135deg, rgba(255,0,157,0.12), rgba(255,100,180,0.08))",
              }}
            ></div>

            <div className="relative z-10">
              <div className="text-5xl mb-3">{p.icon}</div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  theme === "cyan" ? "text-[#0CF]" : "text-[#ff66c4]"
                }`}
              >
                {p.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{p.desc}</p>
            </div>

            <button
              className={`mt-5 text-sm px-3 py-2 rounded-lg font-medium ${
                theme === "cyan"
                  ? "bg-[#00CCFF30] hover:bg-[#00CCFF60] text-[#0CF]"
                  : "bg-[#ff009d20] hover:bg-[#ff009d40] text-[#ff66c4]"
              } transition-all duration-300`}
            >
              Start Chat →
            </button>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="mt-16 text-center text-gray-400 text-sm">
        <p>
          Powered by <span className="font-semibold text-white">Raizian</span> —  
          Your Mentor for Smarter Learning 💡
        </p>
      </div>
    </div>
  );
};

export default Home;
