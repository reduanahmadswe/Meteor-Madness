import React from 'react';
import './EnvironmentalImpact.scss';

function EnvironmentalImpact() {
  const impacts = [
    {
      label: 'Atmospheric Dust',
      level: 'High',
      severity: 'high',
      progress: 85
    },
    {
      label: 'Temperature Change',
      level: 'Medium',
      severity: 'medium',
      progress: 60
    },
    {
      label: 'Tsunami Height',
      level: 'Very High',
      severity: 'critical',
      progress: 95
    },
    {
      label: 'Long-term Effects',
      level: 'Medium',
      severity: 'medium',
      progress: 55
    }
  ];

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