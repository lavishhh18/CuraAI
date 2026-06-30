import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { copy } from "../cura/copy";
import { brand } from "../cura/tokens";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STEPS = [
  { id: 1, label: "About you" },
  { id: 2, label: "Your profile" },
  { id: 3, label: "Meet Cura" },
  { id: 4, label: "Safety" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
    status: "",
    friendName: "",
    emergencyContact: "",
    relationship: "",
    emergencyPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const { name, gender, status, friendName, emergencyContact, emergencyPhone } = form;
    if (emergencyContact && emergencyPhone) setCurrentStep(4);
    else if (friendName) setCurrentStep(3);
    else if (gender && status) setCurrentStep(2);
    else if (name) setCurrentStep(1);
  }, [form]);

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("Session expired. Please sign in again.");
      return;
    }
    if (!form.name || !form.friendName) {
      setError("Please enter your name and choose a name for your companion.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      name: form.name,
      age: form.age,
      phone: form.phone,
      gender: form.gender,
      status: form.status,
      friend_name: form.friendName,
      emergency_contact: form.emergencyContact,
      relationship: form.relationship,
      emergency_phone: form.emergencyPhone,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/auth/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to save your profile.");

      localStorage.setItem("curaAIUser", JSON.stringify(payload));
      navigate("/overview");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #E7E5E4",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#1C1917",
    background: "#FAFAF9",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#57534E",
    marginBottom: "6px",
    display: "block",
    fontWeight: "500",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "640px",
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #E7E5E4",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid #F5F5F4",
        }}>
          <button
            onClick={() => navigate("/")}
            aria-label="Go back"
            style={{
              width: "36px", height: "36px", borderRadius: "10px",
              border: "1px solid #E7E5E4", background: "#FAFAF9",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#57534E",
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: "flex", gap: "6px" }}>
            {STEPS.map(({ id }) => (
              <div key={id} style={{
                width: id <= currentStep ? "28px" : "8px",
                height: "8px",
                borderRadius: "99px",
                background: id <= currentStep ? "#0D9488" : "#E7E5E4",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1C1917", letterSpacing: "-0.01em" }}>
            {brand.name}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 28px 36px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{
              margin: "0 0 8px",
              fontSize: "26px",
              fontWeight: "700",
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}>
              {copy.auth.onboarding.title}
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#78716C", lineHeight: 1.5 }}>
              {copy.auth.onboarding.subtitle}
            </p>
          </div>

          {/* Section 1 */}
          <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: "600", color: "#0D9488", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Personal details
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input name="age" value={form.age} onChange={handleChange} placeholder="Your age" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                value={user?.primaryEmailAddress?.emailAddress || ""}
                disabled
                style={{ ...inputStyle, background: "#F5F5F4", color: "#A8A29E", cursor: "not-allowed" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Contact number" style={inputStyle} />
            </div>
          </div>

          {/* Section 2 */}
          <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: "600", color: "#0D9488", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            About you
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Current status</label>
              <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select status</option>
                <option>Student</option>
                <option>Working</option>
              </select>
            </div>
          </div>

          {/* Section 3 — Companion */}
          <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: "600", color: "#6366F1", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Your companion
          </p>
          <div style={{
            display: "flex", gap: "16px", alignItems: "flex-start",
            padding: "20px", borderRadius: "14px",
            background: "linear-gradient(135deg, #EEF2FF 0%, #CCFBF1 100%)",
            border: "1px solid #E7E5E4",
            marginBottom: "28px",
          }}>
            <div className="cura-companion-gradient" style={{
              width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={22} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "600", color: "#1C1917" }}>
                Name your Cura companion
              </p>
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#78716C", lineHeight: 1.5 }}>
                This is your personal AI coach — choose a name that feels right to you.
              </p>
              <input
                name="friendName"
                value={form.friendName}
                onChange={handleChange}
                placeholder="e.g. Cura, Nova, Sage…"
                style={{ ...inputStyle, background: "#FFFFFF" }}
              />
            </div>
          </div>

          {/* Section 4 — Emergency */}
          <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: "600", color: "#0D9488", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Emergency contact <span style={{ fontWeight: "400", color: "#A8A29E", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            <div>
              <label style={labelStyle}>Contact name</label>
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Relationship</label>
              <input name="relationship" value={form.relationship} onChange={handleChange} placeholder="e.g. Parent, friend" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Phone number</label>
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="Emergency contact number" style={inputStyle} />
            </div>
          </div>

          {error && (
            <p style={{ color: "#DC2626", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#99F6E4" : "#0D9488",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            {loading ? "Setting up your experience…" : "Enter Cura AI"}
          </button>

          <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#A8A29E" }}>
            Your data is encrypted and never shared without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
