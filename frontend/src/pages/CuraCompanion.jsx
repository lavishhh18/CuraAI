import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Sparkles, Send } from "lucide-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useResponsive } from "../hooks/useMediaQuery";
import { copy } from "../cura/copy";

const LOGO_SRC = "/logo.png";
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PROMPTS = [
  "Help me understand my spending patterns",
  "I'm feeling overwhelmed today",
  "Create a plan for a productive week",
  "What should I focus on for my wellness?",
];

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
];

export default function CuraCompanion() {
  const { user: clerkUser } = useUser();
  const { c, radius, input, btn } = useCuraTheme();
  const { isMobile } = useResponsive();

  const localUser = JSON.parse(localStorage.getItem("curaAIUser") || "{}");
  const [companionName, setCompanionName] = useState(localUser.friend_name || localUser.friendName || "Cura");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{
      from: "ai",
      text: `${companionName} here. I'm your personal coach and life companion — ready to support your wellness, finances, and growth. How can I help you today?`,
    }]);
  }, [companionName]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = clerkUser?.id || localUser.clerk_id;
        if (!userId) return;
        const res = await fetch(`${BACKEND_URL}/auth/profile/${userId}`);
        if (res.ok) {
          const profile = await res.json();
          const name = profile.friend_name || profile.friendName;
          if (name) {
            setCompanionName(name);
            localStorage.setItem("curaAIUser", JSON.stringify({ ...localUser, friend_name: name, clerk_id: userId }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, [clerkUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || inputText.trim();
    if (!msg) return;
    setInputText("");
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/companion/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.filter((_, idx) => idx > 0).map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
          friend_name: companionName,
          user_id: clerkUser?.id,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "ai", text: data.reply || data.message || "I'm here for you." }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: copy.companion.error }]);
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <SectionHeader title={copy.companion.title} subtitle={copy.companion.subtitle} />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
        gap: "16px",
        height: isMobile ? "auto" : "calc(100vh - 180px)",
      }}>
        <Card elevated padding="0" style={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: isMobile ? "520px" : undefined }}>
          {/* Companion header */}
          <div style={{
            padding: "16px 20px", borderBottom: `1px solid ${c.border}`,
            display: "flex", alignItems: "center", gap: "12px",
            background: c.aiSoft,
          }}>
            <div className="cura-companion-gradient" style={{
              width: "44px", height: "44px", borderRadius: radius.full,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
            }}>
              <img src={LOGO_SRC} alt="Cura logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.innerHTML = '<span style=\"color:white;font-weight:700\">C</span>'; }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: c.text }}>{companionName}</p>
              <p style={{ margin: 0, fontSize: "12px", color: c.wellness, fontWeight: "500" }}>Online · Your life companion</p>
            </div>
          </div>

          {/* Messages */}
          <div className="cura-scroll" style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "12px 16px",
                  borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.from === "user" ? c.ai : c.bgSubtle,
                  color: msg.from === "user" ? "#fff" : c.text,
                  fontSize: "14px", lineHeight: 1.6,
                  border: msg.from === "ai" ? `1px solid ${c.border}` : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: c.bgSubtle, border: `1px solid ${c.border}`, fontSize: "14px", color: c.textMuted }}>
                  {copy.companion.typing}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px", borderTop: `1px solid ${c.border}`, display: "flex", gap: "8px" }}>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={copy.companion.placeholder}
              style={{ ...input, flex: 1 }}
            />
            <button onClick={() => sendMessage()} disabled={loading} style={{ ...btn.ai, display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px" }}>
              <Send size={16} />
              {!isMobile && copy.companion.send}
            </button>
          </div>
        </Card>

        {!isMobile && (
          <div className="cura-stack">
            <Card>
              <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: c.text }}>{copy.companion.quickQuestions}</p>
              {PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)} style={{
                  width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: "6px",
                  border: `1px solid ${c.border}`, borderRadius: radius.md,
                  background: c.surface, color: c.textSecondary, fontSize: "13px",
                  cursor: "pointer", lineHeight: 1.4,
                }}>{p}</button>
              ))}
            </Card>
            <Card>
              <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: c.text }}>{copy.companion.moodCheck}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {MOOD_OPTIONS.map(({ emoji, label }) => (
                  <button key={label} onClick={() => sendMessage(`I'm feeling ${label.toLowerCase()} today`)} style={{
                    padding: "12px", border: `1px solid ${c.border}`, borderRadius: radius.md,
                    background: c.bgSubtle, cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  }}>
                    <span style={{ fontSize: "20px" }}>{emoji}</span>
                    <span style={{ fontSize: "12px", color: c.textMuted, fontWeight: "500" }}>{label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
