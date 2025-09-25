import React, { Suspense, useState, useMemo, useCallback } from 'react';
import locationsData from '../data/locations.json';
import asteroidsData from '../data/asteroids.json';
import PreliminaryResults from '../components/simulation/PreliminaryResults';
import PopulationImpact from '../components/simulation/PopulationImpact';
import EnvironmentalImpact from '../components/simulation/EnvironmentalImpact';
import './Dashboard.scss';
import RealMap from '../components/RealMap/RealMap';

function Dashboard() {
  // Local state for location and asteroid selection
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [customLocation, setCustomLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search location using OpenStreetMap Nominatim
  const searchLocation = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
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

  // Impact calculation logic (from InteractiveMap.js)
  const impactData = useMemo(() => {
    if (!selectedLocation || !selectedAsteroid) return null;
    const locations = locationsData;
    const asteroids = asteroidsData;
    const location = locations[selectedLocation] || selectedLocation;
    const asteroid = asteroids.find(a => a.name === selectedAsteroid);
    if (!asteroid || !location) return null;
    const population = location.population || 0;
    const density = location.density || 0;
    const energy = asteroid.impact_energy_mt;
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
      energy: energy.toLocaleString(),
      asteroidDiameter: asteroid.diameter_km,
      populationBreakdown: {
        directImpact,
        secondary,
        longTerm,
        totalAffected
      }
    };
  }, [selectedLocation, selectedAsteroid]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="simulation-status">
              <span className="status-indicator status-indicator--ready"></span>
              <span className="status-text">Simulation Ready</span>
            </div>
          </div>
          {/* Location Selection */}
          <div className="control-section">
            <h3>Select Location</h3>
            <select
              value={selectedLocation || ''}
              onChange={e => setSelectedLocation(e.target.value)}
            >
              <option value="">Choose a location...</option>
              {Object.keys(locationsData).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <div className="custom-search">
              <input
                type="text"
                placeholder="Or search for a place..."
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
              />
              {isSearching && <div className="searching">Searching...</div>}
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result"
                      onClick={() => {
                        setSelectedLocation({
                          name: result.display_name,
                          centroid: {
                            lat: parseFloat(result.lat),
                            lon: parseFloat(result.lon)
                          },
                          population: 1000000,
                          density: 1000,
                          type: 'custom'
                        });
                        setCustomLocation('');
                        setSearchResults([]);
                      }}
                    >
                      {result.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Asteroid Selection */}
          <div className="control-section">
            <h3>Select Asteroid</h3>
            <select
              value={selectedAsteroid || ''}
              onChange={e => setSelectedAsteroid(e.target.value)}
            >
              <option value="">Choose an asteroid...</option>
              {asteroidsData.map(asteroid => (
                <option key={asteroid.name} value={asteroid.name}>
                  {asteroid.name} (Ø {asteroid.diameter_km} km)
                </option>
              ))}
            </select>
          </div>
          
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