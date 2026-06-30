import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { copy } from "../cura/copy";
import api from "../api";

const radarData = [
  { subject: "Finance", A: 70 }, { subject: "Sleep", A: 55 },
  { subject: "Exercise", A: 60 }, { subject: "Mood", A: 80 },
  { subject: "Goals", A: 65 }, { subject: "Social", A: 75 },
];

export default function Insights() {
  const { user } = useUser();
  const { c } = useCuraTheme();
  const [transactions, setTransactions] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/money/${user.id}`).then((r) => setTransactions(r.data.transactions || [])).catch(() => {});
    api.get(`/health/${user.id}`).then((r) => setHealthLogs(r.data.logs || [])).catch(() => {});
    api.get(`/goals/${user.id}`).then((r) => setGoals(r.data.goals || [])).catch(() => {});
  }, [user?.id]);

  const totalSpent = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const totalSaved = Math.max(0, transactions.filter((t) => t.type === "income").reduce((s, t) => s + parseFloat(t.amount || 0), 0) - totalSpent);
  const avgSleep = healthLogs.length ? (healthLogs.reduce((s, l) => s + parseFloat(l.sleep_hours || 0), 0) / healthLogs.length).toFixed(1) : "—";
  const goalProgress = goals.length ? Math.round(goals.reduce((s, g) => s + (parseFloat(g.current || 0) / parseFloat(g.target || 1)) * 100, 0) / goals.length) : 0;

  const monthlyData = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (4 - i));
    const month = d.toLocaleString("en-IN", { month: "short" });
    const monthStr = d.toISOString().slice(0, 7);
    const spent = transactions.filter((t) => t.type === "expense" && t.date?.startsWith(monthStr)).reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const saved = transactions.filter((t) => t.type === "income" && t.date?.startsWith(monthStr)).reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    return { month, spent, saved };
  });

  const tooltipStyle = { background: c.surface, border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "12px" };

  const insights = [
    {
      title: "Financial patterns",
      msg: totalSpent > 0
        ? `₹${totalSpent.toLocaleString("en-IN")} recorded in spending. ${totalSpent > 5000 ? "Review categories where you can optimize." : "Your spending patterns look balanced."}`
        : copy.insights.empty,
    },
    {
      title: "Sleep intelligence",
      msg: avgSleep !== "—"
        ? `${avgSleep} hours average sleep. ${parseFloat(avgSleep) < 7 ? "Prioritize rest — quality sleep improves every dimension of wellness." : "Your sleep patterns support strong recovery."}`
        : "Log sleep data to unlock rest and recovery insights.",
    },
    {
      title: "Growth trajectory",
      msg: goals.length > 0
        ? `${goalProgress}% average progress across ${goals.length} goal${goals.length !== 1 ? "s" : ""}. ${goalProgress > 50 ? "You're building meaningful momentum." : "Consistency compounds — keep showing up."}`
        : copy.insights.empty,
    },
  ];

  return (
    <AppShell>
      <SectionHeader title={copy.insights.title} subtitle={copy.insights.subtitle} />

      <div className="cura-grid-auto" style={{ marginBottom: "20px" }}>
        {[
          { label: "Total spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, sub: `${transactions.filter((t) => t.type === "expense").length} expenses` },
          { label: "Net saved", value: `₹${totalSaved.toLocaleString("en-IN")}`, sub: "Income minus expenses" },
          { label: "Avg sleep", value: `${avgSleep} hrs`, sub: `${healthLogs.length} days logged` },
          { label: "Goal progress", value: `${goalProgress}%`, sub: `${goals.filter((g) => g.is_completed).length}/${goals.length} achieved` },
        ].map(({ label, value, sub }) => (
          <Card key={label} elevated>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: c.textMuted }}>{label}</p>
            <p style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: c.text, letterSpacing: "-0.02em" }}>{value}</p>
            <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{sub}</p>
          </Card>
        ))}
      </div>

      <div className="cura-grid-2" style={{ marginBottom: "20px" }}>
        <Card elevated>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Income vs spending</p>
          {monthlyData.every((m) => m.spent === 0 && m.saved === 0) ? (
            <p style={{ fontSize: "14px", color: c.textMuted }}>{copy.insights.empty}</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="spent" fill={c.danger} radius={[4, 4, 0, 0]} name="Spent" />
                <Bar dataKey="saved" fill={c.success} radius={[4, 4, 0, 0]} name="Income" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card elevated>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Wellness dimensions</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={c.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: c.textMuted }} />
              <Radar dataKey="A" stroke={c.ai} fill={c.ai} fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card elevated style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Intelligence from Cura</p>
        <div className="cura-grid-3">
          {insights.map(({ title, msg }) => (
            <div key={title} style={{ padding: "16px", borderRadius: "12px", background: c.bgSubtle, border: `1px solid ${c.borderSubtle}` }}>
              <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: c.text }}>{title}</p>
              <p style={{ margin: 0, fontSize: "13px", color: c.textMuted, lineHeight: 1.55 }}>{msg}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Recent transactions</p>
        {transactions.length === 0 ? (
          <p style={{ fontSize: "14px", color: c.textMuted }}>{copy.insights.empty}</p>
        ) : (
          transactions.slice(0, 8).map((t) => (
            <div key={t.transaction_id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{t.category}</p>
              </div>
              <span style={{ fontWeight: "600", color: t.type === "income" ? c.success : c.danger }}>
                {t.type === "income" ? "+" : "−"}₹{parseFloat(t.amount).toLocaleString("en-IN")}
              </span>
            </div>
          ))
        )}
      </Card>
    </AppShell>
  );
}
