import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './PreliminaryResults.scss';

function PreliminaryResults() {
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
          <span className="result-label">Energy Released:</span>
          <span className="result-value result-value--energy">12.1 Mt</span>
          <span className="result-unit">TNT</span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Crater Diameter:</span>
          <span className="result-value">10.0 km</span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Blast Radius:</span>
          <span className="result-value result-value--blast">243.2 km</span>
          <span className="result-unit">Tsunami Risk:</span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Tsunami Height:</span>
          <span className="result-value result-value--tsunami">HIGH</span>
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