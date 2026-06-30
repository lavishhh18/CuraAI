import { useCuraTheme } from "../../hooks/useCuraTheme";

export default function ProgressRing({ value = 0, size = 64, stroke = 5, color, label }) {
  const { c } = useCuraTheme();
  const ringColor = color || c.primary;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, value) / 100) * circ;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c.border} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={ringColor} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: size > 56 ? "16px" : "13px", fontWeight: "700", color: c.text }}>
          {Math.round(value)}%
        </span>
        {label && <span style={{ fontSize: "10px", color: c.textMuted }}>{label}</span>}
      </div>
    </div>
  );
}
