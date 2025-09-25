import React, { Suspense, useState, useMemo, useCallback } from 'react';
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
  const [customLocation, setCustomLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Simulation state
  const [simulationTrigger, setSimulationTrigger] = useState(0);
  
  // Simulation parameters from SimulationParameters component
  const [simulationParams, setSimulationParams] = useState({
    diameter: 250, // meters
    velocity: 19.3, // km/s
    entryAngle: 45, // degrees
    impactLocation: 'Ocean (Pacific)',
    selectedAsteroid: null
  });

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
  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(customLocation);
    }, 300);
    return () => clearTimeout(timer);
  }, [customLocation, searchLocation]);

  // Enhanced impact calculation using both asteroid data and simulation parameters
  const impactData = useMemo(() => {
    const location = locationsData[selectedLocation] || selectedLocation;
    const asteroid = simulationParams.selectedAsteroid;
    
    if (!location || !asteroid) return null;
    
    const population = location.population || 0;
    const density = location.density || 0;
    
    // Calculate energy based on diameter, velocity, and entry angle
    const diameterKm = simulationParams.diameter / 1000; // Convert meters to km
    const velocityKmS = simulationParams.velocity;
    const angleRadians = (simulationParams.entryAngle * Math.PI) / 180;
    
    // Enhanced energy calculation considering velocity and angle
    const mass = (4/3) * Math.PI * Math.pow(diameterKm/2, 3) * 2600; // kg (assuming rocky density)
    const kineticEnergy = 0.5 * mass * Math.pow(velocityKmS * 1000, 2); // Joules
    const angleEfficiency = Math.sin(angleRadians); // Steeper angles are more efficient
    const energy = (kineticEnergy * angleEfficiency) / (4.184e15); // Convert to megatons TNT
    
    const blastRadius = Math.pow(energy, 1 / 3) * 2.5; // km
    const affectedArea = Math.PI * blastRadius * blastRadius; // km²
    const affectedPopulation = Math.min(population, affectedArea * density);
    const casualties = affectedPopulation * 0.1;
    
    // Population impact breakdown
    const directImpact = Math.round(affectedPopulation * 0.25); // 25% direct impact
    const secondary = Math.round(affectedPopulation * 0.47); // 47% secondary effects  
    const longTerm = Math.round(affectedPopulation * 0.28); // 28% long-term effects
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

  // Memoized callback function to prevent infinite re-renders
  const handleRunSimulation = useCallback((params) => {
    console.log('Running simulation with parameters:', params);
    setSimulationParams(params);
    setSelectedAsteroid(params.selectedAsteroid?.name);
    setSelectedLocation(params.impactLocation);
    setSimulationTrigger(prev => prev + 1); // Trigger meteor animation
  }, []);

  // Handle location change from dropdown or search
  const handleLocationChange = useCallback((location) => {
    setSelectedLocation(location);
    // Update map position without triggering meteor animation
    // This will be handled in RealMap component
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
         
          
          {/* Simulation Parameters */}
          <SimulationParameters 
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
              <span className="impact-zone-label">Ocean (Pacific)</span>
            </div>
            <div className="earth-container">
              <Suspense fallback={<div className="loading-spinner"></div>}>
                <RealMap
                  selectedLocation={selectedLocation}
                  selectedAsteroid={selectedAsteroid}
                  simulationTrigger={simulationTrigger}
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
              <EnvironmentalImpact />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;