import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './InteractiveMap.scss';
import locations from '../../data/locations.json';
import asteroids from '../../data/asteroids.json';
import GlobeMap from '../RealMap/RealMap';

const InteractiveMap = () => {
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
      console.error('Search failed:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(customLocation);
    }, 300);
    return () => clearTimeout(timer);
  }, [customLocation, searchLocation]);

  // Calculate impact effects
  const impact = useMemo(() => {
    if (!selectedLocation || !selectedAsteroid) return null;

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

    return {
      blastRadius: blastRadius.toFixed(1),
      affectedPopulation: Math.round(affectedPopulation).toLocaleString(),
      casualties: Math.round(casualties).toLocaleString(),
      energy: energy.toLocaleString(),
      asteroidDiameter: asteroid.diameter_km
    };
  }, [selectedLocation, selectedAsteroid]);
  console.log(searchResults);

  return (
    <div className="interactive-map">
      {/* Sidebar */}
      <div className="map-controls">
        <div className="control-section">
          <h3>Select Location</h3>
          <select
            value={selectedLocation || ''}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Choose a location...</option>
            {Object.keys(locations).map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <div className="custom-search">
            <input
              type="text"
              placeholder="Or search for a place..."
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
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

        <div className="control-section">
          <h3>Select Asteroid</h3>
          <select
            value={selectedAsteroid || ''}
            onChange={(e) => setSelectedAsteroid(e.target.value)}
          >
            <option value="">Choose an asteroid...</option>
            {asteroids.map(asteroid => (
              <option key={asteroid.name} value={asteroid.name}>
                {asteroid.name} (Ø {asteroid.diameter_km} km)
              </option>
            ))}
          </select>
        </div>

        {impact && (
          <div className="impact-results">
            <h3>Impact Analysis</h3>
            <div className="impact-stat">
              <span className="label">Asteroid Diameter:</span>
              <span className="value">{impact.asteroidDiameter} km</span>
            </div>
            <div className="impact-stat">
              <span className="label">Impact Energy:</span>
              <span className="value">{impact.energy} Megatons</span>
            </div>
            <div className="impact-stat">
              <span className="label">Blast Radius:</span>
              <span className="value">{impact.blastRadius} km</span>
            </div>
            <div className="impact-stat">
              <span className="label">Affected Population:</span>
              <span className="value">{impact.affectedPopulation}</span>
            </div>
            <div className="impact-stat">
              <span className="label">Estimated Casualties:</span>
              <span className="value danger">{impact.casualties}</span>
            </div>
          </div>
        )}
      </div>

      {/* Globe Map */}
      <div className="map-container">
        <GlobeMap selectedLocation={selectedLocation} selectedAsteroid={selectedAsteroid} />

      </div>
    </div>
  );
};

export default InteractiveMap;
