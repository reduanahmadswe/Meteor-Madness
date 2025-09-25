import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./RealMap.scss";

export default function RealMap({ selectedLocation }) {
    const size = 200;
    const mapContainer = useRef(null);
    
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
        };
    }, []);

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
