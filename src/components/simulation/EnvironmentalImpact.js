import React from 'react';
import './EnvironmentalImpact.scss';

function EnvironmentalImpact({ impactData, simulationParams, selectedLocation }) {
  // Calculate environmental impacts based on asteroid parameters
  const calculateEnvironmentalImpacts = () => {
    if (!impactData || !simulationParams) {
      return [
        { label: 'Atmospheric Dust', level: 'Low', severity: 'low', progress: 20 },
        { label: 'Temperature Change', level: 'Low', severity: 'low', progress: 15 },
        { label: 'Tsunami Height', level: 'Low', severity: 'low', progress: 10 },
        { label: 'Long-term Effects', level: 'Low', severity: 'low', progress: 25 }
      ];
    }

    const diameter = simulationParams.diameter; // meters
    const velocity = simulationParams.velocity; // km/s
    const energy = impactData.energy; // megatons
    // Handle both string locations and search result objects
    const getLocationString = (location) => {
      if (!location) return '';
      if (typeof location === 'string') return location;
      if (location.display_name) return location.display_name;
      if (location.name) return location.name;
      return '';
    };
    
    const locationString = getLocationString(selectedLocation);
    const isOceanImpact = locationString.toLowerCase().includes('ocean') || locationString.toLowerCase().includes('sea');

    // Atmospheric Dust - based on diameter and velocity
    const dustFactor = (diameter / 1000) * velocity; // km * km/s
    let dustLevel, dustProgress, dustSeverity;
    if (dustFactor < 5) {
      dustLevel = 'Low'; dustProgress = 25; dustSeverity = 'low';
    } else if (dustFactor < 15) {
      dustLevel = 'Medium'; dustProgress = 55; dustSeverity = 'medium';
    } else if (dustFactor < 30) {
      dustLevel = 'High'; dustProgress = 80; dustSeverity = 'high';
    } else {
      dustLevel = 'Extreme'; dustProgress = 95; dustSeverity = 'critical';
    }

    // Temperature Change - based on impact energy
    let tempLevel, tempProgress, tempSeverity;
    if (energy < 1) {
      tempLevel = 'Minimal'; tempProgress = 15; tempSeverity = 'low';
    } else if (energy < 10) {
      tempLevel = 'Low'; tempProgress = 35; tempSeverity = 'low';
    } else if (energy < 100) {
      tempLevel = 'Medium'; tempProgress = 60; tempSeverity = 'medium';
    } else if (energy < 1000) {
      tempLevel = 'High'; tempProgress = 80; tempSeverity = 'high';
    } else {
      tempLevel = 'Catastrophic'; tempProgress = 95; tempSeverity = 'critical';
    }

    // Tsunami Height - higher for ocean impacts
    let tsunamiLevel, tsunamiProgress, tsunamiSeverity;
    if (isOceanImpact) {
      const tsunamiFactor = Math.sqrt(energy) * (diameter / 1000);
      if (tsunamiFactor < 2) {
        tsunamiLevel = 'Low'; tsunamiProgress = 30; tsunamiSeverity = 'medium';
      } else if (tsunamiFactor < 5) {
        tsunamiLevel = 'High'; tsunamiProgress = 70; tsunamiSeverity = 'high';
      } else {
        tsunamiLevel = 'Extreme'; tsunamiProgress = 95; tsunamiSeverity = 'critical';
      }
    } else {
      // Land impact - minimal tsunami
      tsunamiLevel = 'None'; tsunamiProgress = 5; tsunamiSeverity = 'low';
    }

    // Long-term Effects - combination of all factors
    const overallSeverity = (dustProgress + tempProgress + tsunamiProgress) / 3;
    let longTermLevel, longTermProgress, longTermSeverity;
    if (overallSeverity < 30) {
      longTermLevel = 'Minimal'; longTermProgress = 20; longTermSeverity = 'low';
    } else if (overallSeverity < 50) {
      longTermLevel = 'Moderate'; longTermProgress = 45; longTermSeverity = 'medium';
    } else if (overallSeverity < 75) {
      longTermLevel = 'Severe'; longTermProgress = 70; longTermSeverity = 'high';
    } else {
      longTermLevel = 'Catastrophic'; longTermProgress = 90; longTermSeverity = 'critical';
    }

    return [
      { label: 'Atmospheric Dust', level: dustLevel, severity: dustSeverity, progress: dustProgress },
      { label: 'Temperature Change', level: tempLevel, severity: tempSeverity, progress: tempProgress },
      { label: 'Tsunami Height', level: tsunamiLevel, severity: tsunamiSeverity, progress: tsunamiProgress },
      { label: 'Long-term Effects', level: longTermLevel, severity: longTermSeverity, progress: longTermProgress }
    ];
  };

  const impacts = calculateEnvironmentalImpacts();

  return (
    <div className="environmental-impact">
      <div className="impact-header">
        <div className="header-icon">🌍</div>
        <h3>Environmental Impact</h3>
      </div>

      <div className="impacts-list">
        {impacts.map((impact, index) => (
          <div key={index} className="impact-item">
            <div className="impact-info">
              <span className="impact-label">{impact.label}</span>
              <span className={`impact-level impact-level--${impact.severity}`}>
                {impact.level}
              </span>
            </div>
            <div className="impact-progress">
              <div className="progress-bar">
                <div 
                  className={`progress-fill progress-fill--${impact.severity}`}
                  style={{ width: `${impact.progress}%` }}
                ></div>
              </div>
              <span className="progress-value">{impact.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnvironmentalImpact;