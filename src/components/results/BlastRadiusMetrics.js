import React from 'react';
import './BlastRadiusMetrics.scss';

function BlastRadiusMetrics() {
  return (
    <div className="blast-radius-metrics">
      <div className="metric-header">
        <span className="metric-label">Blast Radius</span>
      </div>
      <div className="metric-value">
        <span className="value-number">243.2</span>
        <span className="value-unit">km</span>
      </div>
      <div className="metric-progress">
        <div className="progress-bar">
          <div className="progress-fill progress-fill--purple" style={{ width: '80%' }}></div>
        </div>
        <span className="progress-label">Damage Zone</span>
      </div>
    </div>
  );
}

export default BlastRadiusMetrics;