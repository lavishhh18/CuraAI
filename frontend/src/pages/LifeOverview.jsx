import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Sparkles, HeartPulse, Wallet, Repeat, TrendingUp, PenLine,
  ArrowRight, Plus, MessageCircle,
} from "lucide-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressRing from "../components/ui/ProgressRing";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useLifeData } from "../hooks/useLifeData";
import { copy } from "../cura/copy";

function QuickAction({ icon: Icon, label, onClick, color }) {
  const { c, radius } = useCuraTheme();
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      padding: "16px 12px", border: `1px solid ${c.border}`, borderRadius: radius.lg,
      background: c.surface, cursor: "pointer", flex: 1, minWidth: "100px",
      transition: "background 0.15s",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: radius.md,
        background: color + "18", color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: "600", color: c.textSecondary, textAlign: "center" }}>{label}</span>
    </button>
  );
}

export default function LifeOverview() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { c, radius } = useCuraTheme();
  const data = useLifeData();

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (data.loading) {
    return (
      <AppShell>
        <p style={{ color: c.textMuted, fontSize: "15px" }}>Preparing your overview…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header style={{ marginBottom: "28px" }}>
        <p style={{ margin: "0 0 6px", fontSize: "14px", color: c.textMuted, fontWeight: "500" }}>{timeGreeting}</p>
        <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 38px)", fontWeight: "700", color: c.text, letterSpacing: "-0.03em", maxWidth: "720px" }}>
          {copy.overview.greeting(data.displayName !== "there" ? data.displayName.split(" ")[0] : user?.firstName)}
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: "15px", color: c.textMuted, maxWidth: "720px" }}>{copy.overview.subtitle}</p>
      </header>

      <div className="cura-grid-2" style={{ gap: "20px", marginBottom: "24px" }}>
        <Card elevated style={{ minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }} onClick={() => navigate("/companion")}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", color: c.ai, textTransform: "uppercase", letterSpacing: "0.14em" }}>{copy.overview.companionCard.title}</p>
            <h2 style={{ margin: 0, fontSize: "24px", lineHeight: 1.15, color: c.text }}>Your AI companion is ready to help shape today.</h2>
            <p style={{ margin: "14px 0 0", fontSize: "14px", color: c.textSecondary, lineHeight: 1.7 }}>
              {copy.companion.intro(data.displayName, data.companionName)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: "rgba(99,102,241,0.12)", display: "grid", placeItems: "center" }}>
                <Sparkles size={22} color={c.ai} strokeWidth={1.75} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: c.text }}>Tap to chat</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: c.textMuted }}>Weekly plans, rituals, and prompts.</p>
              </div>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: c.ai }}>&rarr;</span>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Card elevated style={{ padding: "20px" }} onClick={() => navigate("/wellness")}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Wellness score</p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <ProgressRing value={data.wellnessScore} color={c.wellness} />
              <div>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: c.text }}>{data.wellnessScore}%</p>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: c.textSecondary }}>Mood, sleep, and balance all working together.</p>
              </div>
            </div>
          </Card>

          <Card elevated style={{ padding: "24px", minHeight: "260px", background: "rgba(255,255,255,0.86)", border: `1px solid ${c.borderSubtle}`, backdropFilter: "blur(18px)", boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)" }} onClick={() => navigate("/finances")}> 
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Today's Budget</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ borderRadius: "999px", width: "30px", height: "30px", display: "grid", placeItems: "center", background: "rgba(13,148,136,0.12)", color: c.primary }}>
                    <Wallet size={16} strokeWidth={2} />
                  </span>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: c.text }}>Budget Overview</p>
                </div>
              </div>
            </div>

            {data.monthlyBudget === null ? (
              <div style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: c.text }}>No budget configured</p>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: c.textMuted, maxWidth: "460px" }}>
                  Set a monthly budget to start tracking spending and savings.
                </p>
                <Button variant="solid" onClick={(e) => { e.stopPropagation(); navigate("/settings"); }} style={{ width: "fit-content", padding: "12px 22px", borderRadius: "14px", fontSize: "14px", fontWeight: "600" }}>
                  Set Budget
                </Button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                  <div style={{ padding: "18px", borderRadius: "18px", background: c.bgSubtle, border: `1px solid ${c.border}` }}>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Monthly Budget</p>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: c.text }}>
                      ₹{data.monthlyBudget.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div style={{ padding: "18px", borderRadius: "18px", background: c.bgSubtle, border: `1px solid ${c.border}` }}>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Amount Spent</p>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: c.danger }}>
                      ₹{data.totalSpent.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Remaining Budget</p>
                      <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: c.text }}>
                        ₹{data.budgetLeft.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: c.textMuted }}>
                      {Math.round((data.totalSpent / data.monthlyBudget) * 100)}% used
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "10px", borderRadius: "999px", background: c.border }}>
                    <div style={{ width: `${Math.min(100, Math.round((data.totalSpent / data.monthlyBudget) * 100))}%`, height: "100%", borderRadius: "999px", background: c.finance, transition: "width 0.3s ease" }} />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card elevated style={{ padding: "20px" }} onClick={() => navigate("/habits")}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Ritual completion</p>
            <p style={{ margin: "0 0 10px", fontSize: "26px", fontWeight: "700", color: c.text }}>{data.habitsDone}/{data.habitsTotal}</p>
            <div style={{ height: "8px", borderRadius: "999px", background: c.border }}>
              <div style={{ width: `${((data.habitsTotal > 0 ? data.habitsDone / data.habitsTotal : 0) * 100).toFixed(0)}%`, height: "100%", borderRadius: "999px", background: c.primary }} />
            </div>
          </Card>

          <Card elevated style={{ padding: "20px" }} onClick={() => navigate("/growth")}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Focus progress</p>
            <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: c.text }}>{data.goalProgress}%</h3>
            <p style={{ margin: "10px 0 0", fontSize: "13px", color: c.textSecondary }}>Strengthening momentum toward your top priorities.</p>
          </Card>
        </div>
      </div>

      <Card elevated style={{ marginBottom: "24px", padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Daily overview</p>
              <h2 style={{ margin: "8px 0 0", fontSize: "22px", fontWeight: "700", color: c.text }}>A gentle check-in with your whole day.</h2>
            </div>
            <Button variant="soft" onClick={() => navigate("/companion")} style={{ whiteSpace: "nowrap" }}>Talk to Cura</Button>
          </div>

          <div className="cura-grid-3" style={{ gap: "16px" }}>
            <div style={{ padding: "18px", borderRadius: "18px", background: c.bgSubtle, border: `1px solid ${c.borderSubtle}` }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Tonight</p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: c.text }}>Schedule a short wind-down.</p>
              <p style={{ margin: "10px 0 0", fontSize: "14px", color: c.textSecondary }}>A calm reflection helps you close the day with intention.</p>
            </div>
            <div style={{ padding: "18px", borderRadius: "18px", background: c.bgSubtle, border: `1px solid ${c.borderSubtle}` }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Money pulse</p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: c.text }}>Keep healthy spacing in your budget.</p>
              <p style={{ margin: "10px 0 0", fontSize: "14px", color: c.textSecondary }}>{data.totalSpent > 0 ? `You've spent ₹${data.totalSpent.toLocaleString("en-IN")} this month so far.` : "Add a transaction for today’s spending picture."}</p>
            </div>
            <div style={{ padding: "18px", borderRadius: "18px", background: c.bgSubtle, border: `1px solid ${c.borderSubtle}` }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Growth note</p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: c.text }}>Small habits compound into clarity.</p>
              <p style={{ margin: "10px 0 0", fontSize: "14px", color: c.textSecondary }}>{data.goals.length > 0 ? `${data.goals.filter((g) => g.is_completed).length} of ${data.goals.length} goals completed.` : "Set one new goal to build momentum."}</p>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: c.text }}>{copy.overview.quickActions}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
          <QuickAction icon={Sparkles} label="Ask Cura" onClick={() => navigate("/companion")} color={c.ai} />
          <QuickAction icon={Plus} label="Record Transaction" onClick={() => navigate("/finances")} color={c.finance} />
          <QuickAction icon={PenLine} label="New Reflection" onClick={() => navigate("/reflections")} color={c.primary} />
          <QuickAction icon={HeartPulse} label="Log Wellness" onClick={() => navigate("/wellness")} color={c.wellness} />
          <QuickAction icon={Repeat} label="Track Habits" onClick={() => navigate("/habits")} color={c.ai} />
          <QuickAction icon={TrendingUp} label="Set Goal" onClick={() => navigate("/growth")} color={c.primary} />
        </div>
      </div>
    </AppShell>
  );
}
