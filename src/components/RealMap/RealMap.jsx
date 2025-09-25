import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./RealMap.scss";
import locations from '../../data/locations.json';

export default function RealMap({ selectedLocation, selectedAsteroid, simulationTrigger, simulationParams }) {
    const size = 200;
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    
    useEffect(() => {
        // Wait for DOM to be ready and check container
        const initializeMap = () => {
            const container = mapContainer.current;
            if (!container) {
                console.error("Map container not found");
                return;
            }

            // Ensure container has dimensions
            if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                console.warn("Map container has no dimensions, retrying...");
                setTimeout(initializeMap, 100);
                return;
            }

            const coords = [90.368603, 23.807133];
            config.apiKey = '4xlqmw5O239jIs3v38vu';

            let map;
            try {
                map = new Map({
                    container: container,
                    style: MapStyle.BASIC,
                    center: coords,
                    zoom: 1.8,
                    minZoom: 0.5,
                    maxZoom: 18,
                    projection: "globe",
                    bearing: 0,
                    pitch: 0
                });

                // Store map reference
                mapRef.current = map;
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            // called once before every frame where the icon will be used
            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * 0.3;
                const outerRadius = (size / 2) * 0.7 * t + radius;
                const context = this.context;

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                context.fill();

                // draw inner circle
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;
                map.triggerRepaint();
                return true;
            }
        };
        map.on("load", () => {

            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: coords }
                        }
                    ]
                }
            });

            map.addLayer({
                id: 'points',
                type: 'symbol',
                source: 'points',
                layout: { 'icon-image': 'pulsing-dot' }
            });

            // Add atmospheric globe effect
            map.addLayer({
                id: "sky",
                type: "sky",
                paint: {
                    "sky-type": "atmosphere",
                    "sky-atmosphere-sun": [0.0, 90.0],
                    "sky-atmosphere-sun-intensity": 15,
                },
            });

           

        });

            } catch (error) {
                console.error('Error initializing map:', error);
                return;
            }

            return () => {
                if (map) {
                    map.remove();
                }
            };
        };

        // Initialize with a small delay to ensure DOM is ready
        const timeoutId = setTimeout(initializeMap, 100);
        
        return () => {
            clearTimeout(timeoutId);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Handle location changes separately (without meteor animation)
    useEffect(() => {
        if (!mapRef.current || !selectedLocation) return;

        // Determine target coordinates
        let targetCoords;
        
        if (typeof selectedLocation === 'object' && selectedLocation.centroid) {
            targetCoords = [selectedLocation.centroid.lon, selectedLocation.centroid.lat];
        } else if (typeof selectedLocation === 'string' && locations[selectedLocation]) {
            const location = locations[selectedLocation];
            if (location.centroid) {
                targetCoords = [location.centroid.lon, location.centroid.lat];
            }
        } else {
            targetCoords = [90.368603, 23.807133]; // Default Bangladesh
        }

        // Move map to new location (no meteor animation)
        mapRef.current.flyTo({
            center: targetCoords,
            zoom: 6,
            duration: 1500,
            essential: true
        });

        // Update marker position if it exists
        if (mapRef.current.getSource('points')) {
            mapRef.current.getSource('points').setData({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: targetCoords
                    }
                }]
            });
        }
    }, [selectedLocation]);

    // Handle simulation trigger (when Run Simulation is clicked)
    useEffect(() => {
        if (!mapRef.current || !selectedAsteroid || !selectedLocation || !simulationTrigger) return;

        // First, determine the target coordinates based on selected location
        let targetCoords;
        
        // Check if selectedLocation is from search result or locations JSON
        if (typeof selectedLocation === 'object' && selectedLocation.centroid) {
            // Search result from Nominatim or custom location
            targetCoords = [selectedLocation.centroid.lon, selectedLocation.centroid.lat];
        } else if (typeof selectedLocation === 'string' && locations[selectedLocation]) {
            // From locations JSON
            const location = locations[selectedLocation];
            if (location.centroid) {
                targetCoords = [location.centroid.lon, location.centroid.lat];
            }
        } else {
            targetCoords = [90.368603, 23.807133]; // Default Bangladesh
        }

        // Animate map to new location
        mapRef.current.flyTo({
            center: targetCoords,
            zoom: 6,
            duration: 2000,
            essential: true
        });

        // Update marker position
        if (mapRef.current.getSource('points')) {
            mapRef.current.getSource('points').setData({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: targetCoords }
                    }
                ]
            });
        }

        // Store references to DOM elements for position updates
        let explosionEl = null;
        let meteorEl = null;

        // Create elaborate meteor impact effect using DOM elements
        const createMeteorEffect = () => {
            // Clean up any existing meteor/explosion elements
            const existingMeteors = mapContainer.current.querySelectorAll('.meteor-container, .impact-explosion');
            existingMeteors.forEach(meteor => meteor.remove());

            // Get target position in screen coordinates
            const targetPixel = mapRef.current.project(targetCoords);

            // Create meteor container
            const meteorContainer = document.createElement('div');
            meteorContainer.className = 'meteor-container';
            mapContainer.current.appendChild(meteorContainer);

            // Create meteor element
            meteorEl = document.createElement('div');
            meteorEl.className = 'meteor meteor-falling';
            
            // Scale meteor size based on diameter (simulation parameters)
            const diameter = simulationParams?.diameter || 250;
            const meteorSize = Math.max(8, Math.min(40, diameter / 25)); // Scale 8-40px based on diameter
            meteorEl.style.width = `${meteorSize}px`;
            meteorEl.style.height = `${meteorSize}px`;

            // Position meteor at starting point based on entry angle
            const entryAngle = simulationParams?.entryAngle || 45;
            const angleRadians = (entryAngle * Math.PI) / 180;
            const distance = 500;
            const startX = targetPixel.x - (distance * Math.cos(angleRadians));
            const startY = targetPixel.y - (distance * Math.sin(angleRadians));
            meteorEl.style.left = `${startX}px`;
            meteorEl.style.top = `${startY}px`;

            meteorContainer.appendChild(meteorEl);

            // Animate meteor falling to target
            let startTime = null;
            // Scale animation duration based on velocity (higher velocity = faster animation)
            const velocity = simulationParams?.velocity || 19.3;
            const baseDuration = 2000;
            const duration = Math.max(1000, baseDuration - (velocity - 19.3) * 50); // Faster for higher velocity

            const animateMeteor = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // Calculate current position with pronounced curve for arrow-like trajectory
                const targetPixelNow = mapRef.current.project(targetCoords);
                const currentX = startX + ((targetPixelNow.x - startX) * progress);
                const currentY = startY + ((targetPixelNow.y - startY) * progress) + (Math.sin(progress * Math.PI) * 60);

                meteorEl.style.left = `${currentX}px`;
                meteorEl.style.top = `${currentY}px`;

                // Rotate meteor based on trajectory
                const angle = Math.atan2(targetPixelNow.y - startY, targetPixelNow.x - startX) * (180 / Math.PI) + 45;
                meteorEl.style.transform = `rotate(${angle}deg)`;

                if (progress < 1) {
                    requestAnimationFrame(animateMeteor);
                } else {
                    // Impact effect
                    meteorEl.className = 'meteor meteor-impact';
                    // Create persistent explosion effect
                    explosionEl = document.createElement('div');
                    explosionEl.className = 'impact-explosion';
                    explosionEl.style.left = `${targetPixelNow.x}px`;
                    explosionEl.style.top = `${targetPixelNow.y}px`;
                    explosionEl.style.position = 'absolute';
                    explosionEl.style.pointerEvents = 'none';
                    explosionEl.style.zIndex = '20';
                    // Add debris
                    for (let i = 0; i < 8; i++) {
                        const debris = document.createElement('div');
                        debris.className = 'impact-debris';
                        debris.style.left = '50%';
                        debris.style.top = '50%';
                        debris.style.transform = `rotate(${45*i}deg)`;
                        explosionEl.appendChild(debris);
                    }
                    mapContainer.current.appendChild(explosionEl);
                }
            };

            requestAnimationFrame(animateMeteor);

            // Listen for map move/rotate and update explosion position
            const updateExplosionPosition = () => {
                if (explosionEl) {
                    const pixel = mapRef.current.project(targetCoords);
                    explosionEl.style.left = `${pixel.x}px`;
                    explosionEl.style.top = `${pixel.y}px`;
                }
            };
            mapRef.current.on('move', updateExplosionPosition);
            mapRef.current.on('rotate', updateExplosionPosition);

            // Clean up listeners when location/asteroid changes
            return () => {
                mapRef.current.off('move', updateExplosionPosition);
                mapRef.current.off('rotate', updateExplosionPosition);
            };
        };

        // Wait for map flyTo animation to complete before showing meteor
        let cleanup;
        setTimeout(() => {
            cleanup = createMeteorEffect();
        }, 2500); // Wait 2.5 seconds for flyTo animation (2s) + small buffer

        // Cleanup listeners on unmount/change
        return () => {
            if (cleanup) cleanup();
        };
    }, [selectedAsteroid, selectedLocation, simulationTrigger, simulationParams]);

    return (
        <div
            ref={mapContainer}
            className="real-map-container"
            style={{
                width: "50vw",
                height: "80vh",
                alignItems: "flex-start"
            }}
        />
    );
}
