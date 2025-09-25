import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './PreliminaryResults.scss';

function PreliminaryResults({ impactData }) {
  const { state } = useAppContext();
  const { isLoading } = state;

  if (isLoading) {
    return (
      <div className="preliminary-results preliminary-results--loading">
        <h3>Preliminary Results</h3>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Calculating impact parameters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preliminary-results">
      <h3>Preliminary Results</h3>
      
      <div className="results-list">
        <div className="result-item">
          <span className="result-label">Asteroid Diameter:</span>
          <span className="result-value">
            {impactData ? impactData.asteroidDiameter : '2.5'} km
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Impact Energy:</span>
          <span className="result-value result-value--energy">
            {impactData ? impactData.energy : '12,100'} Megatons
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Blast Radius:</span>
          <span className="result-value result-value--blast">
            {impactData ? impactData.blastRadius : '243.2'} km
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Affected Population:</span>
          <span className="result-value">
            {impactData ? impactData.affectedPopulation : '2,500,000'}
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Estimated Casualties:</span>
          <span className="result-value result-value--tsunami">
            {impactData ? impactData.casualties : '250,000'}
          </span>
        </div>
      </div>

      <button className="download-report-btn">
        <span className="btn-icon">📥</span>
        Download Full Report
      </button>
    </div>
  );
}

export default PreliminaryResults;