import React, { Suspense, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import locationsData from '../data/locations.json';
import PreliminaryResults from '../components/simulation/PreliminaryResults';
import PopulationImpact from '../components/simulation/PopulationImpact';
import EnvironmentalImpact from '../components/simulation/EnvironmentalImpact';
import SimulationParameters from '../components/simulation/SimulationParameters';
import './Dashboard.scss';
import RealMap from '../components/RealMap/RealMap';

function Dashboard() {
  // Local state for location and asteroid selection
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulation state
  const [simulationTrigger, setSimulationTrigger] = useState(0);

  // Simulation parameters
  const [simulationParams, setSimulationParams] = useState({
    diameter: 250, // meters
    velocity: 19.3, // km/s
    entryAngle: 45, // degrees
    impactLocation: 'Ocean (Pacific)',
    selectedAsteroid: null
  });

  // Helper function to get display name for selected location
  const getLocationDisplayName = (location) => {
    if (!location) return 'No Location Selected';

    if (typeof location === 'string') {
      return location;
    }

    if (location.display_name) {
      const parts = location.display_name.split(',');
      if (parts.length >= 2) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
      }
      return parts[0].trim();
    }

    if (location.name) {
      return location.name;
    }

    return 'Unknown Location';
  };

  // Search location using OpenStreetMap Nominatim
  const searchLocation = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    }
    setIsSearching(false);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchLocation]);

  // Enhanced impact calculation
  const impactData = useMemo(() => {
    const location = locationsData[selectedLocation] || selectedLocation;
    if (!location) return null;

    const population = location.population || (location.type === 'ocean' ? 50000 : 100000);
    const density = location.density || (location.type === 'ocean' ? 100 : 500);

    const diameterKm = simulationParams.diameter / 1000;
    const velocityKmS = simulationParams.velocity;
    const angleRadians = (simulationParams.entryAngle * Math.PI) / 180;

    const radius = diameterKm / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * 2.6e12;
    const velocityMs = velocityKmS * 1000;
    const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
    const angleEfficiency = Math.sin(angleRadians) || 0.1;
    const energy = (kineticEnergy * angleEfficiency) / (4.184e15);

    const blastRadius = Math.pow(energy / 0.001, 1 / 3) * 0.5;
    const affectedArea = Math.PI * Math.pow(blastRadius, 2);
    const affectedPopulation = Math.min(population, affectedArea * density);
    const casualties = affectedPopulation * 0.15;

    const directImpact = Math.round(affectedPopulation * 0.25);
    const secondary = Math.round(affectedPopulation * 0.47);
    const longTerm = Math.round(affectedPopulation * 0.28);
    const totalAffected = directImpact + secondary + longTerm;

    return {
      blastRadius: blastRadius.toFixed(1),
      affectedPopulation: Math.round(affectedPopulation).toLocaleString(),
      casualties: Math.round(casualties).toLocaleString(),
      energy: energy.toFixed(0),
      asteroidDiameter: diameterKm.toFixed(2),
      simulationParams: {
        diameter: simulationParams.diameter,
        velocity: simulationParams.velocity,
        entryAngle: simulationParams.entryAngle
      },
      populationBreakdown: {
        directImpact,
        secondary,
        longTerm,
        totalAffected
      }
    };
  }, [selectedLocation, simulationParams]);

  // Run simulation
  const handleRunSimulation = useCallback((params) => {
    console.log('Running simulation with parameters:', params);
    setSimulationParams(params);
    setSelectedAsteroid(params.selectedAsteroid?.name);
    setSelectedLocation(params.impactLocation);
    setSimulationTrigger(prev => prev + 1); // trigger animation
  }, []);

  // Change location
  const handleLocationChange = useCallback((location) => {
    console.log('Dashboard: Setting selected location to:', location);
    setSelectedLocation(location);
  }, []);
  const handleReset = useCallback(() => {
    console.log("Reset simulation");

    setSimulationTrigger(prev => prev + 1); // triggers RealMap reset & animation

    setSelectedLocation(null);
    setSelectedAsteroid(null);
    setSimulationParams({
      diameter: 250,
      velocity: 19.3,
      entryAngle: 45,
      impactLocation: 'Ocean (Pacific)',
      selectedAsteroid: null
    });
  }, []);




  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <SimulationParameters
            handleReset={handleReset}
            onRunSimulation={handleRunSimulation}
            onLocationChange={handleLocationChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchLoading={isSearching}
            searchResults={searchResults}
          />
        </aside>

        <main className="dashboard-main">
          <div className="visualization-panel">
            <div className="panel-header">
              <h3>Selected Impact Zone</h3>
              <span className="impact-zone-label">
                {getLocationDisplayName(selectedLocation)}
              </span>
            </div>
            <div className="earth-container">
              <Suspense fallback={<div className="loading-spinner"></div>}>
                <RealMap
                  handleReset={handleReset} // optional, can remove
                  selectedLocation={selectedLocation}
                  selectedAsteroid={selectedAsteroid}
                  simulationTrigger={simulationTrigger} // used for meteor animation
                  resetTrigger={simulationTrigger}      // pass the same trigger for reset
                  simulationParams={simulationParams}
                  zoom={0.5}
                  center={{ lat: 0, lng: 0 }}
                />

              </Suspense>
            </div>
          </div>

          <div className="results-section">
            <div className="results-grid">
              <PreliminaryResults impactData={impactData} />
              <PopulationImpact impactData={impactData} />
              <EnvironmentalImpact
                impactData={impactData}
                simulationParams={simulationParams}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>
        </main>
      </div>

      <footer className="story-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="logo-icon">
              <span className="logo-text">IE</span>
            </div>
            <span className="logo-title">Impact Explorer 2025</span>
            <p className="footer-description">
              Simulating asteroid impacts on Earth using real NASA data for research and education.
            </p>
          </div>

          <div className="footer-nav">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/story">Story Mode</a></li>
              <li><a href="/dashboard">Simulation Dashboard</a></li>
              <li><a href="/results">Impact Results</a></li>
            </ul>
          </div>

          <div className="footer-sources">
            <h4>Data Sources</h4>
            <ul>
              <li><a href="https://cneos.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA CNEOS</a></li>
              <li><a href="https://ssd.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">JPL Small-Body Database</a></li>
              <li><a href="https://neo.ssa.esa.int/" target="_blank" rel="noopener noreferrer">NASA NEO Program</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Impact Explorer 2025. All rights reserved.</p>
          <p>Powered by NASA data. This is a simulation tool for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
