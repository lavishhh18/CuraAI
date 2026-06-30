import { useCuraTheme } from "../../hooks/useCuraTheme";

export default function EmptyState({ icon: Icon, title, description, action }) {
  const { c, radius } = useCuraTheme();
  return (
    <div style={{
      textAlign: "center",
      padding: "48px 24px",
      borderRadius: radius.lg,
      border: `1px dashed ${c.border}`,
      background: c.bgSubtle,
    }}>
      {Icon && (
        <div style={{
          width: "48px", height: "48px", borderRadius: radius.full,
          background: c.surface, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", color: c.textMuted,
        }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "600", color: c.text }}>{title}</p>
      <p style={{ margin: "0 0 20px", fontSize: "14px", color: c.textMuted, lineHeight: 1.5, maxWidth: "320px", marginInline: "auto" }}>{description}</p>
      {action}
    </div>
  );
}
