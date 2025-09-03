import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {Header} from "./Header";
import "./OrganizerDashboardLayout.css";

const OrganizerDashboardLayout = ({ children, eventInfo, userInfo, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Area */}
      <div className="dashboard-main">
        <Header eventInfo={eventInfo} userInfo={userInfo} onLogout={onLogout} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default OrganizerDashboardLayout;
