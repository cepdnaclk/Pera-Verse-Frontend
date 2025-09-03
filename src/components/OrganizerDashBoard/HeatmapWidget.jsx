import React, { useState } from "react";
import { MapPin, Thermometer, Activity, Clock, Users } from "lucide-react";
import "./HeatmapWidget.css";

const HeatmapWidget = () => {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [subZoneFilter, setSubZoneFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [deptSubZoneFilter, setDeptSubZoneFilter] = useState("all");

  const allZones = [
    { name: "Main Hall", peak: 187, dwell: 28, activity: "High", color: "red", icon: Users },
    { name: "Exhibition Area", peak: 134, dwell: 22, activity: "Medium", color: "yellow", icon: Activity },
    { name: "Networking Lounge", peak: 89, dwell: 35, activity: "Low", color: "green", icon: Clock },
    { name: "Computer Engineering Dept", peak: 130, dwell: 20, activity: "Medium", color: "yellow", icon: Activity },
    { name: "Competition Area", peak: 90, dwell: 18, activity: "Low", color: "green", icon: Clock },
  ];

  const filteredZones =
    zoneFilter === "all" ? allZones : allZones.filter((z) => z.name === zoneFilter);

  const colorClasses = {
    red: "bg-red-gradient",
    yellow: "bg-yellow-gradient",
    green: "bg-green-gradient",
  };

  return (
    <div className="heatmap-container">
      {/* 🔽 Filters */}
      <div className="filters">
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="filter-select">
          <option value="1h">Last 1 Hour</option>
          <option value="3h">Last 3 Hours</option>
          <option value="5h">Last 5 Hours</option>
          <option value="12h">Last 12 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="filter-select">
          <option value="all">All Zones</option>
          {allZones.map((z, i) => (
            <option key={i} value={z.name}>
              {z.name}
            </option>
          ))}
        </select>
        <select value={subZoneFilter} onChange={(e) => setSubZoneFilter(e.target.value)} className="filter-select">
          <option value="all">All Sub Zones</option>
          <option value="sub1">Sub Zone 1</option>
          <option value="sub2">Sub Zone 2</option>
        </select>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="filter-select">
          <option value="all">All Departments</option>
          <option value="cse">CSE</option>
          <option value="ece">ECE</option>
        </select>
        <select value={deptSubZoneFilter} onChange={(e) => setDeptSubZoneFilter(e.target.value)} className="filter-select">
          <option value="all">All Dept Sub Zones</option>
          <option value="lab1">Lab 1</option>
          <option value="lab2">Lab 2</option>
        </select>
      </div>

      {/* 📍 Heatmap Visualization */}
      <div className="heatmap-visual">
        <div className="visual-header">
          <div className="visual-title">
            <div className="icon-box">
              <Thermometer size={24} />
            </div>
            <div>
              <h3>Venue Heatmap</h3>
              <p>Real-time crowd density visualization</p>
            </div>
          </div>
          <div className="live-tag">Live Data</div>
        </div>

        <div className="heatmap-area">
          <div className="heatmap-grid"></div>
          <div className="heatmap-center">
            <div className="pin-circle">
              <MapPin size={32} className="pin-icon" />
            </div>
            <p className="heatmap-text">Interactive heatmap visualization</p>
            <p className="heatmap-subtext">Showing {zoneFilter} [{timeFilter}]</p>
          </div>

          {/* Animated activity dots */}
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
          <div className="dot dot4"></div>
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item low">
            <div className="legend-dot"></div>
            <span>Low Activity</span>
          </div>
          <div className="legend-item medium">
            <div className="legend-dot"></div>
            <span>Medium Activity</span>
          </div>
          <div className="legend-item high">
            <div className="legend-dot"></div>
            <span>High Activity</span>
          </div>
        </div>
      </div>

      {/* 📊 Zone Analytics */}
      <div className="zone-grid">
        {filteredZones.map((zone, i) => (
          <div key={i} className="zone-card">
            <div className="zone-header">
              <div className={`zone-icon ${colorClasses[zone.color]}`}>
                <zone.icon size={20} />
              </div>
              <div>
                <h4>{zone.name}</h4>
                <div
                  className={`zone-activity ${
                    zone.activity === "High"
                      ? "high-activity"
                      : zone.activity === "Medium"
                      ? "medium-activity"
                      : "low-activity"
                  }`}
                >
                  {zone.activity} Activity
                </div>
              </div>
            </div>
            <div className="zone-details">
              <div className="zone-detail">
                <span>
                  <Users size={14} /> Peak Occupancy:
                </span>
                <span>{zone.peak}</span>
              </div>
              <div className="zone-detail">
                <span>
                  <Clock size={14} /> Avg. Dwell Time:
                </span>
                <span>{zone.dwell} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapWidget;
