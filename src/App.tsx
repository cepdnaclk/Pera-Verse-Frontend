import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import CrowdManagement from "./pages/CrowdManagement";
import EventSchedule from "./pages/EventSchedule";
import Information from "./pages/Information";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/OrganizerDashBoard/LoginPage";
import OrganizerDashBoard from "./pages/OrganizerDashBoard/OrganizerDashBoard";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authUser");

  // check if current route starts with /organizer-dashboard
  const isDashboardRoute = location.pathname.startsWith("/organizer-dashboard");

  const handleLogin = () => {
    localStorage.setItem("authUser", "true"); // (already done in LoginPage, but safe)
    window.location.href = "/organizer-dashboard/overview";
  };

  return (
    <div className="App">
      {/* Only show Navbar & Footer if not in organizer dashboard */}
      {!isDashboardRoute && <Navbar />}

      <main style={{ minHeight: isDashboardRoute ? "100vh" : "calc(100vh - 140px)" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crowd-management" element={<CrowdManagement />} />
          <Route path="/events" element={<EventSchedule />} />
          <Route path="/information" element={<Information />} />
          <Route path="*" element={<NotFound />} />

          {/* Organizer Dashboard Login */}
          <Route
            path="/organizer-dashboard/login"
            element={<LoginPage onLogin={handleLogin} />}
          />

          {/* Protected Organizer Dashboard */}
          <Route
            path="/organizer-dashboard/*"
            element={
              isAuthenticated ? (
                <OrganizerDashBoard />
              ) : (
                <Navigate to="/organizer-dashboard/login" replace />
              )
            }
          />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
