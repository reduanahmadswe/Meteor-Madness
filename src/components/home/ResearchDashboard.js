import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ResearchDashboard.scss';

function ResearchDashboard() {
  return (
    <div className="research-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Powerful Research <span className="text-gradient">Dashboard</span>
        </h2>
        <p className="dashboard-description">
          Access professional tools to simulate asteroid impacts with scientific accuracy. Analyze
          results and generate comprehensive reports.
        </p>
      </div>

      <div className="dashboard-grid">
        <motion.div 
          className="dashboard-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-icon card-icon--blue">
            <span>▶</span>
          </div>
          <h3>Run Simulation</h3>
          <p>Set asteroid parameters like size, velocity, angle, and impact location to run scientifically accurate simulations.</p>
          <Link to="/dashboard" className="card-action">
            Start Dashboard
            <span className="arrow">→</span>
          </Link>
        </motion.div>

        <motion.div 
          className="dashboard-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-icon card-icon--purple">
            <span>📊</span>
          </div>
          <h3>View Results</h3>
          <p>Explore detailed impact results including blast radius, energy released, and effective population loss scenarios.</p>
          <Link to="/results" className="card-action">
            See Results
            <span className="arrow">→</span>
          </Link>
        </motion.div>

        <motion.div 
          className="dashboard-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-icon card-icon--orange">
            <span>📥</span>
          </div>
          <h3>Download Report</h3>
          <p>Generate comprehensive reports with charts, graphs, and scientific data for research and educational purposes.</p>
          <button className="card-action">
            Generate Report
            <span className="arrow">→</span>
          </button>
        </motion.div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <div className="stat-number">12.1 Mt</div>
          <div className="stat-label">Energy Released</div>
          <div className="stat-bar stat-bar--blue"></div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">243.2 km</div>
          <div className="stat-label">Blast Radius</div>
          <div className="stat-bar stat-bar--purple"></div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">320K</div>
          <div className="stat-label">Population Affected</div>
          <div className="stat-bar stat-bar--orange"></div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">86.3 m</div>
          <div className="stat-label">Tsunami Height</div>
          <div className="stat-bar stat-bar--blue"></div>
        </div>
      </div>
    </div>
  );
}

export default ResearchDashboard;