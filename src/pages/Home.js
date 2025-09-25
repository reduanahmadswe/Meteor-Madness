import React, { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import StoryModePreview from '../components/home/StoryModePreview';
import ResearchDashboard from '../components/home/ResearchDashboard';
import TrailerModal from '../components/home/TrailerModal';
import './Home.scss';
// Add cinematic background
import CinematicBackground from '../components/3d/CinematicBackground';

function Home() {
  const { dispatch } = useAppContext();
  const [isTrailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    // Simulate NEO threat level calculation
    const threatLevels = ['Low', 'Medium', 'High', 'Critical'];
    const randomThreat = threatLevels[Math.floor(Math.random() * threatLevels.length)];
    dispatch({ type: 'SET_THREAT_LEVEL', payload: randomThreat });
  }, [dispatch]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* Background Canvas */}
        <CinematicBackground />
        <div className="hero-content">
          <div className="hero-text">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Impact Explorer
              <span className="hero-year">2025</span>
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Simulate asteroid impacts on Earth using real NASA data. Visualize
              trajectories, analyze impact zones, and explore the science behind
              planetary defense.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/dashboard" className="btn btn--primary btn--large">
                Explore the Impact
              </Link>
              <button
                type="button"
                className="btn btn--secondary btn--large"
                onClick={() => setTrailerOpen(true)}
              >
                <span>▶</span>
                Watch Trailer
              </button>
            </motion.div>
          </div>
          
          {/* Replace boxed visualization with transparent spacer so stats overlay aligns */}
          <div className="hero-visualization">
            {/* Removed old <EarthVisualization /> canvas; background now fills hero */}
            <Suspense fallback={<div className="loading-spinner"></div>}>
              {/* Intentionally left empty; background is separate */}
            </Suspense>
            {/* Asteroid Statistics Overlay */}
            <div className="asteroid-stats">
              <div className="stat-item">
                <span className="stat-label">ASTEROID SIZE</span>
                <span className="stat-value">247 km</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">VELOCITY</span>
                <span className="stat-value">19.3 km/s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">DISTANCE</span>
                <span className="stat-value">1.94 km</span>
              </div>
              <div className="stat-item stat-item--danger">
                <span className="stat-label">POTENTIAL RISK</span>
                <span className="stat-value danger-indicator">●</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        open={isTrailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoId="1s6l1YfI3IQqRPfe0TQS-iASqJC11OkTS"
      />

      {/* Story Mode Preview */}
      <section className="story-preview">
        <div className="container">
          <StoryModePreview />
        </div>
      </section>

      {/* Research Dashboard Preview */}
      <section className="research-preview">
        <div className="container">
          <ResearchDashboard />
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/story">Story Mode</Link></li>
                <li><Link to="/dashboard">Simulation Dashboard</Link></li>
                <li><Link to="/results">Impact Results</Link></li>
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

export default Home;