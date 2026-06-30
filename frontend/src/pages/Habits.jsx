import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useResponsive } from "../hooks/useMediaQuery";
import { copy } from "../cura/copy";
import { Repeat } from "lucide-react";
import api from "../api";

const DEFAULT_HABITS = {
  morning_walk: false,
  meditate: false,
  no_junk_food: false,
  exercise: false,
  sleep_by_11: false,
};

const HABIT_LABELS = {
  morning_walk: { label: "Morning walk", desc: "Start the day with movement" },
  meditate: { label: "Meditate 10 minutes", desc: "Center your mind" },
  no_junk_food: { label: "Nourishing choices", desc: "Skip processed food today" },
  exercise: { label: "Stretch & exercise", desc: "Move your body intentionally" },
  sleep_by_11: { label: "Sleep by 11 PM", desc: "Protect your recovery" },
};

export default function Habits() {
  const { user } = useUser();
  const { c, radius } = useCuraTheme();
  const { isMobile } = useResponsive();
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/health/${user.id}/today`)
      .then((res) => {
        const log = res.data.log;
        if (log?.habits) setHabits({ ...DEFAULT_HABITS, ...log.habits });
      })
      .finally(() => setLoaded(true));
  }, [user?.id]);

  const saveHabits = async (updated) => {
    setSaving(true);
    try {
      await api.post("/health/", {
        clerk_id: user.id,
        sleep_hours: "",
        steps: "",
        water_glasses: "0",
        heart_rate: "",
        bmi: "",
        habits: updated,
      });
    } catch (err) {
      console.error("Failed to save habits:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    saveHabits(updated);
  };

  const done = Object.values(habits).filter(Boolean).length;
  const total = Object.keys(HABIT_LABELS).length;
  const pct = Math.round((done / total) * 100);

  return (
    <AppShell>
      <SectionHeader title={copy.habits.title} subtitle={copy.habits.subtitle} />

      <Card elevated style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: c.textMuted, fontWeight: "500" }}>{copy.habits.today}</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: c.text, letterSpacing: "-0.03em" }}>{done}/{total}</p>
          </div>
          <div style={{ flex: 1, minWidth: "200px", maxWidth: isMobile ? "100%" : "320px" }}>
            <div style={{ height: "8px", borderRadius: radius.full, background: c.border, marginBottom: "8px" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: radius.full, background: c.primary, transition: "width 0.4s" }} />
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: c.textMuted }}>
              {done === total ? "Every habit complete. Excellent consistency." : `${total - done} remaining today.`}
              {saving && " · Saving…"}
            </p>
          </div>
        </div>
      </Card>

      {!loaded ? (
        <p style={{ color: c.textMuted }}>Loading habits…</p>
      ) : (
        <div className="cura-stack">
          {Object.entries(HABIT_LABELS).map(([key, { label, desc }]) => (
            <Card
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                borderColor: habits[key] ? c.primary : c.border,
                background: habits[key] ? c.primarySoft : c.surface,
              }}
            >
              <div style={{
                width: "28px", height: "28px", borderRadius: radius.full, flexShrink: 0,
                border: `2px solid ${habits[key] ? c.primary : c.border}`,
                background: habits[key] ? c.primary : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "14px", fontWeight: "700",
              }}>
                {habits[key] ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "600", color: c.text }}>{label}</p>
                <p style={{ margin: 0, fontSize: "13px", color: c.textMuted }}>{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
