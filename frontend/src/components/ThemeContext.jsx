import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("curaAIDarkMode") === "true");

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("curaAIDarkMode", String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div
        data-theme={dark ? "dark" : "light"}
        style={{
          background: dark ? "#09090b" : "#fafafa",
          minHeight: "100vh",
          color: dark ? "#fafafa" : "#18181b",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
