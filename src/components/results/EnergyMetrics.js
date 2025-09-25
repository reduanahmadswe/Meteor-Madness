import React from 'react';
import './EnergyMetrics.scss';

function EnergyMetrics() {
  return (
    <div className="energy-metrics">
      <div className="metric-header">
        <span className="metric-label">Energy Released</span>
      </div>
      <div className="metric-value">
        <span className="value-number">12.1</span>
        <span className="value-unit">Mt</span>
      </div>
      <div className="metric-progress">
        <div className="progress-bar">
          <div className="progress-fill progress-fill--blue" style={{ width: '75%' }}></div>
        </div>
        <span className="progress-label">TNT Equivalent</span>
      </div>
    </div>
  );
}

export default EnergyMetrics;