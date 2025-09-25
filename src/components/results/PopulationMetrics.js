import React from 'react';
import './PopulationMetrics.scss';

function PopulationMetrics() {
  return (
    <div className="population-metrics">
      <div className="metric-header">
        <span className="metric-label">Population Affected</span>
      </div>
      <div className="metric-value">
        <span className="value-number">320</span>
        <span className="value-unit">K</span>
      </div>
      <div className="metric-progress">
        <div className="progress-bar">
          <div className="progress-fill progress-fill--orange" style={{ width: '60%' }}></div>
        </div>
        <span className="progress-label">Direct Impact Zone</span>
      </div>
    </div>
  );
}

export default PopulationMetrics;