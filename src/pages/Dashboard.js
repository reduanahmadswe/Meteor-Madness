import React, { Suspense } from 'react';
import { useAppContext } from '../context/AppContext';
import SimulationParameters from '../components/simulation/SimulationParameters';
import EarthVisualization from '../components/3d/EarthVisualization';
import PreliminaryResults from '../components/simulation/PreliminaryResults';
import PopulationImpact from '../components/simulation/PopulationImpact';
import EnvironmentalImpact from '../components/simulation/EnvironmentalImpact';
import './Dashboard.scss';

function Dashboard() {
  const { state, dispatch } = useAppContext();

  const handleRunSimulation = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call delay
    setTimeout(() => {
      const results = {
        energyReleased: 12.1,
        craterDiameter: 10.0,
        blastRadius: 243.2,
        tsunamiRisk: 'HIGH',
        populationAffected: 320000,
        directImpact: 85000,
        secondary: 150000,
        longTerm: 85000
      };
      
      dispatch({ type: 'SET_SIMULATION_RESULTS', payload: results });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 2000);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Left Sidebar - Simulation Parameters */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="simulation-status">
              <span className="status-indicator status-indicator--ready"></span>
              <span className="status-text">Simulation Ready</span>
            </div>
          </div>
          
          <SimulationParameters onRunSimulation={handleRunSimulation} />
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Earth Visualization */}
          <div className="visualization-panel">
            <div className="panel-header">
              <h3>Selected Impact Zone</h3>
              <span className="impact-zone-label">Ocean (Pacific)</span>
            </div>
            
            <div className="earth-container">
              <Suspense fallback={<div className="loading-spinner"></div>}>
                <EarthVisualization />
              </Suspense>
              
              {/* Asteroid Info Overlay */}
              <div className="asteroid-info">
                <div className="info-row">
                  <span className="info-label">Asteroid Size</span>
                  <span className="info-value">{state.simulationParams.diameter} m</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Velocity</span>
                  <span className="info-value">{state.simulationParams.velocity} km/s</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Entry Angle</span>
                  <span className="info-value">{state.simulationParams.angle}°</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Energy</span>
                  <span className="info-value energy-value">12.1 Mt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="results-section">
            <div className="results-grid">
              <PreliminaryResults />
              <PopulationImpact />
              <EnvironmentalImpact />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;