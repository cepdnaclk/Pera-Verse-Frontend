import React from 'react';
import { BarChart3, Map as HeatMap, MessageSquare, Download, X, Menu, LucideIcon } from 'lucide-react';

type Section = 'overview' | 'heatmaps' | 'feedback' | 'export';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems: Array<{ id: Section; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'heatmaps', label: 'Heatmaps', icon: HeatMap },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'export', label: 'Export', icon: Download },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/90 backdrop-blur-md border-r border-white/20
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Event Analytics
                </h2>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full opacity-20"></div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6" role="navigation" aria-label="Main navigation">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
            </div>
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSectionChange(item.id);
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={`
                        w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        group
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-md'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className={`
                        p-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }
                      `}>
                        <Icon size={20} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">© 2025 Event Analytics</p>
              <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;