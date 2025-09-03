import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Map as HeatMap, MessageSquare, Download, LucideIcon } from 'lucide-react';
import './Sidebar.css';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, path: '/organizer-dashboard/overview' },
  { id: 'heatmaps', label: 'Heatmaps', icon: HeatMap, path: '/organizer-dashboard/heatmaps' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/organizer-dashboard/feedback' },
  { id: 'export', label: 'Export', icon: Download, path: '/organizer-dashboard/export' },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar open">
      <div className="sidebar-content">
        {/* Logo/Brand */}
        <div className="sidebar-logo">
          <div className="logo-flex">
            <div className="logo-icon">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="logo-title">Event Analytics</h2>
              <p className="logo-subtitle">Dashboard</p>
            </div>
          </div>
          <div className="logo-bar"></div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          <div className="nav-header">
            <h3>Navigation</h3>
          </div>
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon">
                      <Icon size={20} />
                    </div>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-logo">
            <div className="footer-icon"></div>
          </div>
          <p className="footer-text">© 2025 Event Analytics</p>
          <p className="footer-version">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
