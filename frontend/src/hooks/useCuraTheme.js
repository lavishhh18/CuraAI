import { useTheme } from "../components/ThemeContext";
import { palette, radius, space, typography } from "../cura/tokens";

export function useCuraTheme() {
  const { dark, toggle } = useTheme();
  const c = dark ? palette.dark : palette.light;

  const card = {
    background: c.surface,
    borderRadius: radius.lg,
    border: `1px solid ${c.border}`,
  };

  const cardElevated = {
    ...card,
    boxShadow: dark ? "0 1px 0 rgba(255,255,255,0.04)" : "0 1px 3px rgba(28,25,23,0.04), 0 8px 24px rgba(28,25,23,0.04)",
  };

  const input = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: radius.md,
    border: `1px solid ${c.border}`,
    background: c.bgSubtle,
    color: c.text,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return {
    dark,
    toggle,
    c,
    radius,
    space,
    typography,
    card,
    cardElevated,
    input,
    btn: {
      primary: {
        padding: "10px 18px",
        borderRadius: radius.md,
        border: "none",
        background: c.primary,
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "opacity 0.15s",
      },
      ai: {
        padding: "10px 18px",
        borderRadius: radius.md,
        border: "none",
        background: c.ai,
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
      },
      ghost: {
        padding: "10px 16px",
        borderRadius: radius.md,
        border: `1px solid ${c.border}`,
        background: "transparent",
        color: c.textSecondary,
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
      },
      soft: {
        padding: "10px 16px",
        borderRadius: radius.md,
        border: "none",
        background: c.primarySoft,
        color: c.primary,
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
      },
    },
  };
}
