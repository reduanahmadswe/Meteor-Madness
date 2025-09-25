import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './ThreatIndicator.scss';

function ThreatIndicator() {
  const { state } = useAppContext();
  const { threatLevel } = state;

  const getThreatColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ff6b35';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getThreatDescription = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'Minimal impact risk from known NEOs';
      case 'medium':
        return 'Moderate asteroid activity detected';
      case 'high':
        return 'Potentially hazardous objects nearby';
      case 'critical':
        return 'Immediate threat assessment required';
      default:
        return 'Threat level assessment in progress';
    }
  };

  return (
    <div className="threat-indicator">
      <div className="threat-header">
        <h3>NEO Threat Level</h3>
        <div className="threat-status">
          <div 
            className="threat-dot"
            style={{ 
              backgroundColor: getThreatColor(threatLevel),
              boxShadow: `0 0 15px ${getThreatColor(threatLevel)}50`
            }}
          ></div>
          <span 
            className="threat-level"
            style={{ color: getThreatColor(threatLevel) }}
          >
            {threatLevel}
          </span>
        </div>
      </div>
      
      <p className="threat-description">
        {getThreatDescription(threatLevel)}
      </p>
      
      <div className="threat-metrics">
        <div className="metric">
          <span className="metric-label">Active NEOs</span>
          <span className="metric-value">2,847</span>
        </div>
        <div className="metric">
          <span className="metric-label">Tracked Objects</span>
          <span className="metric-value">31,015</span>
        </div>
        <div className="metric">
          <span className="metric-label">Close Approaches</span>
          <span className="metric-value">12</span>
        </div>
      </div>
      
      <div className="threat-progress">
        <div className="progress-label">
          <span>Risk Assessment</span>
          <span>Updated 2 min ago</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: threatLevel === 'Low' ? '25%' : 
                     threatLevel === 'Medium' ? '50%' : 
                     threatLevel === 'High' ? '75%' : '90%',
              backgroundColor: getThreatColor(threatLevel)
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ThreatIndicator;