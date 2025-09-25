import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './StoryModePreview.scss';

function StoryModePreview() {
  return (
    <div className="story-mode-preview">
      <div className="story-header">
        <h2 className="story-title">
          <span className="story-mode-label">Story Mode:</span>
          Journey of an Asteroid
        </h2>
        <p className="story-description">
          Follow the path of an asteroid from deep space to Earth impact in our immersive scroll-based
          storytelling experience. Witness the journey through scientifically accurate simulations.
        </p>
      </div>

      <div className="story-features">
        <div className="feature-grid">
          <motion.div 
            className="feature-item"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <span className="icon-number">1</span>
            </div>
            <h4>Detection</h4>
            <p>Discover how astronomers detect and track potentially hazardous asteroids.</p>
          </motion.div>

          <motion.div 
            className="feature-item"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <span className="icon-number">2</span>
            </div>
            <h4>Trajectory</h4>
            <p>Follow the asteroid's path through space using gravitational physics models.</p>
          </motion.div>

          <motion.div 
            className="feature-item"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <span className="icon-number">3</span>
            </div>
            <h4>Approach</h4>
            <p>Experience the final approach as the asteroid enters Earth's atmosphere.</p>
          </motion.div>

          <motion.div 
            className="feature-item"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="feature-icon">
              <span className="icon-number">4</span>
            </div>
            <h4>Impact</h4>
            <p>Witness the moment of impact and its immediate consequences on Earth.</p>
          </motion.div>
        </div>

        <div className="story-preview-visual">
          <div className="preview-container">
            <div className="preview-step active">
              <h4>Step 2: Trajectory</h4>
              <p>The asteroid is put on a collision with prehchts using gravitational models.</p>
            </div>
            <div className="preview-earth">
              <div className="earth-globe"></div>
              <div className="asteroid-trail"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="story-action">
        <Link to="/story" className="btn btn--primary btn--large">
          Start Story Mode
        </Link>
      </div>
    </div>
  );
}

export default StoryModePreview;