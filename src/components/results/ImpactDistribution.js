import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './ImpactDistribution.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

function ImpactDistribution() {
  const data = {
    labels: ['Direct Impact (23%)', 'Tsunami (29%)', 'Seismic Effects (26%)', 'Other Effects (22%)'],
    datasets: [
      {
        data: [23, 29, 26, 22],
        backgroundColor: [
          '#ff6b35',
          '#00d4ff', 
          '#8b5cf6',
          '#22c55e'
        ],
        borderColor: [
          '#ff6b35',
          '#00d4ff',
          '#8b5cf6',
          '#22c55e'
        ],
        borderWidth: 2,
        cutout: '65%'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div className="impact-distribution">
      <div className="distribution-header">
        <div className="header-icon">📊</div>
        <h3>Impact Distribution</h3>
        <select className="distribution-filter" defaultValue="Population">
          <option>Population</option>
          <option>Economic</option>
          <option>Environmental</option>
        </select>
      </div>

      <div className="distribution-content">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
        </div>

        <div className="distribution-legend">
          <div className="legend-item">
            <div className="legend-color legend-color--orange"></div>
            <div className="legend-info">
              <span className="legend-label">Direct Impact (23%)</span>
              <span className="legend-description">Immediate blast effects</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--blue"></div>
            <div className="legend-info">
              <span className="legend-label">Tsunami (29%)</span>
              <span className="legend-description">Coastal wave damage</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--purple"></div>
            <div className="legend-info">
              <span className="legend-label">Seismic Effects (26%)</span>
              <span className="legend-description">Earthquake-like damage</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--green"></div>
            <div className="legend-info">
              <span className="legend-label">Other Effects (22%)</span>
              <span className="legend-description">Secondary impacts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactDistribution;