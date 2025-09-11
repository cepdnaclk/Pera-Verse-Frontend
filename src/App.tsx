import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import CrowdManagement from './pages/HeatMap/CrowdManagement';
import EventSchedule from './pages/EventSchedule';
import Information from './pages/Information';
import NotFound from './pages/NotFound';
import LoginPage from './pages/OrganizerDashBoard/LoginPage';

const App: React.FC = () => {
  const handleLogin = () => {
    // Handle login logic here
    console.log('User logged in');
  };
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crowd-management" element={<CrowdManagement />} />
            <Route path="/events" element={<EventSchedule />} />
            <Route path="/information" element={<Information />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
