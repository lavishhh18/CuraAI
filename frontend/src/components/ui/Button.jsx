import { useCuraTheme } from "../../hooks/useCuraTheme";

const variants = {
  primary: "primary",
  ai: "ai",
  ghost: "ghost",
  soft: "soft",
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
  style,
  type = "button",
  fullWidth,
}) {
  const { btn } = useCuraTheme();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...btn[variants[variant] || "primary"],
        width: fullWidth ? "100%" : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
