import { SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import { copy } from "../cura/copy";
import { brand } from "../cura/tokens";

const clerkAppearance = {
  variables: {
    colorPrimary: "#0D9488",
    borderRadius: "14px",
    fontSize: "15px",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#F8FAFC",
    colorText: "#111827",
  },
  elements: {
    rootBox: { width: "100%" },
    card: { boxShadow: "none", padding: "0", margin: "0", width: "100%", border: "none", background: "transparent" },
    cardBox: { boxShadow: "none", border: "none", background: "transparent" },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    header: { display: "none" },
    socialButtonsBlockButton: { border: "1px solid #E5E7EB", borderRadius: "14px", fontSize: "14px", background: "#FFFFFF", boxShadow: "none", color: "#0F172A" },
    formButtonPrimary: { background: "#0D9488", borderRadius: "14px", fontSize: "15px", padding: "14px", boxShadow: "none", fontWeight: "600" },
    footerActionLink: { color: "#0D9488", fontWeight: "600" },
    formFieldInput: { fontSize: "15px", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "14px 16px", boxShadow: "none", background: "#F8FAFC" },
    formFieldLabel: { fontSize: "13px", color: "#475569" },
    dividerLine: { background: "#E5E7EB" },
    dividerText: { color: "#94A3B8", fontSize: "13px" },
    footer: { background: "transparent", border: "none", boxShadow: "none" },
    footerPages: { background: "transparent", boxShadow: "none", border: "none" },
    main: { padding: "0" },
    form: { gap: "16px" },
    page: { background: "transparent" },
    navbar: { display: "none" },
    navbarButtons: { display: "none" },
  },
};

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(30, 64, 175, 0.08), transparent 22%), #F4F7FB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
      fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      color: "#111827",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1080px",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.85fr",
        gap: "30px",
        background: "#FFFFFF",
        borderRadius: "30px",
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.12)",
        overflow: "hidden",
      }}>
        <section style={{
          padding: "58px 54px",
          background: "#F8FAFC",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "36px",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#0F766E" }}>{brand.name}</p>
            <h1 style={{ margin: "24px 0 0", fontSize: "44px", lineHeight: 1.02, letterSpacing: "-0.04em", color: "#111827" }}>
              Begin your Cura experience
            </h1>
            <p style={{ margin: "24px 0 0", maxWidth: "560px", fontSize: "17px", lineHeight: 1.8, color: "#475569" }}>
              Create an account with a refined onboarding flow that makes setup calm, clear, and efficient.
            </p>
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            {[
              "Tailored insights from your first session.",
              "A balanced setup process with gentle pacing.",
              "Professional design for long-term trust."
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "18px 24px", borderRadius: "22px", border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                <div style={{ width: "10px", height: "10px", marginTop: "10px", borderRadius: "9999px", background: "#0F766E" }} />
                <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.75, color: "#475569" }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <div style={{ padding: "18px 24px", borderRadius: "22px", background: "#ECFDF5", border: "1px solid #D1FAE5" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#047857" }}>Start with intention and structure.</p>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.8 }}>
              Cura supports your momentum by keeping the signup experience simple and confidence-inspiring.
            </p>
          </div>
        </section>

        <section style={{ padding: "44px 42px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0F766E" }}>{brand.name}</p>
            <h2 style={{ margin: "14px 0 10px", fontSize: "30px", lineHeight: 1.1, color: "#111827" }}>{copy.auth.signup.title}</h2>
            <p style={{ margin: 0, fontSize: "15px", color: "#475569", lineHeight: 1.75 }}>{copy.auth.signup.subtitle}</p>
          </div>

          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "28px", border: "1px solid #E2E8F0", padding: "34px", boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)" }}>
              <SignedOut>
                <SignUp routing="path" path="/sign-up" signInUrl="/" afterSignUpUrl="/onboarding" appearance={clerkAppearance} />
              </SignedOut>
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
            </div>

            <p style={{ margin: "28px 0 0", fontSize: "14px", color: "#475569", textAlign: "center" }}>
              Already have an account? <Link to="/" style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
