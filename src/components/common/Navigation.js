import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.scss';

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/story', label: 'Story Mode' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/results', label: 'Results' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <span className="logo-text">IE</span>
          </div>
          <span className="logo-title">Impact Explorer 2025</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu--open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button className="nav-btn nav-btn--primary">
            Explore Impact
          </button>
        </div>

        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;