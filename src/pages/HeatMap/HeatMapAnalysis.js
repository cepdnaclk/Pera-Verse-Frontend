import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import HeatMap from "../../components/HeatMap"; // existing HeatMap component
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import GaugeChart from '../../components/HeatMapAnalysis/GaugeChart';
import SearchBar from "../../components/HeatMapAnalysis/searchBar";
// If you use BuildingBarChart, update its import as well:
import BuildingBarChart from "../../components/HeatMapAnalysis/BuildingBarChart";

import { LoadingView, ErrorView } from "../../utils/uiHelpers"; // your helpers

const CrowdManagement = () => {
  const [crowdData, setCrowdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("current"); // "current" | "predicted"
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [threshold, setThreshold] = useState(80); // adjustable warning threshold
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [buildingHistory, setBuildingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // TODO: Replace with real API endpoint from other team
  const API_URL = "http://localhost:5000/api/crowd";
  const intervalRef = useRef();
  const historyIntervalRef = useRef();

  // Fetch crowd data once and then every 5 seconds
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(intervalRef.current);
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

  const fetchData = async () => {
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCrowdData(data);
      setLoading(false);
    } catch (err) {
      setError("Error loading crowd data");
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
  const filteredData =
    selectedBuilding === "all"
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

  // Fetch building history when a building is selected
  useEffect(() => {
    if (selectedBuilding !== "all") {
      fetchBuildingHistory();
    } else {
      setBuildingHistory([]);
    }
  }, [selectedBuilding]);

  const fetchBuildingHistory = async () => {
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
        const data = await response.json();
        setBuildingHistory(data);
      }
    } catch (err) {
      console.error("Error fetching building history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Get building capacity (for the gauge chart)
  const getBuildingCapacity = (buildingId) => {
    // Default capacities if not provided by API
    const defaultCapacities = {
      1: 120, // Faculty Canteen
      2: 100, // Lecture Hall 1
      3: 150, // Drawing Office 1
      4: 200, // Library
      5: 80,  // Lab 1
      6: 90,  // Lecture Hall 2
      7: 130, // Drawing Office 2
    };
    
    // Try to get capacity from data if available, otherwise use default
    const building = crowdData.find(d => String(d.buildingId) === String(buildingId));
    return building?.capacity || defaultCapacities[buildingId] || 100;
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  if (loading) return <LoadingView message="Loading crowd data..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;

  return (
    <div className="p-6 pt-20 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 mt-4"> {/* Added mt-4 */}
        <h1 className="text-2xl font-bold">Crowd Management</h1>
        <button
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Live Timestamp */}
      <div className="text-sm text-gray-500 mb-4">
        Live Data Time: {crowdData[0]?.timestamp || "--:--"}
      </div>

      {/* Controls + Search Bar - Fixed positioning */}
      <div className="bg-white p-4 rounded-lg shadow-md z-20 relative mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex-shrink-0">
            View Mode:{" "}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white text-gray-700 transition-all duration-150"
            >
              <option value="current">Current</option>
              <option value="predicted">Predicted</option>
            </select>
          </label>

          <label className="flex-shrink-0">
            Building:{" "}
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white text-gray-700 transition-all duration-150"
            >
              <option value="all">All</option>
              {crowdData.map((d) => (
                <option key={d.buildingId} value={d.buildingId}>
                  {d.buildingName}
                </option>
              ))}
            </select>
          </label>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Heat Map - Always visible */}
      <HeatMap
        data={filteredData.map((d) => ({
          buildingId: d.buildingId,
          color: d.color,
          count: viewMode === "current" ? d.currentCount : d.predictedCount,
        }))}
      />

      {selectedBuilding === "all" ? (
        // When "All" buildings selected - show only overall trend
        <div className="p-4 bg-white rounded-xl shadow my-6">
          <h2 className="text-lg font-semibold mb-2">Overall Crowd Trend</h2>
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
          <div className="my-6">
            <div className="bg-white rounded-xl shadow p-4">
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
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="p-4 bg-white rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Crowd Trend</h2>
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
            <div className="p-4 bg-white rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Current vs Predicted</h2>
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
            <div className="mt-6">
              <div className="p-4 bg-white rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">
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
  );
};

export default CrowdManagement;
