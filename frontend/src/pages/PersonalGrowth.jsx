import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Target } from "lucide-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useResponsive } from "../hooks/useMediaQuery";
import { copy } from "../cura/copy";
import api from "../api";

const CATEGORY_COLORS = {
  Finance: "#EA580C", Health: "#059669", Learning: "#6366F1", Skills: "#0D9488", Personal: "#DB2777",
};

export default function PersonalGrowth() {
  const { user } = useUser();
  const { c, radius, input, btn } = useCuraTheme();
  const { isMobile } = useResponsive();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Finance", due_date: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/goals/${user.id}`).then((res) => setGoals(res.data.goals || []));
  }, [user?.id]);

  const refreshGoals = () => api.get(`/goals/${user.id}`).then((res) => setGoals(res.data.goals || []));

  const addGoal = async () => {
    if (!form.title) return;
    setLoading(true);
    try {
      await api.post("/goals/", {
        clerk_id: user.id, title: form.title, category: form.category,
        icon: "goals", target: "100", current: "0", due_date: form.due_date,
      });
      await refreshGoals();
      setShowForm(false);
      setForm({ title: "", category: "Finance", due_date: "" });
    } catch {
      alert("Unable to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (goal) => {
    try {
      const newCompleted = !goal.is_completed;
      await api.post("/goals/update", {
        clerk_id: user.id, goal_id: goal.goal_id,
        current: newCompleted ? String(goal.target || "100") : "0",
        is_completed: newCompleted,
      });
      await refreshGoals();
    } catch (err) {
      alert("Unable to update goal: " + (err.response?.data?.detail || err.message));
    }
  };

  const activeGoals = goals.filter((g) => !g.is_completed);
  const completedGoals = goals.filter((g) => g.is_completed);

  return (
    <AppShell>
      <SectionHeader
        title={copy.growth.title}
        subtitle={copy.growth.subtitle}
        action={<Button onClick={() => setShowForm(!showForm)}>{copy.growth.add}</Button>}
      />

      {showForm && (
        <Card elevated style={{ marginBottom: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Goal</label>
              <input placeholder="e.g. Save ₹5,000 this month" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>
                {Object.keys(CATEGORY_COLORS).map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Target date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} style={input} />
            </div>
            <Button onClick={addGoal} disabled={loading}>{loading ? "Creating…" : "Create"}</Button>
          </div>
        </Card>
      )}

      <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "600", color: c.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>{copy.growth.active}</p>

      {activeGoals.length === 0 ? (
        <EmptyState icon={Target} title="No active goals" description={copy.growth.empty} action={<Button variant="soft" onClick={() => setShowForm(true)}>{copy.growth.add}</Button>} />
      ) : (
        <div className="cura-stack" style={{ marginBottom: "28px" }}>
          {activeGoals.map((goal) => {
            const color = CATEGORY_COLORS[goal.category] || c.primary;
            const progress = Math.min(100, Math.round((parseFloat(goal.current) / parseFloat(goal.target)) * 100)) || 0;
            return (
              <Card key={goal.goal_id} elevated>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "600", color: c.text }}>{goal.title}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: c.textMuted }}>{goal.category}{goal.due_date ? ` · Due ${goal.due_date}` : ""}</p>
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: "700", color }}>{progress}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: radius.full, background: c.border, marginBottom: "14px" }}>
                  <div style={{ height: "100%", width: `${progress}%`, borderRadius: radius.full, background: color, transition: "width 0.4s" }} />
                </div>
                <Button variant="ghost" onClick={() => toggleDone(goal)} style={{ fontSize: "13px" }}>Mark as achieved</Button>
              </Card>
            );
          })}
        </div>
      )}

      {completedGoals.length > 0 && (
        <>
          <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "600", color: c.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>{copy.growth.completed}</p>
          <Card>
            {completedGoals.map((goal) => (
              <div key={goal.goal_id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
                <div style={{ width: "32px", height: "32px", borderRadius: radius.full, background: c.wellnessSoft, color: c.wellness, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>{goal.title}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>Achieved · {goal.due_date || "—"}</p>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </AppShell>
  );
}
