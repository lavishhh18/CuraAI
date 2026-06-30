import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { LogOut, Moon, Sun, X } from "lucide-react";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useResponsive } from "../hooks/useMediaQuery";
import { NAV_ITEMS, MOBILE_TABS } from "../cura/navigation";
import { brand } from "../cura/tokens";

function CuraLogo({ size = 32 }) {
  const { c, radius } = useCuraTheme();
  return (
    <div style={{
      width: size, height: size, borderRadius: radius.md,
      background: c.aiGradient || c.aiSoft,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45, fontWeight: "700", color: "#fff",
      flexShrink: 0,
    }} className="cura-companion-gradient">
      C
    </div>
  );
}

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { c, radius, toggle, dark } = useCuraTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const activePath = location.pathname;
  const userInitial = user?.firstName?.[0] || "U";

  useEffect(() => {
    setMenuOpen(false);
  }, [activePath]);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: c.surface,
      borderBottom: `1px solid ${c.border}`,
      backdropFilter: "blur(18px)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "18px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
          <CuraLogo size={34} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: c.text, letterSpacing: "-0.02em" }}>{brand.name}</p>
            <p style={{ margin: 0, fontSize: "13px", color: c.textMuted }}>{brand.tagline || "Your AI-first life companion"}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={toggle}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: radius.full,
              border: `1px solid ${c.border}`,
              background: c.bgSubtle,
              color: c.text,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: radius.lg,
              border: `1px solid ${c.border}`,
              background: c.bgSubtle,
              color: c.text,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: c.aiSoft,
              color: c.ai,
              display: "grid",
              placeItems: "center",
              fontWeight: "700",
            }}>
              {userInitial}
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: c.text }}>{user?.firstName || "Account"}</p>
              <p style={{ margin: 0, fontSize: "11px", color: c.textMuted }}>Profile</p>
            </div>
          </button>
        </div>
      </div>

      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 24px 16px",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}>
        {NAV_ITEMS.map(({ path, label, icon: Icon, featured }) => {
          const active = activePath === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: radius.lg,
                textDecoration: "none",
                background: active ? (featured ? c.aiSoft : c.primarySoft) : c.bgSubtle,
                color: active ? (featured ? c.ai : c.primary) : c.textSecondary,
                fontWeight: active ? "700" : "600",
                fontSize: "13px",
              }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "74px",
          right: "24px",
          width: "260px",
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: radius.lg,
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          zIndex: 110,
          overflow: "hidden",
        }}>
          <button
            onClick={toggle}
            style={{
              width: "100%",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "none",
              background: "transparent",
              color: c.text,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={() => signOut(() => navigate("/"))}
            style={{
              width: "100%",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "none",
              background: "transparent",
              color: c.danger,
              cursor: "pointer",
              textAlign: "left",
            }}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}

function MobileNav({ moreOpen, setMoreOpen }) {
  const location = useLocation();
  const { c } = useCuraTheme();

  return (
    <>
      {moreOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }} onClick={() => setMoreOpen(false)} />
      )}
      {moreOpen && (
        <div style={{
          position: "fixed",
          bottom: "72px",
          left: "12px",
          right: "12px",
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: "16px",
          padding: "8px",
          zIndex: 100,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px 4px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: c.text }}>More</span>
            <button onClick={() => setMoreOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: c.textMuted }}><X size={18} /></button>
          </div>
          {NAV_ITEMS.filter((n) => n.group === "secondary").map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setMoreOpen(false)} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              textDecoration: "none",
              color: c.text,
              fontSize: "15px",
              fontWeight: "500",
              borderRadius: "10px",
              background: location.pathname === path ? c.bgSubtle : "transparent",
            }}>
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </div>
      )}

      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: c.surface,
        borderTop: `1px solid ${c.border}`,
        display: "flex",
        alignItems: "stretch",
        zIndex: 80,
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}>
        {MOBILE_TABS.map((item) => {
          const Icon = item.icon;
          const isMore = item.path === "/more";
          const active = isMore ? moreOpen : location.pathname === item.path;
          const secondaryActive = isMore && NAV_ITEMS.filter((n) => n.group === "secondary").some((n) => n.path === location.pathname);

          if (isMore) {
            return (
              <button
                key={item.path}
                onClick={() => setMoreOpen(!moreOpen)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: (active || secondaryActive) ? c.ai : c.textMuted,
                  fontSize: "10px",
                  fontWeight: (active || secondaryActive) ? "600" : "500",
                }}
              >
                <Icon size={20} strokeWidth={(active || secondaryActive) ? 2 : 1.75} />
                {item.shortLabel}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMoreOpen(false)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                textDecoration: "none",
                color: active ? c.ai : c.textMuted,
                fontSize: "10px",
                fontWeight: active ? "600" : "500",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.75} />
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function AppShell({ children }) {
  const { c } = useCuraTheme();
  const { isMobile } = useResponsive();
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <TopNav />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: "100vh",
        paddingBottom: isMobile ? "84px" : 0,
      }}>
        <main className="cura-scroll" style={{
          flex: 1,
          padding: isMobile ? "16px 16px 24px" : "28px 32px 48px",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}>
          <div className="cura-animate-in">{children}</div>
        </main>
      </div>
      {isMobile && <MobileNav moreOpen={moreOpen} setMoreOpen={setMoreOpen} />}
    </div>
  );
}
