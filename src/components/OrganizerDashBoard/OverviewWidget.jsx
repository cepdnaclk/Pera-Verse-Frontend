import React, { useState } from "react";
import { TrendingUp, Users, MapPin, Clock, BarChart3 } from "lucide-react";
import "./OverviewWidget.css";

const OverviewWidget = () => {
  const [timeRange, setTimeRange] = useState("realtime");
  const [zone, setZone] = useState("all");
  const [subZone, setSubZone] = useState("all");
  const [department, setDepartment] = useState("all");
  const [deptSubZone, setDeptSubZone] = useState("all");
  const [booth, setBooth] = useState("all");

  const stats = [
    { label: "Total Attendees", value: booth === "all" ? "2,847" : "432", change: "+12%", icon: Users, color: "blue" },
    { label: "Check-ins", value: booth === "all" ? "2,341" : "278", change: "+8%", icon: MapPin, color: "green" },
    { label: "Avg. Session Time", value: booth === "all" ? "4h 32m" : "2h 12m", change: "+15%", icon: Clock, color: "purple" },
    { label: "Engagement Rate", value: booth === "all" ? "87%" : "72%", change: "+5%", icon: TrendingUp, color: "orange" },
  ];

  const getColorClass = (color) => color;
  const getBgColorClass = (color) => color + "-bg";

  return (
    <div className="overview-widget">

      {/* Filters */}
      <div className="filters-row">
        <select value={zone} onChange={(e) => setZone(e.target.value)} className="filter-select">
          <option value="all">All Zones</option>
          <option value="zone1">Zone 1</option>
          <option value="zone2">Zone 2</option>
        </select>
        <select value={subZone} onChange={(e) => setSubZone(e.target.value)} className="filter-select">
          <option value="all">All Sub Zones</option>
          <option value="sub1">Sub Zone 1</option>
          <option value="sub2">Sub Zone 2</option>
        </select>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="filter-select">
          <option value="all">All Departments</option>
          <option value="cse">CSE</option>
          <option value="ece">ECE</option>
        </select>
        <select value={deptSubZone} onChange={(e) => setDeptSubZone(e.target.value)} className="filter-select">
          <option value="all">All Dept Sub Zones</option>
          <option value="lab1">Lab 1</option>
          <option value="lab2">Lab 2</option>
        </select>
        <select value={booth} onChange={(e) => setBooth(e.target.value)} className="filter-select">
          <option value="all">All Booths</option>
          <option value="booth1">Booth 1</option>
          <option value="booth2">Booth 2</option>
          <option value="booth3">Booth 3</option>
        </select>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="filter-select">
          <option value="realtime">Realtime</option>
          <option value="1h">Last 1 Hour</option>
          <option value="3h">Last 3 Hours</option>
          <option value="5h">Last 5 Hours</option>
          <option value="12h">Last 12 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className={`stat-bg ${getBgColorClass(stat.color)}`}></div>
              <div className="stat-content">
                <div className="stat-header">
                  <div className={`stat-icon ${getColorClass(stat.color)}`}><Icon size={24} /></div>
                  <div className="stat-change">
                    <TrendingUp size={14} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Popular Sessions */}
      <div className="charts-grid">
        {/* Attendance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Attendance Over Time</h3>
            <div className="chart-info">
              <div className="chart-dot"></div>
              <span>{timeRange === "realtime" ? "Live Realtime Data" : `Data (${timeRange})`}</span>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-icon-bg">
              <BarChart3 size={24} />
            </div>
            <p>Chart placeholder</p>
            <p>{timeRange === "realtime" ? "Realtime attendance visualization" : `Attendance trends (${timeRange})`}</p>
          </div>
        </div>

        {/* Popular Sessions */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Popular Sessions</h3>
            <div className="top-label">Top 4</div>
          </div>
          <div className="sessions-list">
            {[
              { name: "Robotics & Automation Showcase", attendees: Math.floor(Math.random() * 200) + 100, color: "blue" },
              { name: "Sustainable Energy Projects", attendees: Math.floor(Math.random() * 200) + 100, color: "green" },
              { name: "Civil Engineering Innovations", attendees: Math.floor(Math.random() * 200) + 100, color: "purple" },
              { name: "Student Startup Pitches", attendees: Math.floor(Math.random() * 200) + 100, color: "orange" },
            ].map((session, i) => (
              <div key={i} className="session-item">
                <div className="session-info">
                  <div className={`session-dot ${session.color}`}></div>
                  <span>{session.name}</span>
                </div>
                <div className="session-attendees">
                  <span>{session.attendees}</span>
                  <span>attendees</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewWidget;
