import React, { useState } from "react";
import { Bell, Search, Settings, LogOut, ChevronDown, Calendar, MapPin, Users } from "lucide-react";
import "./Header.css";

export const Header = ({ eventInfo, userInfo, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <h1>{eventInfo.title}</h1>
        <div className="event-meta">
          <span className="event-date"><Calendar size={14} /> {eventInfo.date}</span>
          <span className="event-location"><MapPin size={14} /> {eventInfo.location}</span>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-btn"><Search size={18} /></button>

        {/* Notifications */}
        <div className="dropdown">
          <button onClick={() => setShowNotifications(!showNotifications)} className="icon-btn">
            <Bell size={18} />
            <span className="notif-badge">3</span>
          </button>
          {showNotifications && (
            <div className="dropdown-menu">
              <p><strong>Notifications</strong></p>
              <ul>
                <li>New feedback received</li>
                <li>Export completed</li>
                <li>System update available</li>
              </ul>
            </div>
          )}
        </div>

        <button className="icon-btn"><Settings size={18} /></button>

        {/* Profile */}
        <div className="dropdown">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-btn">
            <div className="avatar"><Users size={16} color="#fff" /></div>
            <span>{userInfo.name}</span>
            <ChevronDown size={14} />
          </button>
          {showProfileMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item"><Settings size={16} /> Settings</button>
              <button className="dropdown-item logout" onClick={onLogout}><LogOut size={16} /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
