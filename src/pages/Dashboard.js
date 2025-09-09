// patched by Codex: fix asset import
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Dashboard.css';
const mapUrl = '/images/clickable_faculty_map.svg';

const MAP_WIDTH = 462.6; // from SVG viewBox
const MAP_HEIGHT = 549.2; // from SVG viewBox
const MIN_SCALE = 0.9;
const MAX_SCALE = 4;

const categories = {
  Exhibits: '#2563eb',
  Amenities: '#16a34a',
  Emergency: '#ef4444'
};

const mockPoints = [
  { id: 'ex-1', name: 'Main Robotics Exhibit', category: 'Exhibits', x: 200, y: 240, description: 'Robotics and AI demos', startTime: new Date().setHours(21, 33, 0, 0) }, // 9:33 PM
  { id: 'ex-2', name: 'Space Tech Pavilion', category: 'Exhibits', x: 320, y: 310, description: 'Satellites and rockets' },
  { id: 'am-1', name: 'Restrooms - North', category: 'Amenities', x: 120, y: 150, description: 'Accessible facilities' },
  { id: 'am-2', name: 'Food Court', category: 'Amenities', x: 260, y: 460, description: 'Snacks and beverages' },
  { id: 'em-1', name: 'First Aid', category: 'Emergency', x: 150, y: 300, description: 'Medical assistance' },
  { id: 'em-2', name: 'Emergency Exit', category: 'Emergency', x: 380, y: 380, description: 'Exit point' }
];

const zoneDropdown = [
  {
    key: 'zone1',
    label: 'Zone 1',
    subzones: [
      { key: 'zone1-all', label: 'All Zone 1' },
      { key: 'zone1-subA', label: 'Subzone A' },
      { key: 'zone1-subB', label: 'Subzone B' }
    ]
  },
  {
    key: 'zone2',
    label: 'Zone 2',
    subzones: [
      { key: 'zone2-all', label: 'All Zone 2' },
      { key: 'zone2-subA', label: 'Subzone A' }
    ]
  },
  {
    key: 'zone3',
    label: 'Zone 3',
    subzones: [
      { key: 'zone3-all', label: 'All Zone 3' }
    ]
  }
];

const allSubzones = [
  { key: 'zone1-subA', label: 'Zone 1 - Subzone A' },
  { key: 'zone1-subB', label: 'Zone 1 - Subzone B' },
  { key: 'zone2-subA', label: 'Zone 2 - Subzone A' },
  // Add more subzones as needed
  { key: 'zone1-all', label: 'All Zone 1' },
  { key: 'zone2-all', label: 'All Zone 2' },
  { key: 'zone3-all', label: 'All Zone 3' }
];

const getZoneOfPoint = (p) => {
  // Example logic: assign points to zones by coordinates or name
  if (p.name.includes('Robotics') || p.name.includes('Space')) return { zone: 'zone1', subzone: 'zone1-subA' };
  if (p.name.includes('Restrooms')) return { zone: 'zone2', subzone: 'zone2-subA' };
  if (p.name.includes('Food')) return { zone: 'zone2', subzone: 'zone2-all' };
  if (p.name.includes('First Aid')) return { zone: 'zone3', subzone: 'zone3-all' };
  if (p.name.includes('Emergency')) return { zone: 'zone3', subzone: 'zone3-all' };
  return { zone: 'other', subzone: 'other' };
};

const BookmarkIcon = ({ filled = false }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" style={{ verticalAlign: 'middle' }}>
    <path
      d="M6 3.5A2.5 2.5 0 0 1 8.5 1h5A2.5 2.5 0 0 1 16 3.5v15.2a.7.7 0 0 1-1.1.6l-4.4-2.7-4.4 2.7A.7.7 0 0 1 6 18.7V3.5z"
      fill={filled ? "#2563eb" : "none"}
      stroke="#2563eb"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Add a simple directions icon (SVG)
const DirectionsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" style={{ verticalAlign: 'middle' }}>
    <path
      d="M11 2l8 8-8 8-8-8 8-8zm0 4v4h4"
      stroke="#2563eb"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

// Add a locate me icon (SVG)
const LocateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" style={{ verticalAlign: 'middle' }}>
    <circle cx="11" cy="11" r="3" fill="currentColor"/>
    <path d="M11 1v4M11 17v4M21 11h-4M5 11H1" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

// Search icon component (clickable)
const SearchIconBtn = ({ onClick }) => (
  <button
    className="map-search-icon-btn"
    type="button"
    aria-label="Search"
    onClick={onClick}
    tabIndex={0}
    style={{
      position: 'absolute',
      right: '40px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#2563eb" strokeWidth="2"/>
      <line x1="16" y1="16" x2="21" y2="21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </button>
);

const Dashboard = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState({ Exhibits: true, Amenities: true, Emergency: true });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedSubzone, setSelectedSubzone] = useState('all');
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('main'); // 'main' or 'bookmarks'
  const [showZoneFilter, setShowZoneFilter] = useState(false);

  // pinch support state
  const pinchRef = useRef({ active: false, dist: 0, center: { x: 0, y: 0 } });

  const visiblePoints = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = mockPoints.filter(p => activeCategories[p.category] && (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
    if (selectedZone !== 'all') {
      filtered = filtered.filter(p => {
        const zoneInfo = getZoneOfPoint(p);
        if (selectedSubzone === 'all' || selectedSubzone === `${selectedZone}-all`) {
          return zoneInfo.zone === selectedZone;
        }
        return zoneInfo.zone === selectedZone && zoneInfo.subzone === selectedSubzone;
      });
    }
    return filtered;
  }, [searchQuery, activeCategories, selectedZone, selectedSubzone]);

  const allResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mockPoints.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }, [searchQuery]);

  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  // Strict clampTranslation: map always stays inside .map-viewport box, never overlaps border
  const clampTranslation = (tx, ty, scale, containerRect) => {
    const mapW = MAP_WIDTH * scale;
    const mapH = MAP_HEIGHT * scale;
    const viewW = containerRect.width;
    const viewH = containerRect.height;

    // If map is smaller than viewport, center it
    let minX, maxX, minY, maxY;
    if (mapW <= viewW) {
      minX = maxX = (viewW - mapW) / 2;
      tx = minX;
    } else {
      minX = viewW - mapW;
      maxX = 0;
      tx = Math.max(minX, Math.min(tx, maxX));
    }
    if (mapH <= viewH) {
      minY = maxY = (viewH - mapH) / 2;
      ty = minY;
    } else {
      minY = viewH - mapH;
      maxY = 0;
      ty = Math.max(minY, Math.min(ty, maxY));
    }
    return { x: tx, y: ty };
  };

  // Centralized zoom logic (always zoom to center, keep inside box)
  // Fix: delta > 0 should zoom out, delta < 0 should zoom in
  const applyZoom = (delta, clientX, clientY) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const prevScale = scale;
    const nextScale = clampScale(scale * (delta < 0 ? 1.1 : 0.9)); // <--- corrected direction
    if (nextScale === prevScale) return;

    // Calculate new translation to keep map centered and inside box
    const mapW = MAP_WIDTH * nextScale;
    const mapH = MAP_HEIGHT * nextScale;
    let tx, ty;
    if (mapW <= rect.width) {
      tx = (rect.width - mapW) / 2;
    } else {
      // Keep center point stable
      const centerX = rect.width / 2;
      tx = centerX - ((centerX - translation.x) * (nextScale / prevScale));
      tx = Math.max(rect.width - mapW, Math.min(tx, 0));
    }
    if (mapH <= rect.height) {
      ty = (rect.height - mapH) / 2;
    } else {
      const centerY = rect.height / 2;
      ty = centerY - ((centerY - translation.y) * (nextScale / prevScale));
      ty = Math.max(rect.height - mapH, Math.min(ty, 0));
    }

    setScale(nextScale);
    setTranslation({ x: tx, y: ty });
  };

  const onWheel = (e) => {
    e.preventDefault();
    applyZoom(e.deltaY, e.clientX, e.clientY);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setIsPanning(true);
    setLastPointer({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setTranslation(t => clampTranslation(t.x + dx, t.y + dy, scale, rect));
    setLastPointer({ x: e.clientX, y: e.clientY });
  };

  const onPointerUp = () => {
    setIsPanning(false);
  };

  // Touch handlers for pan + pinch
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastPointer({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const center = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      pinchRef.current = { active: true, dist, center };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning) {
      const t = e.touches[0];
      const dx = t.clientX - lastPointer.x;
      const dy = t.clientY - lastPointer.y;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTranslation(prev => clampTranslation(prev.x + dx, prev.y + dy, scale, rect));
      setLastPointer({ x: t.clientX, y: t.clientY });
    } else if (e.touches.length === 2 && pinchRef.current.active) {
      const [t1, t2] = e.touches;
      const newDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = newDist / (pinchRef.current.dist || newDist);
      const center = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      const next = clampScale(scale * factor);
      if (next !== scale) {
        // Pinch out (factor > 1): zoom in, Pinch in (factor < 1): zoom out
        applyZoom(factor > 1 ? 1 : -1, center.x, center.y);
      }
      pinchRef.current = { active: true, dist: newDist, center };
    }
  };

  const onTouchEnd = () => {
    setIsPanning(false);
    pinchRef.current = { active: false, dist: 0, center: { x: 0, y: 0 } };
  };

  const zoomIn = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    applyZoom(-1, cx, cy);
  };

  const zoomOut = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    applyZoom(1, cx, cy);
  };

  // Center map in box on initial load and after reset
  const centerMapInBox = (scaleValue = 1) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mapW = MAP_WIDTH * scaleValue;
    const mapH = MAP_HEIGHT * scaleValue;
    const tx = (rect.width - mapW) / 2;
    const ty = (rect.height - mapH) / 2;
    setScale(scaleValue);
    setTranslation({ x: tx, y: ty });
  };

  // On initial mount, center map
  useEffect(() => {
    centerMapInBox(1); // Always center map on initial mount
  }, []);

  // Update resetView to use centerMapInBox
  const resetView = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mapW = MAP_WIDTH * 1;
    const mapH = MAP_HEIGHT * 1;
    const tx = (rect.width - mapW) / 2;
    const ty = (rect.height - mapH) / 2;
    setScale(1);
    setTranslation({ x: tx, y: ty });
  };

  // When scale changes, clamp translation to keep map inside viewport and re-center if needed
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mapW = MAP_WIDTH * scale;
    const mapH = MAP_HEIGHT * scale;
    let tx = translation.x;
    let ty = translation.y;
    // If map is smaller than viewport, always center
    if (mapW <= rect.width) tx = (rect.width - mapW) / 2;
    if (mapH <= rect.height) ty = (rect.height - mapH) / 2;
    setTranslation(t => ({ x: tx, y: ty }));
    // eslint-disable-next-line
  }, [scale]);

  const handleSelectResult = (pt) => {
    setSelectedPoint(pt);
    setSearchQuery(pt.name);
    centerOnPoint(pt);
  };

  const toggleCategory = (cat) => {
    setActiveCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleLegendFilter = (cat) => {
    setActiveCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Quick filter presets for easy viewing
  const quickFilter = (key) => {
    if (key === 'All') {
      setActiveCategories({ Exhibits: true, Amenities: true, Emergency: true });
    } else if (key === 'Amenities') {
      setActiveCategories({ Exhibits: false, Amenities: true, Emergency: false });
    } else if (key === 'Emergency') {
      setActiveCategories({ Exhibits: false, Amenities: false, Emergency: true });
    }
  };

  const transformStyle = {
    transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
    transformOrigin: '0 0'
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  }, [scale, translation]);

  const handleMarkerClick = (p) => {
    setSelectedPoint(p);
    setShowDetailsPopup(true);
  };

  // Bookmark logic
  const isBookmarked = selectedPoint && bookmarks.includes(selectedPoint.id);
  const toggleBookmark = () => {
    if (!selectedPoint) return;
    setBookmarks(prev =>
      prev.includes(selectedPoint.id)
        ? prev.filter(id => id !== selectedPoint.id)
        : [...prev, selectedPoint.id]
    );
  };

  // Memo for bookmarked points
  const bookmarkedPoints = useMemo(
    () => mockPoints.filter(p => bookmarks.includes(p.id)),
    [bookmarks]
  );

  // Add a handler for closing popup when clicking outside
  const handlePopupBackgroundClick = (e) => {
    // Only close if clicked directly on the background (not inside content)
    if (e.target.classList.contains('map-details-popup')) {
      setShowDetailsPopup(false);
      setSelectedPoint(null);
    }
  };

  // Center map on a specific point (used in search results)
  const centerOnPoint = (pt) => {
    const container = containerRef.current;
    if (!container || !pt) return;
    const rect = container.getBoundingClientRect();
    const targetScale = clampScale(2);
    const mx = (pt.x / MAP_WIDTH) * rect.width;
    const my = (pt.y / MAP_HEIGHT) * rect.height;
    const newTx = rect.width / 2 - mx * (targetScale / scale) - (translation.x * (targetScale / scale - 1));
    const newTy = rect.height / 2 - my * (targetScale / scale) - (translation.y * (targetScale / scale - 1));
    setScale(targetScale);
    setTranslation({ x: newTx, y: newTy });
  };

  const locateMe = async () => {
    setIsLocating(true);
    setTimeout(() => setIsLocating(false), 1000);
    // UI only for now
  };

  // Notification state
  const [notification, setNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Helper: get next notification event (10 min before or at start)
  const getNextNotification = () => {
    const now = Date.now();
    // Only for bookmarked points with startTime
    if (bookmarkedPoints.length === 0) return null; // Only enable notification if there are bookmarks
    const events = bookmarkedPoints
      .filter(p => p.startTime)
      .map(p => {
        const start = typeof p.startTime === 'number' ? p.startTime : new Date(p.startTime).getTime();
        return { ...p, start };
      });
    for (const ev of events) {
      const minBefore = ev.start - 10 * 60 * 1000;
      if (
        (now >= minBefore && now < ev.start) || // 10 min before
        (now >= ev.start && now < ev.start + 60 * 1000) // at start, show for 1 min
      ) {
        return ev;
      }
    }
    return null;
  };

  // Notification effect: show popup only once per event
  useEffect(() => {
    let notifiedEventId = null;
    const checkNotification = () => {
      // Only enable notification if there are bookmarks
      if (bookmarkedPoints.length === 0) {
        setShowNotificationPopup(false);
        setNotification(null);
        return;
      }
      const next = getNextNotification();
      if (next && notifiedEventId !== next.id) {
        setNotification(next);
        setShowNotificationPopup(true);
        notifiedEventId = next.id;
        setTimeout(() => setShowNotificationPopup(false), 60000); // auto-hide after 1 min
      }
    };
    const interval = setInterval(checkNotification, 10000); // check every 10s
    checkNotification();
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [bookmarkedPoints]);

  return (
    <div className="dashboard-container with-bottom-padding">
      <div className="map-page">
        <div className="map-header">
          {/* Centered Search Bar and Filter Button side by side */}
          <div className="dashboard-search-center">
            <div className="map-search" style={{ position: 'relative' }}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exhibits..."
                className="map-search-input"
                style={{ paddingRight: '48px' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery) {
                    // Optionally trigger search logic here
                  }
                }}
              />
              <SearchIconBtn onClick={() => {
                // Optionally trigger search logic here
                document.querySelector('.map-search-input')?.focus();
              }} />
              {searchQuery && (
                <button className="map-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
              )}
              {allResults.length > 0 && (
                <div className="map-search-results">
                  {allResults.slice(0, 8).map(item => (
                    <button key={item.id} className="map-search-result" onClick={() => handleSelectResult(item)}>
                      <span className="map-result-dot" style={{ backgroundColor: categories[item.category] }} />
                      <div className="map-result-text">
                        <div className="map-result-title">{item.name}</div>
                        <div className="map-result-sub">{item.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="dashboard-zone-filter-btn-wrap" style={{ position: 'relative' }}>
              <button
                className="dashboard-zone-filter-btn"
                type="button"
                onClick={() => setShowZoneFilter(v => !v)}
                aria-label="Zone/Subzone Filters"
                style={{
                  width: 44,
                  height: 44,
                  padding: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22
                }}
              >
                {/* Google-style filter icon (tune/slider) */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="6" y="7" width="16" height="2.5" rx="1.25" fill="#2563eb"/>
                  <rect x="6" y="13" width="10" height="2.5" rx="1.25" fill="#2563eb"/>
                  <rect x="6" y="19" width="13" height="2.5" rx="1.25" fill="#2563eb"/>
                </svg>
              </button>
              {showZoneFilter && (
                <div
                  className="dashboard-zone-filter-popup"
                  tabIndex={-1}
                  onClick={e => e.stopPropagation()}
                  style={{}}
                >
                  <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 8 }}>Zone/Subzone Filters</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <select
                      className="dashboard-zone-dropdown-select"
                      value={selectedZone}
                      onChange={e => {
                        setSelectedZone(e.target.value);
                        setSelectedSubzone('all');
                      }}
                    >
                      <option value="all">All Zones</option>
                      {zoneDropdown.map(zone => (
                        <option key={zone.key} value={zone.key}>{zone.label}</option>
                      ))}
                    </select>
                    <select
                      className="dashboard-zone-dropdown-select"
                      value={selectedSubzone}
                      onChange={e => setSelectedSubzone(e.target.value)}
                    >
                      <option value="all">All Subzones</option>
                      {selectedZone === 'all'
                        ? allSubzones.map(sub => (
                            <option key={sub.key} value={sub.key}>{sub.label}</option>
                          ))
                        : (zoneDropdown.find(z => z.key === selectedZone)?.subzones || []).map(sub => (
                            <option key={sub.key} value={sub.key}>{sub.label}</option>
                          ))
                  }
                  </select>
                </div>
                <button
                  className="dashboard-zone-filter-close"
                  type="button"
                  onClick={() => setShowZoneFilter(false)}
                  style={{
                    marginTop: 12,
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    padding: '8px 18px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="map-layout">
          {/* Left Sidebar */}
          <div className="map-sidebar">
            {/* Sidebar Content */}
            <div>
              {/* Filter Button as separate block at sidebar top */}
              <div className="dashboard-filter-card">
                <button
                  className="dashboard-filter-btn"
                  onClick={() => setActiveCategories(prev => {
                    const allActive = Object.values(prev).every(Boolean);
                    return {
                      Exhibits: !allActive,
                      Amenities: !allActive,
                      Emergency: !allActive
                    };
                  })}
                >
                  {Object.values(activeCategories).every(Boolean) ? 'Hide All Categories' : 'Show All Categories'}
                </button>
              </div>
              {/* Legend block */}
              <div className="map-legend">
                <div className="map-legend-title">Legend (Click to Filter)</div>
                <div className="map-legend-items">
                  {Object.keys(categories).map(cat => (
                    <button
                      key={cat}
                      className={`map-legend-item${activeCategories[cat] ? ' active' : ''}`}
                      style={{
                        background: activeCategories[cat] ? '#e3f2fd' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: activeCategories[cat] ? '#1976d2' : '#6b7280',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}
                      onClick={() => handleLegendFilter(cat)}
                      type="button"
                    >
                      <span className="map-legend-dot" style={{ backgroundColor: categories[cat] }}></span>
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Main Map */}
          <div className="map-main">
            <div className="map-card">
              <div
                className="map-viewport"
                ref={containerRef}
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="map-content" ref={contentRef} style={transformStyle}>
                  <img src={mapUrl} alt="Interactive map" className="map-image" draggable={false} />
                  {/* Overlay markers */}
                  {visiblePoints.map(p => (
                    <button
                      key={p.id}
                      className={`map-marker ${selectedPoint?.id === p.id ? 'selected' : ''}`}
                      style={{
                        left: `${(p.x / MAP_WIDTH) * 100}%`,
                        top: `${(p.y / MAP_HEIGHT) * 100}%`,
                        backgroundColor: categories[p.category]
                      }}
                      onClick={() => {
                        setSelectedPoint(p);
                        setShowDetailsPopup(true);
                      }}
                      title={p.name}
                      aria-label={p.name}
                      tabIndex={0}
                    />
                  ))}
                </div>
                {/* Controls */}
                <div className="map-controls">
                  <button className="map-ctrl" onClick={zoomIn} aria-label="Zoom in">+</button>
                  <button className="map-ctrl" onClick={zoomOut} aria-label="Zoom out">−</button>
                  <button className={`map-ctrl ${isLocating ? 'loading' : ''}`} onClick={locateMe} aria-label="Locate me">
                    <LocateIcon />
                  </button>
                </div>
                {/* Map Info */}
                <div className="map-info">
                  <div className="map-coordinates">
                    Scale: {Math.round(scale * 100)}%
                  </div>
                </div>
              </div>
            </div>
            {/* Details Popup only, no inline details */}
            {showDetailsPopup && selectedPoint && (
              <div
                className="map-details-popup"
                style={{
                  zIndex: 9999,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={handlePopupBackgroundClick}
              >
                <div
                  className="map-details-content"
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 10px 32px rgba(0,0,0,0.18)',
                    padding: '2rem',
                    minWidth: '320px',
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    className="map-details-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="map-point-dot" style={{ backgroundColor: categories[selectedPoint.category] }} />
                      {selectedPoint.name}
                      <button
                        className="dashboard-bookmark-btn"
                        onClick={toggleBookmark}
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                        style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <BookmarkIcon filled={isBookmarked} />
                      </button>
                    </div>
                    <button
                      className="map-ctrl small"
                      style={{
                        padding: '0.5rem',
                        minWidth: 'unset',
                        height: '40px',
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label="Directions"
                    >
                      <DirectionsIcon />
                    </button>
                  </div>
                  {selectedPoint.description && (
                    <div className="map-details-desc">{selectedPoint.description}</div>
                  )}
                  {/* Remove .map-details-actions block for directions */}
                </div>
              </div>
            )}
          </div>
          {/* Bookmark Sidebar as a block */}
          <div className="map-bookmark-sidebar-block" style={{
            flex: '0 0 280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.15), -8px -8px 16px rgba(255,255,255,0.8)',
            padding: '20px',
            marginLeft: '1rem',
            minHeight: '400px'
          }}>
            <div className="dashboard-sidebar-tabs">
              <button
                className={`dashboard-sidebar-tab${sidebarTab === 'bookmarks' ? ' active' : ''}`}
                onClick={() => setSidebarTab('bookmarks')}
                type="button"
              >
                Bookmarks
                {bookmarks.length > 0 && (
                  <span className="dashboard-bookmark-count">{bookmarks.length}</span>
                )}
              </button>
            </div>
            {/* Bookmarks list */}
            <div className="dashboard-bookmarks-list">
              {bookmarkedPoints.length === 0 ? (
                <div className="dashboard-bookmarks-empty">No bookmarks yet.</div>
              ) : (
                bookmarkedPoints.map(p => (
                  <button
                    key={p.id}
                    className="dashboard-bookmark-item"
                    onClick={() => {
                      setSelectedPoint(p);
                      setShowDetailsPopup(true);
                      setSidebarTab('main');
                    }}
                  >
                    <span className="dashboard-bookmark-dot" style={{ backgroundColor: categories[p.category] }} />
                    <span className="dashboard-bookmark-name">{p.name}</span>
                    <span className="dashboard-bookmark-icon">
                      <BookmarkIcon filled />
                    </span>
                  </button>
                ))
              )}
            </div>
            {/* Notifications block (completely separate, below bookmarks) */}
            <div className="dashboard-bookmark-notification-block" style={{
              marginTop: '1rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(37,99,235,0.06)'
            }}>
              <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 8 }}>Notifications</div>
              {notification && (
                <div className="dashboard-bookmark-notification">
                  <span role="img" aria-label="notification" style={{ marginRight: 6 }}>🔔</span>
                  <span>
                    {(() => {
                      const now = Date.now();
                      const start = typeof notification.startTime === 'number' ? notification.startTime : new Date(notification.startTime).getTime();
                      if (now < start) {
                        return <>Upcoming: <strong>{notification.name}</strong> at {new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>;
                      } else {
                        return <>Event <strong>{notification.name}</strong> is starting now!</>;
                      }
                    })()}
                  </span>
                </div>
              )}
              {!notification && (
                <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>No notifications.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Notification popup: only show once, 10 min before or at start time */}
      {showNotificationPopup && notification && (
        <div className="dashboard-notification-popup">
          <span role="img" aria-label="notification" style={{ fontSize: 22 }}>🔔</span>
          <div>
            <div style={{ fontWeight: 600, color: '#2563eb' }}>{notification.name}</div>
            <div style={{ fontSize: 14, color: '#374151' }}>
              {(() => {
                const now = Date.now();
                const start = typeof notification.startTime === 'number' ? notification.startTime : new Date(notification.startTime).getTime();
                if (now < start) {
                  return `Starts at ${new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                } else {
                  return `Event is starting now!`;
                }
              })()}
            </div>
          </div>
          <button
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: '#2563eb'
            }}
            aria-label="Close notification"
            onClick={() => setShowNotificationPopup(false)}
          >×</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
