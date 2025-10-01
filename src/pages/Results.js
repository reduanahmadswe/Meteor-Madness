import React, { Suspense } from 'react';
import ImpactAnalysis from '../components/results/ImpactAnalysis';
import ImpactDistribution from '../components/results/ImpactDistribution';
import EnergyMetrics from '../components/results/EnergyMetrics';
import PopulationMetrics from '../components/results/PopulationMetrics';
import TsunamiMetrics from '../components/results/TsunamiMetrics';
import BlastRadiusMetrics from '../components/results/BlastRadiusMetrics';
import EarthVisualization from '../components/3d/EarthVisualization';
import './Results.scss';

function Results() {
  return (
    <div className="results">
      {/* Header Section */}
      <section className="results-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="results-title">Impact Results</h1>
              <p className="results-subtitle">
                Detailed impact simulation results for a 250m object at 19.3 km/s
              </p>

              <div className="impact-location">
                <span className="location-label">Impact Location:</span>
                <span className="location-value">Asteroid Ocean at FL 69,047 W</span>
              </div>

              <div className="action-buttons">
                <button className="btn btn--primary">
                  📥 New Simulation
                </button>
                <button className="btn btn--secondary">
                  📊 Download Report
                </button>
              </div>
            </div>

            <div className="header-visual">
              <Suspense fallback={<div className="loading-spinner"></div>}>
                <EarthVisualization />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Main Metrics Section */}
      <section className="metrics-section">
        <div className="container">
          <div className="metrics-grid">
            <EnergyMetrics />
            <BlastRadiusMetrics />
            <PopulationMetrics />
            <TsunamiMetrics />
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="analysis-section">
        <div className="container">
          <div className="analysis-grid">
            <ImpactAnalysis />
            <ImpactDistribution />
          </div>
        </div>
      </section>

      {/* Ready for New Simulation */}
      <section className="new-simulation">
        <div className="container">
          <div className="simulation-prompt">
            <h2>Ready to Run Another Simulation?</h2>
            <p>
              Customize asteroid parameters, impact location and more to see different scenarios and
              outcomes.
            </p>
            <button className="btn btn--primary btn--large">
              New Simulation →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="results-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">
                <span className="logo-text">IE</span>
              </div>
              <span className="logo-title">Impact Explorer 2025</span>
              <p className="footer-description">
                Simulating asteroid impacts on Earth using
                real NASA data for research and
                education.
              </p>
            </div>

            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/story">Story Mode</a></li>
                <li><a href="/dashboard">Simulation Dashboard</a></li>
                <li><a href="/results">Impact Results</a></li>
              </ul>
            </div>

            <div className="footer-sources">
              <h4>Data Sources</h4>
              <ul>
                <li><a href="https://cneos.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA CNEOS</a></li>
                <li><a href="https://ssd.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">JPL Small-Body Database</a></li>
                <li><a href="https://neo.ssa.esa.int/" target="_blank" rel="noopener noreferrer">NASA NEO Program</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Impact Explorer 2025. All rights reserved.</p>
            <p>Powered by NASA data. This is a simulation tool for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Results;