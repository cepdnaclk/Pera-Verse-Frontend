import React from "react";
import OverviewWidget from "../../components/OrganizerDashBoard/OverviewWidget";
import "./OverviewPage.css";

const OverviewPage = () => {
  return (
    <div className="overview-page">
      <h2>Overview</h2>
      <OverviewWidget />
    </div>
  );
};

export default OverviewPage;
