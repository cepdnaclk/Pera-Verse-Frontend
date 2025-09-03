import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrganizerDashboardLayout from "../../components/OrganizerDashBoard/OrganizerDashboardLayout";

import OverviewPage from "./OverviewPage";
import HeatmapsPage from "./HeatmapsPage";
import FeedbackPage from "./FeedbackPage";
import ExportPage from "./ExportPage";

const OrganizerDashBoard = () => {
  const eventInfo = {
    title: "EngEX 2025",
    date: "30 Aug 2025",
    location: "University of Peradeniya",
  };

  const userInfo = {
    name: "Organizer",
    role: "Admin",
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser"); // clear login
    window.location.href = "/organizer-dashboard/login"; // go back to login
  };

  return (
    <OrganizerDashboardLayout
      eventInfo={eventInfo}
      userInfo={userInfo}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="heatmaps" element={<HeatmapsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="export" element={<ExportPage />} />
      </Routes>
    </OrganizerDashboardLayout>
  );
};

export default OrganizerDashBoard;


