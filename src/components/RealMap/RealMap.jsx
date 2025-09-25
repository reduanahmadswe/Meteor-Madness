import React, { useEffect } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./RealMap.scss";

export default function RealMap({ selectedLocation }) {
    const size = 200;
    
    useEffect(() => {
        // Suppress ResizeObserver error
        const resizeObserverErrorHandler = (e) => {
            if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        };
        
        window.addEventListener('error', resizeObserverErrorHandler);
        
        const coords = [90.368603, 23.807133];
        config.apiKey = '4xlqmw5O239jIs3v38vu';

        const map = new Map({

            container: "map",
            terrainControl: true,
            scaleControl: true,
            fullscreenControl: "top-left",
            geolocateControl: true,
            style: MapStyle.BASIC,
            center: coords,
            zoom: 1.5,
            bearing: 0,
            pitch: 30,
            maxPitch: 85,
            projection: "globe",
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
            map.addSource("bathymetry", {
                type: "raster-dem",
                url: `https://api.maptiler.com/tiles/ocean-rgb/tiles.json?key=${config.apiKey}`,
                tileSize: 256,
            });

            map.setTerrain({ source: "bathymetry", exaggeration: 1.5 });

            map.addLayer({
                id: "sky",
                type: "sky",
                paint: {
                    "sky-type": "atmosphere",
                    "sky-atmosphere-sun": [0.0, 90.0],
                    "sky-atmosphere-sun-intensity": 15,
                },
            });

            // Remove MapTiler logo after map loads
            setTimeout(() => {
                const logos = document.querySelectorAll(
                    '.maplibregl-ctrl-logo, .mapboxgl-ctrl-logo, a[href*="maptiler"], .maplibregl-ctrl-bottom-left, .maplibregl-ctrl-attrib'
                );
                logos.forEach(logo => {
                    if (logo) {
                        logo.style.display = 'none';
                        logo.style.visibility = 'hidden';
                        logo.remove();
                    }
                });
            }, 100);
        });

        return () => {
            window.removeEventListener('error', resizeObserverErrorHandler);
            map.remove();
        };
    }, []);

    return (
        <div
            id="map"
            style={{
                width: "50vw",
                height: "80vh",
                alignItems: "flex-start"
            }}
        />
    );
}
