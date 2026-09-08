import { useEffect, useState } from "react";

import { DashboardExperience } from "./components/dashboard-experience";
import { LandingPage } from "./components/landing-page";

type View = "home" | "dashboard";

function resolveView(): View {
  if (typeof window === "undefined") {
    return "home";
  }

  return window.location.hash === "#dashboard" ? "dashboard" : "home";
}

export default function App() {
  const [view, setView] = useState<View>(() => resolveView());

  useEffect(() => {
    function handleHashChange() {
      setView(resolveView());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigate(nextView: View) {
    window.location.hash = nextView === "dashboard" ? "dashboard" : "";
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (view === "dashboard") {
    return <DashboardExperience onBackHome={() => navigate("home")} />;
  }

  return <LandingPage onTryNow={() => navigate("dashboard")} />;
}
