import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { type DisplayMessage, MessageAuthor } from "./types";
import { ChatMessage } from "./components/ChatMessage";
import Login from "./pages/login";
import {
  SendIcon,
  MenuIcon,
  ChatIcon,
  ProfileIcon,
  DashboardIcon,
  NotificationsIcon,
  SettingsIcon,
  LogoutIcon,
} from "./components/Icons";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import ProfileMenu from "./components/ProfileMenu";
import { ChevronDown } from "lucide-react";
import { auth } from "./src/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      author: MessageAuthor.MODEL,
      text: "Hey there 👋 I'm Raizian AI Mentor. Let's build your learning roadmap step by step! What skill or goal are you focusing?",
    },
  ]);
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [nextStepLabel, setNextStepLabel] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("login");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setActivePage("dashboard");
      } else {
        setUser(null);
        setActivePage("login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const session = ai.chats.create({
      model: "gemini-2.5-flash",
      config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json" },
    });
    setChat(session);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: DisplayMessage = { author: MessageAuthor.USER, text: input };
    setMessages((prev) => [...prev, userMessage]);
    const newIndex = messages.length + 1;
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setSuggestions([]);
    setNextStepLabel("");

    try {
      const schemaHint = `Always respond in JSON with keys: reply, suggested_questions, next_step_label.`;
      const result = await chat.sendMessage({ message: `${schemaHint}\n\nUser: ${currentInput}` });
      let payload: any = {};
      try {
        payload = JSON.parse(result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}");
      } catch {
        payload = { reply: result.text ?? "..." };
      }

      const finalText = payload.reply || "Oops, I couldn’t get that.";
      setSuggestions(payload.suggested_questions ?? []);
      setNextStepLabel(payload.next_step_label ?? "");
      setMessages((p) => [...p, { author: MessageAuthor.MODEL, text: "Raizian AI is thinking..." }]);

      const typeOut = (text: string) => {
        const chunks = text.split(/(?<=[.!?])\s+/);
        let current = "";
        let i = 0;
        const tick = () => {
          if (i >= chunks.length) return;
          current += chunks[i++] + " ";
          setMessages((p) => {
            const c = [...p];
            c[newIndex] = { author: MessageAuthor.MODEL, text: current };
            return c;
          });
          setTimeout(tick, 300);
        };
        tick();
      };

      typeOut(finalText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutPopup(true);
    setTimeout(async () => {
      await signOut(auth);
      setUser(null);
      setShowLogoutPopup(false);
      setActivePage("login");
    }, 1500);
  };

  // 🟢 AUTH GUARD
  if (!user) {
    return (
      <ThemeProvider>
        <Login setActivePage={setActivePage} setUser={setUser} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-[#00CCFF05] via-[#00CCFF00] to-[#00CCFF20] text-white font-sans">
        {/* HEADER */}
        <header className="sticky top-0 z-[120] bg-gradient-to-r from-[#00CCFF20] via-[#00CCFF40] to-[#00CCFF20] backdrop-blur-md border-b border-[#0CF]/20 shadow-[0_0_20px_rgba(0,204,255,0.15)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full hover:bg-[#00CCFF20] transition-all duration-200"
          >
            <MenuIcon className="w-6 h-6 text-[#0CF]" />
          </button>

          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0CF] to-white tracking-wide select-none">
            Raizian AI Mentor
          </h1>

          <ProfileMenu onLogout={handleLogout} />
        </header>

        {/* SIDEBAR & OVERLAY */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        <aside
          className={`fixed top-0 left-0 h-full z-[120] bg-[#111] transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} w-[240px] sm:w-[260px] flex flex-col`}
        >
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="text-[#0CF] font-semibold text-lg mb-6">Raizian AI</div>
            <ul className="space-y-2 text-[#ccc] font-medium">
              <li onClick={() => { setActivePage("dashboard"); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0CF]/10 hover:text-[#0CF] cursor-pointer">
                <DashboardIcon className="w-5 h-5 text-[#0CF]" /> Dashboard
              </li>
              <li onClick={() => { setActivePage("chat"); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0CF]/10 hover:text-[#0CF] cursor-pointer">
                <ChatIcon className="w-5 h-5 text-[#0CF]" /> Mentor Chat
              </li>
              <li onClick={() => { setActivePage("notifications"); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0CF]/10 hover:text-[#0CF] cursor-pointer">
                <NotificationsIcon className="w-5 h-5 text-[#0CF]" /> Notifications
              </li>
              <li onClick={() => { setActivePage("settings"); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0CF]/10 hover:text-[#0CF] cursor-pointer">
                <SettingsIcon className="w-5 h-5 text-[#0CF]" /> Settings
              </li>
              <li onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 cursor-pointer mt-6">
                <LogoutIcon className="w-5 h-5 text-red-400" /> Logout
              </li>
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-[14px]">
          {activePage === "dashboard" && <Dashboard setActivePage={setActivePage} setInput={setInput} />}
          {activePage === "notifications" && <Notifications />}
          {activePage === "settings" && <Settings />}
          {activePage === "admin" && <AdminPanel />}
          {activePage === "chat" && (
            <>
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
            </>
          )}
        </main>

        {/* CHAT FOOTER */}
        {activePage === "chat" && (
          <footer className="sticky bottom-0 backdrop-blur-md bg-gradient-to-t from-[#00CCFF00] via-[#00CCFF20] to-[#00CCFF30] px-3 py-5 rounded-t-3xl border-t border-[#00CCFF30]">
            <form
              onSubmit={handleSendMessage}
              className="max-w-3xl mx-auto bg-[#00CCFF15] flex items-center gap-2 pr-1 pl-3 py-1 rounded-full shadow-[0_0_10px_#00CCFF10] border-2 border-[#00CCFF80] transition-all duration-200"
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
                placeholder="Ask Raizian AI"
                rows={1}
                className="flex-1 bg-transparent text-[#ddd] placeholder-[#fff] resize-none focus:outline-none focus:ring-0 text-sm p-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#00CCFF50] disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_10px_#00CCFF30]"
              >
                <SendIcon />
              </button>
            </form>
          </footer>
        )}

        {/* LOGOUT POPUP */}
        {showLogoutPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#111]/90 border border-[#0CF]/30 px-8 py-6 rounded-2xl shadow-[0_0_20px_#00CCFF40] text-center">
              <p className="text-[#0CF] text-lg font-semibold mb-2">Logging Out...</p>
              <p className="text-gray-400 text-sm">See you soon 👋</p>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
