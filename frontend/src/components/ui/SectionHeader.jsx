import { useCuraTheme } from "../../hooks/useCuraTheme";

export default function SectionHeader({ title, subtitle, action }) {
  const { c } = useCuraTheme();
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: "20px",
      flexWrap: "wrap",
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(22px, 4vw, 28px)",
          fontWeight: "700",
          color: c.text,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: c.textMuted, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
