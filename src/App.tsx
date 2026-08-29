import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { AppDataProvider, useAppData } from "./lib/AppDataContext";
import { ToastProvider } from "./components/ui/Toast";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import UrgeMode from "./pages/UrgeMode";
import Insights from "./pages/Insights";
import Journal from "./pages/Journal";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Achievements from "./pages/Achievements";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";

// Requires a signed-in (or guest) account, then loads that account's app data
// and makes sure onboarding is complete before reaching any protected page.
function RequireAccount() {
  const { account } = useAuth();
  const location = useLocation();

  if (!account) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return (
    <AppDataProvider userId={account.id}>
      <RequireOnboarding />
    </AppDataProvider>
  );
}

function RequireOnboarding() {
  const { data } = useAppData();
  const location = useLocation();

  if (!data.profile?.onboardingComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<RequireAccount />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/urge-mode" element={<UrgeMode />} />

              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Landing />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
