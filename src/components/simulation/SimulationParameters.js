import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './SimulationParameters.scss';

function SimulationParameters({ onRunSimulation }) {
  const { state, dispatch } = useAppContext();
  const { simulationParams, isLoading } = state;

  const handleParamChange = (param, value) => {
    dispatch({
      type: 'UPDATE_SIMULATION_PARAMS',
      payload: { [param]: value }
    });
  };

  const locations = [
    'Ocean (Pacific)',
    'Ocean (Atlantic)',
    'Ocean (Indian)',
    'Land (Continental)',
    'Land (Urban)',
    'Land (Rural)'
  ];

  return (
    <div className="simulation-parameters">
      <h2 className="parameters-title">
        <span className="title-icon">⚙️</span>
        Simulation Parameters
      </h2>

      <div className="parameter-group">
        <label className="parameter-label">
          Asteroid Diameter
          <span className="parameter-value">{simulationParams.diameter} m</span>
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="50"
            max="1000"
            value={simulationParams.diameter}
            onChange={(e) => handleParamChange('diameter', parseInt(e.target.value))}
            className="parameter-slider"
          />
          <div className="slider-marks">
            <span>50m</span>
            <span>1000m</span>
          </div>
        </div>
        <button className="slider-adjust">+</button>
      </div>

      <div className="parameter-group">
        <label className="parameter-label">
          Velocity
          <span className="parameter-value">{simulationParams.velocity} km/s</span>
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="5"
            max="50"
            step="0.1"
            value={simulationParams.velocity}
            onChange={(e) => handleParamChange('velocity', parseFloat(e.target.value))}
            className="parameter-slider"
          />
          <div className="slider-marks">
            <span>5 km/s</span>
            <span>50 km/s</span>
          </div>
        </div>
        <button className="slider-adjust">+</button>
      </div>

      <div className="parameter-group">
        <label className="parameter-label">
          Entry Angle
          <span className="parameter-value">{simulationParams.angle}°</span>
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="90"
            value={simulationParams.angle}
            onChange={(e) => handleParamChange('angle', parseInt(e.target.value))}
            className="parameter-slider"
          />
          <div className="slider-marks">
            <span>0°</span>
            <span>90°</span>
          </div>
        </div>
        <button className="slider-adjust">+</button>
      </div>

      <div className="parameter-group">
        <label className="parameter-label">Impact Location</label>
        <select
          value={simulationParams.location}
          onChange={(e) => handleParamChange('location', e.target.value)}
          className="location-select"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <button className="location-expand">⬇</button>
      </div>

      <button
        className={`run-simulation-btn ${isLoading ? 'loading' : ''}`}
        onClick={onRunSimulation}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            Running...
          </>
        ) : (
          <>
            <span className="btn-icon">▶</span>
            Run Simulation
          </>
        )}
        <span className="btn-refresh">🔄</span>
      </button>
    </div>
  );
}

export default SimulationParameters;