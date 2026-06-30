import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { copy } from "../cura/copy";
import { PenLine } from "lucide-react";
import api from "../api";

const moods = [
  { emoji: "😊", label: "Great", color: "#059669" },
  { emoji: "🙂", label: "Good", color: "#6366F1" },
  { emoji: "😐", label: "Okay", color: "#D97706" },
  { emoji: "😔", label: "Low", color: "#EA580C" },
  { emoji: "😣", label: "Difficult", color: "#DC2626" },
];

export default function Reflections() {
  const { user } = useUser();
  const { c, radius, input, btn } = useCuraTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/journal/${user.id}`).then((res) => setPastEntries(res.data.entries || []));
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!selectedMood || !entry.trim()) return;
    setLoading(true);
    try {
      await api.post("/journal/", { clerk_id: user.id, mood: selectedMood, text: entry, tags: [] });
      setSaved(true);
      setEntry("");
      setSelectedMood(null);
      setTimeout(() => setSaved(false), 2000);
      const res = await api.get(`/journal/${user.id}`);
      setPastEntries(res.data.entries || []);
    } catch {
      alert("Unable to save reflection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <SectionHeader title={copy.reflections.title} subtitle={copy.reflections.subtitle} />

      <div className="cura-grid-2">
        <div className="cura-stack">
          <Card elevated>
            <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>{copy.reflections.mood}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {moods.map((m) => (
                <button key={m.label} onClick={() => setSelectedMood(m.label)} style={{
                  flex: "1 1 70px", padding: "12px 8px", borderRadius: radius.md, cursor: "pointer",
                  border: selectedMood === m.label ? `2px solid ${m.color}` : `1px solid ${c.border}`,
                  background: selectedMood === m.label ? `${m.color}12` : c.bgSubtle,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>{m.emoji}</div>
                  <div style={{ fontSize: "12px", color: c.textMuted, fontWeight: "500" }}>{m.label}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card elevated>
            <p style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: c.text }}>{copy.reflections.write}</p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Capture what's on your mind — thoughts, wins, challenges, or gratitude."
              rows={6}
              style={{ ...input, resize: "none", lineHeight: 1.6 }}
            />
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedMood || !entry.trim()}
              fullWidth
              style={{ marginTop: "12px", background: saved ? c.success : c.primary }}
            >
              {loading ? "Saving…" : saved ? copy.reflections.saved : copy.reflections.save}
            </Button>
          </Card>
        </div>

        <Card elevated>
          <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "600", color: c.text }}>{copy.reflections.history}</p>
          <p style={{ margin: "0 0 20px", fontSize: "13px", color: c.textMuted }}>{pastEntries.length} reflection{pastEntries.length !== 1 ? "s" : ""} captured</p>
          {pastEntries.length === 0 ? (
            <EmptyState icon={PenLine} title="No reflections yet" description={copy.reflections.empty} />
          ) : (
            pastEntries.map((e) => (
              <div key={e.entry_id} style={{ padding: "16px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: c.textMuted }}>
                  {new Date(e.timestamp).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "600", color: c.text }}>{e.mood}</p>
                <p style={{ margin: 0, fontSize: "14px", color: c.textSecondary, lineHeight: 1.55 }}>{e.text}</p>
              </div>
            ))
          )}
        </Card>
      </div>
    </AppShell>
  );
}
