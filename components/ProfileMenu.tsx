import React, { useState, useRef, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ProfileMenuProps {
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🟢 1️⃣ Listen for auth updates (fix for photo not showing)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🟢 2️⃣ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[#00CCFF20] transition-all duration-200"
      >
        <img
          src={
            user?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="User"
          className="w-8 h-8 rounded-full border border-[#0CF]/40 object-cover"
        />
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg backdrop-blur-md border ${
            theme === "cyan"
              ? "bg-[#001219cc] border-[#00CCFF40]"
              : "bg-[#1a0016cc] border-[#ff009d40]"
          }`}
        >
          <div className="px-4 py-3 border-b border-gray-600/40">
            <p className="font-semibold text-white text-sm">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={onLogout}
            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-b-xl transition-all duration-200 ${
              theme === "cyan"
                ? "hover:bg-[#00CCFF30] text-[#0CF]"
                : "hover:bg-[#ff009d30] text-[#ff66c4]"
            }`}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
