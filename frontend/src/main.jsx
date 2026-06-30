import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/ThemeContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in frontend/.env.");
}

const clerkAppearance = {
  baseTheme: "light",
  variables: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    colorPrimary: "#0D9488",
    colorText: "#111827",
    colorTextSecondary: "#64748B",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#F8FAFC",
    borderRadius: "16px",
  },
  elements: {
    rootBox: { width: "100%" },
    card: { boxShadow: "none", border: "none", background: "transparent" },
    cardBox: { boxShadow: "none", border: "none", background: "transparent" },
    header: { display: "none" },
    footer: { background: "transparent", border: "none" },
    footerPages: { background: "transparent", border: "none" },
    navbar: { display: "none" },
    navbarButtons: { display: "none" },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);
