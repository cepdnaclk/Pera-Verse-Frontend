import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import "./FeedbackWidget.css";

const FeedbackWidget = () => {
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [subZoneFilter, setSubZoneFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [deptSubZoneFilter, setDeptSubZoneFilter] = useState("all");

  const feedbackStats = [
    { label: "Overall Rating", value: "4.7/5", icon: Star, color: "yellow" },
    { label: "Total Reviews", value: "1,247", icon: MessageSquare, color: "blue" },
    { label: "Satisfaction Rate", value: "92%", icon: ThumbsUp, color: "green" },
  ];

  const feedback = [
    { rating: 5, comment: "Excellent event organization!", time: "2h ago", sentiment: "positive", zone: "Zone A", subZone: "Sub1", department: "CSE", deptSubZone: "Lab1" },
    { rating: 4, comment: "Good content, but crowded.", time: "3h ago", sentiment: "neutral", zone: "Zone B", subZone: "Sub2", department: "ECE", deptSubZone: "Lab2" },
    { rating: 3, comment: "WiFi issues in the hall.", time: "5h ago", sentiment: "negative", zone: "Zone A", subZone: "Sub1", department: "CSE", deptSubZone: "Lab1" },
    { rating: 5, comment: "Loved the keynote!", time: "1h ago", sentiment: "positive", zone: "Zone B", subZone: "Sub2", department: "ECE", deptSubZone: "Lab2" },
  ];

  const filteredFeedback = feedback.filter(f => {
    const matchSentiment = sentimentFilter === "all" || f.sentiment === sentimentFilter;
    const matchZone = zoneFilter === "all" || f.zone === zoneFilter;
    const matchSubZone = subZoneFilter === "all" || f.subZone === subZoneFilter;
    const matchDept = departmentFilter === "all" || f.department === departmentFilter;
    const matchDeptSubZone = deptSubZoneFilter === "all" || f.deptSubZone === deptSubZoneFilter;
    return matchSentiment && matchZone && matchSubZone && matchDept && matchDeptSubZone;
  });

  const zones = ["all", ...Array.from(new Set(feedback.map(f => f.zone)))];
  const subZones = ["all", ...Array.from(new Set(feedback.map(f => f.subZone)))];
  const departments = ["all", ...Array.from(new Set(feedback.map(f => f.department)))];
  const deptSubZones = ["all", ...Array.from(new Set(feedback.map(f => f.deptSubZone)))];

  const getSentimentClass = (sentiment) => {
    if (sentiment === "positive") return "feedback-positive";
    if (sentiment === "neutral") return "feedback-neutral";
    if (sentiment === "negative") return "feedback-negative";
    return "";
  };

  return (
    <div className="feedback-widget">
      {/* Feedback Stats */}
      <div className="stats-grid">
        {feedbackStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-flex">
                <Icon size={24} className={`icon-${stat.color}`} />
                <div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          {zones.map((z, i) => (
            <option key={i} value={z}>{z === "all" ? "All Zones" : z}</option>
          ))}
        </select>

        <select value={subZoneFilter} onChange={(e) => setSubZoneFilter(e.target.value)}>
          {subZones.map((s, i) => (
            <option key={i} value={s}>{s === "all" ? "All Sub Zones" : s}</option>
          ))}
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          {departments.map((d, i) => (
            <option key={i} value={d}>{d === "all" ? "All Departments" : d}</option>
          ))}
        </select>

        <select value={deptSubZoneFilter} onChange={(e) => setDeptSubZoneFilter(e.target.value)}>
          {deptSubZones.map((ds, i) => (
            <option key={i} value={ds}>{ds === "all" ? "All Dept Sub Zones" : ds}</option>
          ))}
        </select>
      </div>

      {/* Recent Feedback */}
      <div className="recent-feedback">
        <div className="recent-header">
          <h3>Recent Feedback</h3>
          <button className="view-all-btn">View All</button>
        </div>

        <div className="feedback-list">
          {filteredFeedback.length === 0 ? (
            <p className="no-feedback">No feedback matches the selected filters.</p>
          ) : (
            filteredFeedback.map((fb, i) => (
              <div key={i} className={`feedback-card ${getSentimentClass(fb.sentiment)}`}>
                <div className="feedback-header">
                  <div className="feedback-info">
                    <div className="stars">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          className={idx < fb.rating ? "star-filled" : "star-empty"}
                        />
                      ))}
                    </div>
                    <span className="feedback-time">{fb.time}</span>
                  </div>
                  {fb.sentiment === "negative" && <AlertCircle size={20} className="icon-red" />}
                </div>
                <p className="feedback-comment">{fb.comment}</p>
                <p className="feedback-meta">
                  📍 Zone: {fb.zone} | Sub Zone: {fb.subZone} | Dept: {fb.department} | Dept Sub Zone: {fb.deptSubZone}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackWidget;
