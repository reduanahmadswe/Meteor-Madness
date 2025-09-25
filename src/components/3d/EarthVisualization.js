import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef();
  const atmosphereRef = useRef();
  const cloudsRef = useRef();

  // Create realistic Earth textures
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create realistic Earth texture with continents and oceans
    // Ocean base
    const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1024);
    oceanGradient.addColorStop(0, '#1e40af');
    oceanGradient.addColorStop(0.5, '#1e3a8a'); 
    oceanGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add continents (simplified shapes for Africa, Europe, Asia)
    ctx.fillStyle = '#16a34a'; // Green for land
    
    // Africa
    ctx.beginPath();
    ctx.ellipse(1100, 600, 150, 200, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(1050, 300, 80, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(1400, 400, 200, 150, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // North America
    ctx.beginPath();
    ctx.ellipse(400, 350, 180, 120, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America  
    ctx.beginPath();
    ctx.ellipse(500, 650, 80, 150, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(1600, 750, 100, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add some brown/desert areas
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(1000, 450, 100, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(1200, 700, 80, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Transparent background
    ctx.clearRect(0, 0, 1024, 512);
    
    // Add cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 50 + 20;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.002; // Slightly different speed for clouds
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001; // Very slow atmospheric rotation
    }
  });

  return (
    <group>
      {/* Earth surface */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial 
          map={earthTexture} 
          shininess={1}
          specular="#004080"
          bumpScale={0.1}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 32, 32]}>
        <meshLambertMaterial 
          map={cloudTexture} 
          transparent 
          opacity={0.6}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmospheric glow */}
      <Sphere ref={atmosphereRef} args={[2.1, 32, 32]}>
        <meshBasicMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}

function Asteroid() {
  const asteroidRef = useRef();
  const [time, setTime] = useState(0);

  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    if (asteroidRef.current) {
      // Orbital motion around Earth
      const radius = 6;
      const speed = 0.5;
      asteroidRef.current.position.x = Math.cos(time * speed) * radius;
      asteroidRef.current.position.z = Math.sin(time * speed) * radius;
      asteroidRef.current.position.y = Math.sin(time * speed * 0.5) * 2;
      
      // Rotation
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={asteroidRef}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#ff4400ff" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

function TrajectoryLine() {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const angle = t * Math.PI * 4;
    const radius = 6 - t * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 0.5) * 2;
    points.push(new THREE.Vector3(x, y, z));
  }

  return (
    <Line
      points={points}
      color="#00d4ff"
      lineWidth={2}
      dashed={true}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
}

function Starfield() {
  const starsRef = useRef();
  
  const starPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 2000; i++) {
      // Generate random positions in a sphere
      const radius = 100 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, []);
  
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        sizeAttenuation={true} 
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
}

function EarthVisualization() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [8, 4, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting setup for realistic Earth */}
        <ambientLight intensity={0.15} color="#404080" />
        <directionalLight 
          position={[10, 0, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.3} 
          color="#4040ff" 
        />
        
        {/* Space background */}
        <mesh>
          <sphereGeometry args={[200, 32, 32]} />
          <meshBasicMaterial
            color="#000005"
            side={THREE.BackSide}
            transparent
            opacity={1}
          />
        </mesh>
        
        {/* Starfield */}
        <Starfield />
        
        <Earth />
        <Asteroid />
        <TrajectoryLine />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxDistance={15}
          minDistance={5}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>
      
      {/* Impact point indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 107, 53, 0.15)',
        border: '1px solid rgba(255, 107, 53, 0.4)',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        color: '#ff6b35',
        fontSize: '0.85rem',
        fontWeight: '600',
        textShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ff6b35',
            boxShadow: '0 0 10px #ff6b35',
            animation: 'pulse 2s infinite'
          }}></div>
          IMPACT ZONE: Pacific Ocean
        </div>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}

export default EarthVisualization;