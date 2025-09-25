import React from 'react';
import InteractiveMap from '../components/simulation/InteractiveMap';
import './MapSimulation.scss';

function MapSimulation() {
  return (
    <div className="map-simulation">
      <div className="map-simulation-header">
        <div className="header-content">
          <h1>Impact Simulation Map</h1>
          <p>Select a location and asteroid to analyze potential impact effects</p>
        </div>
      </div>

      <div className="map-simulation-content">
        
        <InteractiveMap />
      </div>
    </div>
  );
}

export default MapSimulation;