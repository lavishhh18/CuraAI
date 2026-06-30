import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { copy } from "../cura/copy";
import api from "../api";

const SYMPTOMS = ["cramps", "bloating", "headache", "fatigue", "mood swings", "acne"];
const WATER_GOAL = 8;

export default function Wellness() {
  const { user } = useUser();
  const { c, radius, input, btn } = useCuraTheme();

  const [todayLog, setTodayLog] = useState(null);
  const [weekLogs, setWeekLogs] = useState([]);
  const [waterCount, setWaterCount] = useState(0);
  const [habits, setHabits] = useState({});
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [cyclePrediction, setCyclePrediction] = useState(null);
  const [cycleForm, setCycleForm] = useState({ start_date: "", end_date: "", flow: "medium", symptoms: [] });
  const [cycleLogging, setCycleLogging] = useState(false);
  const [showCycleForm, setShowCycleForm] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/health/${user.id}/today`).then((res) => {
      const log = res.data.log;
      if (log) {
        setTodayLog(log);
        setWaterCount(parseInt(log.water_glasses) || 0);
        setHabits(log.habits || {});
      }
    });
    api.get(`/health/${user.id}`).then((res) => setWeekLogs(res.data.logs || []));
    api.get(`/auth/profile/${user.id}`).then((res) => {
      setUserProfile(res.data);
      api.get(`/cycle/${user.id}`).then((r) => {
        setCycleHistory(r.data.history || []);
        setCyclePrediction(r.data.prediction || null);
      });
    });
  }, [user?.id]);

  const saveLog = async (overrides = {}) => {
    setSaving(true);
    try {
      await api.post("/health/", {
        clerk_id: user.id,
        sleep_hours: todayLog?.sleep_hours || "",
        steps: todayLog?.steps || "",
        water_glasses: waterCount.toString(),
        heart_rate: todayLog?.heart_rate || "",
        bmi: todayLog?.bmi || "",
        habits,
        ...overrides,
      });
      const res = await api.get(`/health/${user.id}`);
      setWeekLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleWater = (count) => {
    setWaterCount(count);
    saveLog({ water_glasses: count.toString() });
  };

  const handleLogPeriod = async () => {
    if (!cycleForm.start_date) return;
    setCycleLogging(true);
    try {
      await api.post("/cycle/log", {
        user_id: user.id,
        start_date: cycleForm.start_date,
        end_date: cycleForm.end_date || null,
        flow: cycleForm.flow,
        symptoms: cycleForm.symptoms,
      });
      const res = await api.get(`/cycle/${user.id}`);
      setCycleHistory(res.data.history || []);
      setCyclePrediction(res.data.prediction || null);
      setCycleForm({ start_date: "", end_date: "", flow: "medium", symptoms: [] });
      setShowCycleForm(false);
    } catch {
      alert("Unable to save cycle entry. Please try again.");
    } finally {
      setCycleLogging(false);
    }
  };

  const sleepData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    hours: parseFloat(l.sleep_hours) || 0,
  }));

  const stepsData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    steps: parseInt(l.steps) || 0,
  }));

  const tooltipStyle = { background: c.surface, border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "12px" };

  const metrics = [
    { label: "Sleep", value: todayLog?.sleep_hours ? `${todayLog.sleep_hours}h` : "—", hint: "Target: 7–8 hours" },
    { label: "Steps", value: todayLog?.steps ? parseInt(todayLog.steps).toLocaleString("en-IN") : "—", hint: "Target: 10,000" },
    { label: "Hydration", value: `${waterCount}/${WATER_GOAL}`, hint: "glasses today" },
    { label: "Heart rate", value: todayLog?.heart_rate ? `${todayLog.heart_rate} bpm` : "—", hint: "Resting" },
  ];

  return (
    <AppShell>
      <SectionHeader title={copy.wellness.title} subtitle={copy.wellness.subtitle} />

      <div className="cura-grid-auto" style={{ marginBottom: "20px" }}>
        {metrics.map(({ label, value, hint }) => (
          <Card key={label} elevated>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: c.textMuted, fontWeight: "500" }}>{label}</p>
            <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "700", color: c.text, letterSpacing: "-0.02em" }}>{value}</p>
            <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{hint}</p>
          </Card>
        ))}
      </div>

      <div className="cura-grid-2" style={{ marginBottom: "20px" }}>
        <Card>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Sleep this week</p>
          {sleepData.length === 0 ? (
            <p style={{ fontSize: "14px", color: c.textMuted }}>{copy.wellness.empty}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sleepData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="hours" fill={c.ai} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Daily movement</p>
          {stepsData.length === 0 ? (
            <p style={{ fontSize: "14px", color: c.textMuted }}>{copy.wellness.empty}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stepsData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="steps" stroke={c.wellness} strokeWidth={2.5} dot={{ fill: c.wellness, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card elevated style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Hydration</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          {Array.from({ length: WATER_GOAL }).map((_, i) => (
            <button key={i} onClick={() => handleWater(i + 1)} style={{
              width: "44px", height: "44px", borderRadius: radius.md, border: "none", cursor: "pointer",
              background: i < waterCount ? c.primary : c.bgSubtle,
              fontSize: "18px", transition: "background 0.15s",
            }}>💧</button>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: c.textMuted }}>
          {waterCount} of {WATER_GOAL} glasses · {Math.max(0, WATER_GOAL - waterCount)} remaining
          {saving && " · Saving…"}
        </p>
      </Card>

      <div style={{ marginTop: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: c.cycle }}>{copy.wellness.cycle.title}</p>
              <p style={{ margin: 0, fontSize: "14px", color: c.textMuted }}>{copy.wellness.cycle.subtitle}</p>
            </div>
            <Button variant="ai" onClick={() => setShowCycleForm(!showCycleForm)} style={{ background: c.cycle }}>{copy.wellness.cycle.log}</Button>
          </div>

          {cyclePrediction?.pms_alert && (
            <Card style={{ marginBottom: "16px", background: c.cycleSoft, borderColor: c.cycle }}>
              <p style={{ margin: 0, fontSize: "14px", color: c.cycle, fontWeight: "500", lineHeight: 1.5 }}>
                {copy.wellness.cycle.pms(cyclePrediction.days_until_next)}
              </p>
            </Card>
          )}

          {cyclePrediction && (
            <div className="cura-grid-auto" style={{ marginBottom: "20px" }}>
              {[
                { label: "Next cycle", value: cyclePrediction.next_period ? new Date(cyclePrediction.next_period).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—", sub: cyclePrediction.days_until_next != null ? `Est. ${cyclePrediction.days_until_next} days` : "Log 2+ entries" },
                { label: "Fertile window", value: cyclePrediction.fertile_window_start ? `${new Date(cyclePrediction.fertile_window_start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(cyclePrediction.fertile_window_end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "—", sub: "Estimated" },
                { label: "Ovulation", value: cyclePrediction.ovulation_date ? new Date(cyclePrediction.ovulation_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—", sub: "Estimated date" },
                { label: "Avg cycle", value: `${cyclePrediction.cycle_length} days`, sub: "Based on your history" },
              ].map(({ label, value, sub }) => (
                <Card key={label}>
                  <p style={{ margin: "0 0 8px", fontSize: "13px", color: c.textMuted }}>{label}</p>
                  <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: c.text }}>{value}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{sub}</p>
                </Card>
              ))}
            </div>
          )}

          {showCycleForm && (
            <Card elevated style={{ marginBottom: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Start date</label>
                  <input type="date" value={cycleForm.start_date} onChange={(e) => setCycleForm((p) => ({ ...p, start_date: e.target.value }))} style={input} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>End date</label>
                  <input type="date" value={cycleForm.end_date} onChange={(e) => setCycleForm((p) => ({ ...p, end_date: e.target.value }))} style={input} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Flow</label>
                  <select value={cycleForm.flow} onChange={(e) => setCycleForm((p) => ({ ...p, flow: e.target.value }))} style={input}>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "13px", color: c.textMuted, fontWeight: "500" }}>Symptoms</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {SYMPTOMS.map((s) => {
                  const selected = cycleForm.symptoms.includes(s);
                  return (
                    <button key={s} onClick={() => setCycleForm((p) => ({
                      ...p,
                      symptoms: selected ? p.symptoms.filter((x) => x !== s) : [...p.symptoms, s],
                    }))} style={{
                      padding: "6px 14px", borderRadius: radius.full, fontSize: "13px", cursor: "pointer",
                      border: `1px solid ${selected ? c.cycle : c.border}`,
                      background: selected ? c.cycleSoft : c.surface,
                      color: selected ? c.cycle : c.textMuted,
                    }}>{s}</button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button onClick={handleLogPeriod} disabled={cycleLogging || !cycleForm.start_date} style={{ background: c.cycle }}>
                  {cycleLogging ? "Saving…" : "Save entry"}
                </Button>
                <Button variant="ghost" onClick={() => setShowCycleForm(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          <Card>
            <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Cycle history</p>
            {cycleHistory.length === 0 ? (
              <p style={{ fontSize: "14px", color: c.textMuted }}>{copy.wellness.cycle.empty}</p>
            ) : (
              cycleHistory.slice(0, 6).map((entry) => (
                <div key={entry.period_id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: c.text }}>
                      {new Date(entry.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {entry.end_date ? ` → ${new Date(entry.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>
                      {entry.symptoms?.length > 0 ? entry.symptoms.join(", ") : `Flow: ${entry.flow}`}
                    </p>
                  </div>
                  <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: radius.full, background: c.cycleSoft, color: c.cycle, fontWeight: "600" }}>{entry.flow}</span>
                </div>
              ))
            )}
          </Card>
        </div>
  
    </AppShell>
  );
}
