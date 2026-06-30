import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignUpPage from "./pages/SignUpPage";
import LifeOverview from "./pages/LifeOverview";
import CuraCompanion from "./pages/CuraCompanion";
import Wellness from "./pages/Wellness";
import FinancialWellness from "./pages/FinancialWellness";
import Reflections from "./pages/Reflections";
import Habits from "./pages/Habits";
import PersonalGrowth from "./pages/PersonalGrowth";
import Insights from "./pages/Insights";
import CuraSettings from "./pages/CuraSettings";
import { LEGACY_REDIRECTS } from "./cura/navigation";

const Protected = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><Navigate to="/" replace /></SignedOut>
  </>
);

function LegacyRedirect({ to }) {
  return <Navigate to={to} replace />;
}

function PostAuthRedirect() {
  const { user } = useUser();
  const onboardingDone = localStorage.getItem("curaAIUser");
  if (onboardingDone) return <Navigate to="/overview" replace />;

  if (user) {
    const isNewUser = Date.now() - new Date(user.createdAt).getTime() < 10 * 60 * 1000;
    if (isNewUser) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/overview" replace />;
  }
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><SignedIn><PostAuthRedirect /></SignedIn><SignedOut><LoginPage /></SignedOut></>} />
        <Route path="/sign-up/*" element={<><SignedIn><PostAuthRedirect /></SignedIn><SignedOut><SignUpPage /></SignedOut></>} />
        <Route path="/onboarding" element={<Protected><OnboardingPage /></Protected>} />

        <Route path="/overview" element={<Protected><LifeOverview /></Protected>} />
        <Route path="/companion" element={<Protected><CuraCompanion /></Protected>} />
        <Route path="/wellness" element={<Protected><Wellness /></Protected>} />
        <Route path="/finances" element={<Protected><FinancialWellness /></Protected>} />
        <Route path="/reflections" element={<Protected><Reflections /></Protected>} />
        <Route path="/habits" element={<Protected><Habits /></Protected>} />
        <Route path="/growth" element={<Protected><PersonalGrowth /></Protected>} />
        <Route path="/insights" element={<Protected><Insights /></Protected>} />
        <Route path="/settings" element={<Protected><CuraSettings /></Protected>} />

        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<LegacyRedirect to={to} />} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
