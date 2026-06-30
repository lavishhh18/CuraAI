import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useTheme } from "../components/ThemeContext";
import { copy } from "../cura/copy";

function Toggle({ on, onToggle }) {
  const { c } = useCuraTheme();
  return (
    <div onClick={onToggle} style={{
      width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
      background: on ? c.primary : c.border, position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
        position: "absolute", top: "3px", left: on ? "23px" : "3px", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}

export default function CuraSettings() {
  const { dark, toggle } = useTheme();
  const { c, input, btn } = useCuraTheme();
  const { user } = useUser();
  const savedUser = JSON.parse(localStorage.getItem("curaAIUser") || "{}");

  const [notifications, setNotifications] = useState({ daily: true, budget: true, health: false, journal: true });
  const [budget, setBudget] = useState(localStorage.getItem("curaAIBudget") || "");
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("curaAIProfilePhoto") || "");
  const fileInputRef = useRef(null);

  const saveBudget = () => {
    if (budget.trim() === "") {
      localStorage.removeItem("curaAIBudget");
      alert("Monthly budget cleared. Set a budget to start tracking.");
      return;
    }

    localStorage.setItem("curaAIBudget", budget);
    alert(`Monthly budget updated to ₹${Number(budget).toLocaleString("en-IN")}.`);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (user?.setProfileImage) {
        await user.setProfileImage({ file });
        await user.reload();
      }
    } catch (err) {
      console.error(err);
    }
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("curaAIProfilePhoto", reader.result);
      setProfilePhoto(reader.result);
      window.dispatchEvent(new Event("profilePhotoUpdated"));
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
      <SectionHeader title={copy.settings.title} subtitle={copy.settings.subtitle} />

      <div className="cura-grid-2">
        <div className="cura-stack">
          <Card elevated>
            <p style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: "600", color: c.text }}>Profile</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer" }}>
                {(profilePhoto || user?.imageUrl) ? (
                  <img src={profilePhoto || user?.imageUrl} alt="" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${c.border}` }} />
                ) : (
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: c.aiSoft, color: c.ai,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: "600",
                  }}>{user?.firstName?.[0] || "U"}</div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "600", color: c.text }}>{user?.firstName} {user?.lastName}</p>
                <p style={{ margin: 0, fontSize: "14px", color: c.textMuted }}>{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Companion name", value: savedUser.friend_name || "Cura" },
                { label: "Status", value: savedUser.status || "—" },
                { label: "Phone", value: savedUser.phone || "Not set" },
                { label: "Emergency contact", value: savedUser.emergency_contact || "Not set" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", color: c.textMuted, fontWeight: "500" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "14px", color: c.text, fontWeight: "500" }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card elevated>
            <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Monthly budget</p>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: c.textMuted }}>Set your monthly spending limit for financial insights.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} style={{ ...input, flex: 1 }} />
              <Button onClick={saveBudget}>Save budget</Button>
            </div>
          </Card>
        </div>

        <div className="cura-stack">
          <Card elevated>
            <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Appearance</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>Dark mode</p>
                <p style={{ margin: 0, fontSize: "13px", color: c.textMuted }}>Reduce eye strain in low-light environments</p>
              </div>
              <Toggle on={dark} onToggle={toggle} />
            </div>
          </Card>

          <Card elevated>
            <p style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: "600", color: c.text }}>Notifications</p>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: c.textMuted }}>Choose what Cura keeps you informed about.</p>
            {[
              { key: "daily", label: "Daily overview", sub: "Evening summary of your day" },
              { key: "budget", label: "Budget alerts", sub: "When spending approaches your limit" },
              { key: "health", label: "Wellness reminders", sub: "Hydration, sleep, and movement prompts" },
              { key: "journal", label: "Reflection prompts", sub: "Gentle nudge to capture your thoughts" },
            ].map(({ key, label, sub }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{sub}</p>
                </div>
                <Toggle on={notifications[key]} onToggle={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
