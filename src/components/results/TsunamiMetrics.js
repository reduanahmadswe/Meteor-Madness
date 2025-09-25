import React from 'react';
import './TsunamiMetrics.scss';

function TsunamiMetrics() {
  return (
    <div className="tsunami-metrics">
      <div className="metric-header">
        <span className="metric-label">Tsunami Height</span>
      </div>
      <div className="metric-value">
        <span className="value-number">86.3</span>
        <span className="value-unit">m</span>
      </div>
      <div className="metric-progress">
        <div className="progress-bar">
          <div className="progress-fill progress-fill--blue" style={{ width: '90%' }}></div>
        </div>
        <span className="progress-label">Maximum Wave Height</span>
      </div>
    </div>
  );
}

export default TsunamiMetrics;