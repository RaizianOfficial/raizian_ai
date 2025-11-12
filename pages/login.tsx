import React, { useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "../src/firebaseConfig";
import { useTheme } from "../context/ThemeContext";

interface LoginProps {
  setActivePage: (page: string) => void;
  setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setActivePage, setUser }) => {
  const { theme } = useTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setActivePage("dashboard");
      }
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setActivePage("dashboard");
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setActivePage("login");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${
        theme === "cyan"
          ? "bg-gradient-to-b from-[#001219] via-[#001a26] to-[#001119]"
          : "bg-gradient-to-b from-[#1a0016] via-[#25001f] to-[#1a0016]"
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-8 ${
          theme === "cyan" ? "text-[#0CF]" : "text-[#ff66c4]"
        }`}
      >
        Raizian AI Mentor
      </h1>

      <button
        onClick={handleGoogleSignIn}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 shadow-md ${
          theme === "cyan"
            ? "bg-[#00CCFF] hover:bg-[#00a3cc]"
            : "bg-[#ff009d] hover:bg-[#d60082]"
        }`}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <p className="mt-10 text-xs text-gray-400">
        Secure sign-in powered by Firebase 🔐
      </p>
    </div>
  );
};

export default Login;
