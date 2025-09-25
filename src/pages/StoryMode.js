import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './StoryMode.scss';

function StoryMode() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      id: 1,
      title: "The Beginning of the Journey",
      subtitle: "Step 1: Detection",
      description: "An asteroid is detected by NASA's Near-Earth Object Observation Program. Scientists calculate its trajectory and determine it is on a collision course.",
      content: "Learn More"
    },
    {
      id: 2,
      title: "Path Through the Solar System",
      subtitle: "Step 2: Trajectory", 
      description: "The asteroid point through space, its path determined by gravitational forces. We can now predict exactly where and when it will impact.",
      content: "Learn More"
    },
    {
      id: 3,
      title: "Entering Earth's Vicinity",
      subtitle: "Step 3: Approach",
      description: "As the asteroid approaches Earth, it begins to heat up from atmospheric friction. The space object has a fragile ground.",
      content: "Learn More"
    },
    {
      id: 4,
      title: "Breaking Through the Atmosphere", 
      subtitle: "Step 4: Entry",
      description: "The asteroid breaks through Earth's atmosphere, creating a brilliant fireball. Air pressure causes the object to break apart into smaller fragments.",
      content: "Learn More"
    },
    {
      id: 5,
      title: "The Moment of Collision",
      subtitle: "Step 5: Impact",
      description: "Impact occurs with devastating force, released enormous energy that creates craters, triggers seismic activity, and causes widespread damage to the immediate area.",
      content: "00:45-43:49"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const stepIndex = Math.floor(scrolled / windowHeight);
      setCurrentStep(Math.min(stepIndex, steps.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div className="story-mode">
      {/* Left vertical numbered stepper */}
      <nav className="story-nav" aria-label="Story steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Go to step ${step.id}: ${step.title}`}
            className={`nav-step ${index === currentStep ? 'active' : ''}`}
            onClick={() => {
              window.scrollTo({
                top: index * window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <span className="step-index">{step.id}</span>
          </button>
        ))}
      </nav>

      {steps.map((step, index) => (
        <section key={step.id} className="story-section">
          <div className="story-content">
            <div className="story-text">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="step-badge"
              >
                <span className="step-number">{step.id}</span>
                <span className="step-label">{step.subtitle}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="story-title"
              >
                {step.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="story-description"
              >
                {step.description}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="story-cta"
              >
                {step.content}
              </motion.button>
            </div>

            <div className="story-visual">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="earth-visual"
              >
                <div className="earth-globe">
                  <div className="earth-surface"></div>
                  <div className="earth-clouds"></div>
                </div>
                
                {/* Asteroid trajectory */}
                <div className={`asteroid-trail step-${step.id}`}>
                  <div className="asteroid"></div>
                </div>

                {/* Impact effect for final step */}
                {step.id === 5 && (
                  <div className="impact-effect">
                    <div className="impact-flash"></div>
                    <div className="impact-waves"></div>
                  </div>
                )}
              </motion.div>

              <div className="visual-label">
                <span className="visual-title">Impact Zone</span>
                <span className="visual-coords">43°N 67°W</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="story-footer">
        <div className="footer-container">
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
      </footer>
    </div>
  );
}

export default StoryMode;