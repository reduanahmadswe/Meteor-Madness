import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './PopulationImpact.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

function PopulationImpact() {
  const data = {
    labels: ['Direct Impact (25%)', 'Secondary (47%)', 'Long-term Effects (28%)'],
    datasets: [
      {
        data: [85000, 150000, 85000],
        backgroundColor: [
          '#ff6b35',
          '#00d4ff', 
          '#8b5cf6'
        ],
        borderColor: [
          '#ff6b35',
          '#00d4ff',
          '#8b5cf6'
        ],
        borderWidth: 2,
        cutout: '60%'
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
            return `${context.label}: ${context.parsed.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="population-impact">
      <div className="impact-header">
        <div className="header-icon">👥</div>
        <h3>Population Impact</h3>
      </div>

      <div className="impact-chart">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div className="chart-center">
            <div className="total-affected">320K</div>
            <div className="total-label">Affected</div>
          </div>
        </div>

        <div className="impact-legend">
          <div className="legend-item">
            <div className="legend-color legend-color--orange"></div>
            <span className="legend-label">Direct Impact</span>
            <span className="legend-value">85K</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--blue"></div>
            <span className="legend-label">Secondary</span>
            <span className="legend-value">150K</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-color--purple"></div>
            <span className="legend-label">Long-term</span>
            <span className="legend-value">85K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopulationImpact;