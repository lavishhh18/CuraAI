import { useCuraTheme } from "../../hooks/useCuraTheme";

export default function Card({ children, elevated, padding = "20px", style, onClick, className }) {
  const { card, cardElevated } = useCuraTheme();
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...(elevated ? cardElevated : card),
        padding,
        ...(onClick ? { cursor: "pointer" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
