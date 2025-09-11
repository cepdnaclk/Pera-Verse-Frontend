import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import HeatMap from "../../components/HeatMap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import GaugeChart from '../../components/HeatMapAnalysis/GaugeChart';
import SearchBar from "../../components/HeatMapAnalysis/searchBar";
import BuildingBarChart from "../../components/HeatMapAnalysis/BuildingBarChart";
import { LoadingView, ErrorView } from "../../utils/uiHelpers";
import './CrowdManagement.css';

interface CrowdData {
  buildingId: number;
  buildingName: string;
  currentCount: number;
  predictedCount: number;
  timestamp: string;
  color: string;
  capacity?: number;
}

interface BuildingHistoryData {
  timestamp: string;
  current_count: number;
}

const CrowdManagement: React.FC = () => {
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"current" | "predicted">("current");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [threshold, setThreshold] = useState<number>(80);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [buildingHistory, setBuildingHistory] = useState<BuildingHistoryData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // TODO: Replace with real API endpoint from other team
  const API_URL = "http://localhost:5000/api/crowd";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch crowd data once and then every 5 seconds
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Fetch building history data when a building is selected, and refresh every 5 seconds
  useEffect(() => {
    if (selectedBuilding !== "all") {
      fetchBuildingHistory();
      historyIntervalRef.current = setInterval(fetchBuildingHistory, 5000);
    } else {
      setBuildingHistory([]);
      if (historyIntervalRef.current) {
        clearInterval(historyIntervalRef.current);
      }
    }

    return () => {
      if (historyIntervalRef.current) {
        clearInterval(historyIntervalRef.current);
      }
    };
  }, [selectedBuilding]);

  const fetchData = async (): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data: CrowdData[] = await response.json();
      setCrowdData(data);
      setLoading(false);
    } catch (err) {
      setError("Error loading crowd data. Using mock data for demonstration.");
      // Use mock data for development
      const mockData: CrowdData[] = [
        {
          buildingId: 1,
          buildingName: "Faculty Canteen",
          currentCount: 85,
          predictedCount: 92,
          timestamp: new Date().toLocaleTimeString(),
          color: "#ff6b6b",
          capacity: 120
        },
        {
          buildingId: 2,
          buildingName: "Lecture Hall 1",
          currentCount: 65,
          predictedCount: 70,
          timestamp: new Date().toLocaleTimeString(),
          color: "#4ecdc4",
          capacity: 100
        },
        {
          buildingId: 3,
          buildingName: "Drawing Office 1",
          currentCount: 110,
          predictedCount: 125,
          timestamp: new Date().toLocaleTimeString(),
          color: "#ff9f43",
          capacity: 150
        },
        {
          buildingId: 4,
          buildingName: "Library",
          currentCount: 140,
          predictedCount: 155,
          timestamp: new Date().toLocaleTimeString(),
          color: "#6c5ce7",
          capacity: 200
        },
        {
          buildingId: 5,
          buildingName: "Lab 1",
          currentCount: 45,
          predictedCount: 50,
          timestamp: new Date().toLocaleTimeString(),
          color: "#a29bfe",
          capacity: 80
        }
      ];
      setCrowdData(mockData);
      setLoading(false);
    }
  };

  // Update suggestions as user types
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    setSuggestions(
      crowdData
        .filter((d) => d.buildingName.toLowerCase().includes(lowerSearch))
        .map((d) => d.buildingName)
    );
  }, [searchTerm, crowdData]);

  // Filter data by building or search term
  const filteredData = selectedBuilding === "all"
    ? searchTerm.trim()
      ? crowdData.filter((d) =>
          d.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : crowdData
    : crowdData.filter((d) => String(d.buildingId) === String(selectedBuilding));

  // Detect alerts based on predicted counts
  const highRiskBuildings = filteredData.filter(
    (d) => d.predictedCount > threshold
  );

  const fetchBuildingHistory = async (): Promise<void> => {
    if (selectedBuilding === "all") return;

    setLoadingHistory(true);
    try {
      const selectedBuildingData = crowdData.find(
        (d) => String(d.buildingId) === String(selectedBuilding)
      );
      if (selectedBuildingData) {
        const buildingName = selectedBuildingData.buildingName;
        const response = await fetch(
          `http://localhost:5000/api/building-history/${encodeURIComponent(
            buildingName
          )}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data: BuildingHistoryData[] = await response.json();
        setBuildingHistory(data);
      }
    } catch (err) {
      console.error("Error fetching building history:", err);
      // Use mock history data for development
      const mockHistory: BuildingHistoryData[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 5000).toLocaleTimeString(),
        current_count: Math.floor(Math.random() * 100) + 20
      }));
      setBuildingHistory(mockHistory);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Get building capacity (for the gauge chart)
  const getBuildingCapacity = (buildingId: number): number => {
    const defaultCapacities: Record<number, number> = {
      1: 120, // Faculty Canteen
      2: 100, // Lecture Hall 1
      3: 150, // Drawing Office 1
      4: 200, // Library
      5: 80,  // Lab 1
      6: 90,  // Lecture Hall 2
      7: 130, // Drawing Office 2
    };
    
    const building = crowdData.find(d => String(d.buildingId) === String(buildingId));
    return building?.capacity || defaultCapacities[buildingId] || 100;
  };

  const handleSearch = (query: string): void => {
    setSearchTerm(query);
  };

  if (loading) {
    return (
      <div className="crowd-management-container">
        <div className="crowd-management-inner">
          <LoadingView message="Loading crowd data..." />
        </div>
      </div>
    );
  }

  if (error && crowdData.length === 0) {
    return (
      <div className="crowd-management-container">
        <div className="crowd-management-inner">
          <ErrorView error={error} onRetry={fetchData} />
        </div>
      </div>
    );
  }

  return (
    <div className="crowd-management-container">
      <div className="crowd-management-inner">
        {/* Page Header */}
        <div className="crowd-management-header">
          <h1 className="crowd-management-title">Crowd Management</h1>
          <button
            onClick={fetchData}
            className="crowd-management-refresh-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Live Timestamp */}
        <div className="crowd-management-timestamp">
          <strong>Live Data Time:</strong> {crowdData[0]?.timestamp || "--:--"}
        </div>

        {/* Alerts Section */}
        {highRiskBuildings.length > 0 && (
          <div className="crowd-management-alerts">
            <div className="crowd-management-alert-title">
              <AlertTriangle className="w-5 h-5" />
              High Occupancy Alerts
            </div>
            <ul className="crowd-management-alert-list">
              {highRiskBuildings.map((building) => (
                <li key={building.buildingId} className="crowd-management-alert-item">
                  {building.buildingName}: {building.predictedCount} people (predicted)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Controls Section */}
        <div className="crowd-management-controls">
          <div className="crowd-management-controls-wrapper">
            <div className="crowd-management-control-group">
              <label className="crowd-management-control-label">View Mode:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as "current" | "predicted")}
                className="crowd-management-select"
              >
                <option value="current">Current</option>
                <option value="predicted">Predicted</option>
              </select>
            </div>

            <div className="crowd-management-control-group">
              <label className="crowd-management-control-label">Building:</label>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="crowd-management-select"
              >
                <option value="all">All Buildings</option>
                {crowdData.map((d) => (
                  <option key={d.buildingId} value={d.buildingId}>
                    {d.buildingName}
                  </option>
                ))}
              </select>
            </div>

            <div className="crowd-management-control-group">
              <label className="crowd-management-control-label">Alert Threshold:</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="crowd-management-input"
                min="0"
                max="200"
              />
            </div>

            <div className="crowd-management-control-group">
              <label className="crowd-management-control-label">Search Buildings:</label>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Heat Map Section */}
        <div className="crowd-management-heatmap-section">
          <HeatMap />
        </div>

        {/* Charts Section */}
        <div className="crowd-management-charts-container">
          {selectedBuilding === "all" ? (
            // When "All" buildings selected - show only overall trend
            <div className="crowd-management-chart-card">
              <h2 className="crowd-management-chart-title">Overall Crowd Trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="buildingName"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="currentCount" 
                    name="Current Count" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictedCount" 
                    name="Predicted Count" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // When specific building selected - show all charts for that building
            <>
              {/* Gauge Chart for Selected Building */}
              <div className="crowd-management-gauge-section">
                <div className="crowd-management-gauge-card">
                  {crowdData
                    .filter(d => String(d.buildingId) === String(selectedBuilding))
                    .map(building => (
                      <GaugeChart
                        key={building.buildingId}
                        value={building.currentCount}
                        max={getBuildingCapacity(building.buildingId)}
                        title={`${building.buildingName} Occupancy`}
                      />
                    ))}
                </div>
              </div>
              
              {/* Charts Grid */}
              <div className="crowd-management-charts-grid">
                {/* Line Chart */}
                <div className="crowd-management-chart-card">
                  <h2 className="crowd-management-chart-title">Crowd Trend</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="currentCount" stroke="#8884d8" />
                      <Line type="monotone" dataKey="predictedCount" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="crowd-management-chart-card">
                  <h2 className="crowd-management-chart-title">Current vs Predicted</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="currentCount" fill="#8884d8" />
                      <Bar dataKey="predictedCount" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Building History Chart - Past 120 seconds */}
              {buildingHistory.length > 0 && (
                <div className="crowd-management-history-section">
                  <div className="crowd-management-chart-card">
                    <h2 className="crowd-management-chart-title">
                      Past 2 Minutes Crowd Variation
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={buildingHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="current_count" 
                          name="Current Count"
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrowdManagement;