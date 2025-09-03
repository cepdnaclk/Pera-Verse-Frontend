import React, { useState } from "react";
import { Download, FileText, Image, FileSpreadsheet, Calendar, CheckCircle } from "lucide-react";
import "./ExportWidget.css";

const ExportWidget = () => {
  const [exportHistory, setExportHistory] = useState([
    { name: "Attendance Report.pdf", type: "PDF", date: "2025-09-23", status: "completed" },
    { name: "Feedback Analysis.xlsx", type: "Excel", date: "2025-09-23", status: "completed" },
    { name: "Heatmap Data.csv", type: "CSV", date: "2025-09-23", status: "processing" },
  ]);

  const exportOptions = [
    { title: "Analytics Report", description: "Overview with charts & stats", formats: ["PDF", "Excel"], icon: FileText, color: "blue" },
    { title: "Attendance Data", description: "Detailed attendee info", formats: ["CSV", "Excel"], icon: FileSpreadsheet, color: "green" },
    { title: "Heatmap Images", description: "Visual heatmap representations", formats: ["PNG", "SVG"], icon: Image, color: "purple" },
    { title: "Event Summary", description: "Executive summary for stakeholders", formats: ["PDF"], icon: Calendar, color: "orange" },
  ];

  const handleExport = (title, format) => {
    const newExport = {
      name: `${title}.${format.toLowerCase()}`,
      type: format,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
    };
    setExportHistory(prev => [newExport, ...prev]);

    setTimeout(() => {
      setExportHistory(prev =>
        prev.map(item => item.name === newExport.name ? { ...item, status: "completed" } : item)
      );
    }, 3000);
  };

  const getColorClass = (color) => {
    if (color === "blue") return "option-blue";
    if (color === "green") return "option-green";
    if (color === "purple") return "option-purple";
    if (color === "orange") return "option-orange";
    return "";
  };

  return (
    <div className="export-widget">

      {/* Export Options */}
      <div className="export-options">
        {exportOptions.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <div key={i} className={`export-card ${getColorClass(opt.color)}`}>
              <div className="export-card-flex">
                <div className={`export-icon-bg ${opt.color}`}>
                  <Icon size={24} className={`export-icon ${opt.color}`} />
                </div>
                <div className="export-details">
                  <h3 className="export-title">{opt.title}</h3>
                  <p className="export-desc">{opt.description}</p>
                  <div className="export-formats">
                    {opt.formats.map(f => (
                      <button
                        key={f}
                        onClick={() => handleExport(opt.title, f)}
                        className="export-btn"
                      >
                        <Download size={14} />
                        <span>{f}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export History */}
      <div className="export-history">
        <h3>Recent Exports</h3>
        <div className="history-list">
          {exportHistory.map((item, i) => (
            <div key={i} className="history-item">
              <div className="history-info">
                <div className={`status-icon ${item.status}`}>
                  {item.status === "completed" ? (
                    <CheckCircle size={16} className="icon-completed" />
                  ) : (
                    <div className="spinner"></div>
                  )}
                </div>
                <div>
                  <p className="history-name">{item.name}</p>
                  <p className="history-meta">{item.type} • {item.date}</p>
                </div>
              </div>
              {item.status === "completed" && (
                <button className="download-btn">Download</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Exports */}
      <div className="scheduled-exports">
        <h3>Schedule Automated Exports</h3>
        <div className="schedule-grid">
          <div className="schedule-card">
            <h4>Daily Reports</h4>
            <p>Automatically generate daily analytics</p>
            <button className="setup-btn">Set Up</button>
          </div>
          <div className="schedule-card">
            <h4>Final Report</h4>
            <p>Complete overview after the event ends</p>
            <button className="setup-btn">Set Up</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExportWidget;
