import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './InteractiveMap.scss';
import locations from '../../data/locations.json';
import asteroids from '../../data/asteroids.json';

const InteractiveMap = () => {
  const canvasRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [customLocation, setCustomLocation] = useState('');
  const [impactRadius, setImpactRadius] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Convert lat/lon to canvas coordinates
  const latLonToCanvas = (lat, lon, canvasWidth, canvasHeight) => {
    const x = ((lon + 180) * canvasWidth) / 360;
    const y = ((90 - lat) * canvasHeight) / 180;
    return { x, y };
  };

  // Draw world map outline
  const drawWorldMap = useCallback((ctx, width, height) => {
    const drawContinents = (ctx, width, height) => {
      // Simplified continent shapes
      const continents = [
        // North America
        { 
          coords: [
            [-140, 70], [-100, 70], [-80, 45], [-75, 30], [-90, 25], 
            [-100, 30], [-120, 35], [-140, 50], [-140, 70]
          ]
        },
        // South America
        {
          coords: [
            [-80, 10], [-70, -10], [-60, -20], [-65, -35], [-70, -50], 
            [-75, -40], [-85, -20], [-90, 0], [-80, 10]
          ]
        },
        // Africa
        {
          coords: [
            [-20, 35], [50, 35], [45, -35], [20, -35], [15, 5], 
            [0, 15], [-20, 35]
          ]
        },
        // Europe/Asia
        {
          coords: [
            [-10, 70], [180, 70], [140, 40], [120, 20], [100, 10], 
            [70, 35], [40, 45], [20, 60], [-10, 70]
          ]
        },
        // Australia
        {
          coords: [
            [110, -10], [155, -10], [155, -45], [110, -35], [110, -10]
          ]
        }
      ];

      continents.forEach(continent => {
        ctx.beginPath();
        continent.coords.forEach((coord, index) => {
          const { x, y } = latLonToCanvas(coord[1], coord[0], width, height);
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    };

    const drawGrid = (ctx, width, height) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      // Latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        const { y } = latLonToCanvas(lat, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Longitude lines
      for (let lon = -180; lon <= 180; lon += 30) {
        const { x } = latLonToCanvas(0, lon, width, height);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    };

    ctx.clearRect(0, 0, width, height);
    
    // Ocean background
    ctx.fillStyle = '#0a1a2a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw simple continent outlines
    ctx.strokeStyle = '#2d5aa0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#1a4c75';
    
    // Draw simplified world map
    drawContinents(ctx, width, height);
    
    // Draw grid lines
    drawGrid(ctx, width, height);
  }, []);

  // Draw markers
  const drawMarkers = useCallback((ctx, width, height) => {
    // Draw location marker
    if (selectedLocation) {
      const location = locations[selectedLocation] || selectedLocation;
      const { lat, lon } = location.centroid || location;
      const { x, y } = latLonToCanvas(lat, lon, width, height);
      
      // Location marker
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw impact radius
    if (selectedLocation && selectedAsteroid && impactRadius > 0) {
      const location = locations[selectedLocation] || selectedLocation;
      const { lat, lon } = location.centroid || location;
      const { x, y } = latLonToCanvas(lat, lon, width, height);
      
      // Convert impact radius from km to canvas pixels (rough approximation)
      const pixelRadius = (impactRadius / 111) * (width / 360);
      
      ctx.strokeStyle = '#ff0000';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pixelRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }, [selectedLocation, selectedAsteroid, impactRadius]);

  // Search location using Nominatim API
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

  // Calculate impact effects and update impact radius
  const impact = useMemo(() => {
    if (!selectedLocation || !selectedAsteroid) {
      setImpactRadius(0);
      return null;
    }
    
    const location = locations[selectedLocation] || selectedLocation;
    const asteroid = asteroids.find(a => a.name === selectedAsteroid);
    
    if (!asteroid || !location) {
      setImpactRadius(0);
      return null;
    }
    
    const population = location.population || 0;
    const density = location.density || 0;
    const energy = asteroid.impact_energy_mt;
    
    // Calculate blast radius (simplified formula)
    const blastRadius = Math.pow(energy, 1/3) * 2.5; // km
    setImpactRadius(blastRadius);
    
    // Calculate casualties (very simplified)
    const affectedArea = Math.PI * blastRadius * blastRadius; // km²
    const affectedPopulation = Math.min(population, affectedArea * density);
    const casualties = affectedPopulation * 0.1; // 10% casualty rate
    
    return {
      blastRadius: blastRadius.toFixed(1),
      affectedPopulation: Math.round(affectedPopulation).toLocaleString(),
      casualties: Math.round(casualties).toLocaleString(),
      energy: energy.toLocaleString(),
      asteroidDiameter: asteroid.diameter_km
    };
  }, [selectedLocation, selectedAsteroid]);

  // Update canvas when selections change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    drawWorldMap(ctx, width, height);
    drawMarkers(ctx, width, height);
  }, [selectedLocation, selectedAsteroid, impactRadius, drawWorldMap, drawMarkers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(customLocation);
    }, 300);
    return () => clearTimeout(timer);
  }, [customLocation, searchLocation]);

  return (
    <div className="interactive-map">
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
                        population: 1000000, // Default for searched locations
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
                {asteroid.name} (Ø {asteroid.diameter_km}km)
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
      
      <div className="map-container">
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="world-map"
        />
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-marker location"></div>
            <span>Selected Location</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker impact"></div>
            <span>Impact Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;