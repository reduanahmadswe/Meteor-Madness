import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./RealMap.scss";
import locations from '../../data/locations.json';

export default function RealMap({ selectedLocation, selectedAsteroid }) {
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

    // Handle location changes
    useEffect(() => {
        if (!mapRef.current || !selectedLocation) return;

        let coordinates;
        
        // Check if selectedLocation is from search result or locations JSON
        if (typeof selectedLocation === 'object' && selectedLocation.centroid) {
            // Search result from Nominatim or custom location
            coordinates = [selectedLocation.centroid.lon, selectedLocation.centroid.lat];
        } else if (typeof selectedLocation === 'string' && locations[selectedLocation]) {
            // From locations JSON
            const location = locations[selectedLocation];
            if (location.centroid) {
                coordinates = [location.centroid.lon, location.centroid.lat];
            }
        } else {
            coordinates = [90.368603, 23.807133]; // Default Bangladesh
        }

        // Animate map to new location
        mapRef.current.flyTo({
            center: coordinates,
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
                        geometry: { type: 'Point', coordinates: coordinates }
                    }
                ]
            });
        }
    }, [selectedLocation]);

    // Handle asteroid selection
    useEffect(() => {
        if (!mapRef.current || !selectedAsteroid || !selectedLocation) return;

        // Get current marker coordinates
        const source = mapRef.current.getSource('points');
        if (!source) return;

        const data = source._data;
        if (!data || !data.features || data.features.length === 0) return;

        const targetCoords = data.features[0].geometry.coordinates;

        // Create asteroid impact effect
        const createAsteroidEffect = () => {
            // Remove existing asteroid if any
            if (mapRef.current.getLayer('asteroid')) {
                mapRef.current.removeLayer('asteroid');
                mapRef.current.removeSource('asteroid');
            }

            // Add a temporary asteroid marker above the target
            const asteroidStartCoords = [targetCoords[0], targetCoords[1] + 15]; // Start high above

            mapRef.current.addSource('asteroid', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: asteroidStartCoords }
                        }
                    ]
                }
            });

            // Add asteroid layer with 3D-like effect
            mapRef.current.addLayer({
                id: 'asteroid',
                type: 'circle',
                source: 'asteroid',
                paint: {
                    'circle-radius': 12,
                    'circle-color': '#ff4444',
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.9
                }
            });

            // Animate asteroid falling to target
            let step = 0;
            const totalSteps = 120; // 2 seconds at 60fps
            const animate = () => {
                step++;
                const progress = step / totalSteps;
                
                // Calculate current position (falling down with slight curve)
                const currentY = asteroidStartCoords[1] - (15 * progress);
                const currentX = asteroidStartCoords[0] + (Math.sin(progress * Math.PI) * 2); // Slight curve
                const currentCoords = [currentX, currentY];

                // Update asteroid position
                mapRef.current.getSource('asteroid').setData({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: currentCoords }
                        }
                    ]
                });

                // Update asteroid size (growing as it approaches)
                const currentSize = 12 + (progress * 8);
                mapRef.current.setPaintProperty('asteroid', 'circle-radius', currentSize);

                if (step < totalSteps) {
                    requestAnimationFrame(animate);
                } else {
                    // Impact effect - flash and remove asteroid
                    mapRef.current.setPaintProperty('asteroid', 'circle-color', '#ffff00');
                    mapRef.current.setPaintProperty('asteroid', 'circle-radius', 25);
                    
                    setTimeout(() => {
                        if (mapRef.current && mapRef.current.getLayer('asteroid')) {
                            mapRef.current.removeLayer('asteroid');
                            mapRef.current.removeSource('asteroid');
                        }
                    }, 500);
                }
            };

            animate();
        };

        // Add a small delay before showing asteroid
        setTimeout(createAsteroidEffect, 1000);
    }, [selectedAsteroid, selectedLocation]);

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
