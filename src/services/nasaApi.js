/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: NASA_API_KEY
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get asteroid feed for the last 7 days or custom date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise} API response with asteroid data
 */
export const getAsteroidFeed = async (startDate, endDate) => {
  try {
    const response = await api.get('/feed', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch asteroid feed: ${error.message}`);
  }
};

/**
 * Get specific asteroid data by ID
 * @param {string} asteroidId - NASA NEO ID
 * @returns {Promise} API response with detailed asteroid data
 */
export const getAsteroidById = async (asteroidId) => {
  try {
    const response = await api.get(`/neo/${asteroidId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch asteroid ${asteroidId}: ${error.message}`);
  }
};

/**
 * Browse all NEOs with pagination
 * @param {number} page - Page number (optional)
 * @param {number} size - Items per page (optional)
 * @returns {Promise} API response with paginated NEO data
 */
export const browseAsteroids = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/neo/browse', {
      params: {
        page: page,
        size: size
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to browse asteroids: ${error.message}`);
  }
};

/**
 * Get today's close approach asteroids
 * @param {boolean} detailed - Include detailed information
 * @returns {Promise} API response with today's close approaches
 */
export const getTodaysCloseApproaches = async (detailed = true) => {
  try {
    const response = await api.get('/feed/today', {
      params: {
        detailed: detailed.toString()
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch today's close approaches: ${error.message}`);
  }
};

/**
 * Get asteroid statistics
 * @returns {Promise} API response with NEO statistics
 */
export const getAsteroidStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch asteroid statistics: ${error.message}`);
  }
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date range for the last 7 days
 * @returns {Object} Object with startDate and endDate
 */
export const getLastWeekDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
};

/**
 * Process asteroid data for visualization
 * @param {Object} feedData - Raw feed data from NASA API
 * @returns {Array} Processed asteroid array
 */
export const processAsteroidData = (feedData) => {
  const asteroids = [];
  
  Object.keys(feedData.near_earth_objects || {}).forEach(date => {
    feedData.near_earth_objects[date].forEach(asteroid => {
      const processedAsteroid = {
        id: asteroid.id,
        name: asteroid.name,
        diameter: {
          min: asteroid.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
          max: asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0
        },
        isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
        closeApproachDate: asteroid.close_approach_data?.[0]?.close_approach_date || date,
        missDistance: {
          astronomical: parseFloat(asteroid.close_approach_data?.[0]?.miss_distance?.astronomical || 0),
          kilometers: parseFloat(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0)
        },
        velocity: parseFloat(asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0),
        magnitude: asteroid.absolute_magnitude_h || 0
      };
      asteroids.push(processedAsteroid);
    });
  });

  return asteroids.sort((a, b) => a.missDistance.astronomical - b.missDistance.astronomical);
};

/**
 * Calculate threat level based on asteroid properties
 * @param {Object} asteroid - Processed asteroid object
 * @returns {string} Threat level: 'Low', 'Medium', 'High', 'Critical'
 */
export const calculateThreatLevel = (asteroid) => {
  const { diameter, missDistance, velocity, isPotentiallyHazardous } = asteroid;
  
  const avgDiameter = (diameter.min + diameter.max) / 2;
  const distanceAU = missDistance.astronomical;
  
  // Critical: Large, close, fast, and potentially hazardous
  if (isPotentiallyHazardous && avgDiameter > 1 && distanceAU < 0.05 && velocity > 20) {
    return 'Critical';
  }
  
  // High: Potentially hazardous with concerning parameters
  if (isPotentiallyHazardous && (avgDiameter > 0.5 || distanceAU < 0.1 || velocity > 15)) {
    return 'High';
  }
  
  // Medium: Some concerning factors
  if (avgDiameter > 0.1 && distanceAU < 0.2) {
    return 'Medium';
  }
  
  // Low: Small and/or distant
  return 'Low';
};

export default {
  getAsteroidFeed,
  getAsteroidById,
  browseAsteroids,
  getTodaysCloseApproaches,
  getAsteroidStats,
  formatDate,
  getLastWeekDateRange,
  processAsteroidData,
  calculateThreatLevel
};