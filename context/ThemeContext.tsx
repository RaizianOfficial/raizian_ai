import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ThemeContextType {
  theme: "cyan" | "pink";
  setTheme: (theme: "cyan" | "pink") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyan",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"cyan" | "pink">(
    (localStorage.getItem("raizian-theme") as "cyan" | "pink") || "cyan"
  );

  useEffect(() => {
    localStorage.setItem("raizian-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`min-h-screen font-sans transition-all duration-500 ${
          theme === "cyan"
            ? "bg-gradient-to-b from-[#00CCFF10] via-[#00CCFF20] to-[#00CCFF50] text-white"
            : "bg-gradient-to-b from-[#ff009d10] via-[#ff009d20] to-[#ff009d50] text-white"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
