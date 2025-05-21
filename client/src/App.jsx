import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import SafeZones from './pages/SafeZones';
import Report from './pages/Report';
import IncidentReport from './pages/IncidentReport';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/safezones" element={<SafeZones />} />
          <Route path="/report" element={<Report />} />
          <Route path="/incident-report" element={<IncidentReport />} />
          <Route path="/" element={<SafeZones />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
