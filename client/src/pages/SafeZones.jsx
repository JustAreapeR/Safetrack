import React from 'react';
import SafeZoneMap from '../Components/Maps/SafeZoneMap';
import Footer from '../Components/Footer/Footer';
import 'leaflet/dist/leaflet.css';
import './styles/safezones.css';

const SafeZones = () => {
  return (
    <div className="safezones-page">
      <div className="container">
        <h1 className="text-center mb-4">Safe Zones Map</h1>
        <div className="map-container">
          <SafeZoneMap />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SafeZones;
