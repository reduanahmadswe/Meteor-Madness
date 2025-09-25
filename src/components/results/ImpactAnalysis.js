import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ImpactAnalysis.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ImpactAnalysis() {
  const data = {
    labels: ['0 sec', '10 sec', '30 sec', '60 sec', '2 min', '5 min', '10 min'],
    datasets: [
      {
        label: 'Energy Distribution',
        data: [0, 15, 45, 75, 85, 92, 95],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Population Effects',
        data: [0, 25, 55, 70, 80, 85, 90],
        borderColor: '#ff6b35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ff6b35',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="impact-analysis">
      <div className="analysis-header">
        <div className="header-icon">📈</div>
        <h3>Impact Analysis</h3>
        <select className="analysis-filter" defaultValue="Energy Distribution">
          <option>Energy Distribution</option>
          <option>Seismic Effects</option>
          <option>Atmospheric Impact</option>
        </select>
      </div>

      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default ImpactAnalysis;