import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Trail, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';


function Starfield() {
  const starsRef = useRef();
  const starPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 2000; i++) {
      const radius = 150 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, []);

  useFrame(() => {
    if (starsRef.current) starsRef.current.rotation.y += 0.00015;
  });

  return (
    <points ref={starsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attachObject={["attributes", "position"]} count={starPositions.length / 3} array={starPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.6} sizeAttenuation color="#ffffff" transparent opacity={0.85} />
    </points>
  );
}

function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  // Base color map (very simplified continents + oceans)
  const colorMap = useMemo(() => {
    const w = 2048, h = 1024;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');

    // Ocean gradient
    const ocean = g.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#0a1a3f');
    ocean.addColorStop(1, '#09203f');
    g.fillStyle = ocean; g.fillRect(0, 0, w, h);

    // Land masses (rough equirectangular patches)
    g.fillStyle = '#2e8b57';
    const ell = (x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
    // North America
    ell(600, 420, 240, 160); ell(520, 540, 120, 140);
    // South America
    ell(800, 700, 120, 220);
    // Europe/Africa
    ell(1100, 380, 150, 90); ell(1200, 580, 160, 240);
    // Asia
    ell(1400, 450, 260, 180);
    // Australia
    ell(1640, 780, 120, 80);

    // Deserts
    g.fillStyle = '#c2a36b'; ell(1180, 520, 120, 70); ell(1320, 520, 140, 80);

    return new THREE.CanvasTexture(c);
  }, []);

  // Night lights emissive map (focus on North America)
  const lightsMap = useMemo(() => {
    const w = 2048, h = 1024;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    const dot = (x, y, r, a) => {
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, `rgba(255, 230, 180, ${a})`);
      grd.addColorStop(1, 'rgba(255, 230, 180, 0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    };
    // Sprinkle many city lights across North America bounds
    const nx0 = 380, nx1 = 820, ny0 = 350, ny1 = 650; // rough bounds
    for (let i = 0; i < 1800; i++) {
      const x = nx0 + Math.random() * (nx1 - nx0);
      const y = ny0 + Math.random() * (ny1 - ny0);
      const r = 0.8 + Math.random() * 1.8;
      const a = 0.25 + Math.random() * 0.6;
      dot(x, y, r, a);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  // Cloud texture
  const cloudsMap = useMemo(() => {
    const w = 1024, h = 512;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.65)';
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const rx = 20 + Math.random() * 80, ry = 10 + Math.random() * 40;
      g.beginPath(); g.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0008;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.001;
  });

  return (
    <group position={[-2.2, -0.2, 0]} rotation={[0.15, -1.2, 0]}>
      <Sphere ref={earthRef} args={[2.4, 96, 96]}>
        <meshStandardMaterial
          map={colorMap}
          emissiveMap={lightsMap}
          emissive={'#ffd9a8'}
          emissiveIntensity={0.9}
          roughness={1}
          metalness={0.0}
        />
      </Sphere>
      <Sphere ref={cloudsRef} args={[2.46, 64, 64]}>
        <meshLambertMaterial map={cloudsMap} transparent opacity={0.55} depthWrite={false} />
      </Sphere>
      <Sphere ref={atmosphereRef} args={[2.6, 64, 64]}>
        <meshBasicMaterial color={'#6fb7ff'} transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </Sphere>
    </group>
  );
}

function Explosion({ position, onDone, duration = 0.6 }) {
  const ref = useRef();
  const tex = useMemo(() => {
    const s = 256; const c = document.createElement('canvas'); c.width = s; c.height = s; const g = c.getContext('2d');
    const grd = g.createRadialGradient(s/2, s/2, 10, s/2, s/2, s/2);
    grd.addColorStop(0, 'rgba(255,240,200,1)');
    grd.addColorStop(0.3, 'rgba(255,180,60,0.95)');
    grd.addColorStop(0.6, 'rgba(255,90,0,0.6)');
    grd.addColorStop(1, 'rgba(255,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(s/2, s/2, s/2, 0, Math.PI * 2); g.fill();
    return new THREE.CanvasTexture(c);
  }, []);

  const startRef = useRef(null);
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (startRef.current === null) startRef.current = now;
    const k = Math.min((now - startRef.current) / duration, 1);
    const s = 0.4 + k * 3.5;
    const o = 1 - k;
    if (ref.current) {
      ref.current.scale.setScalar(s);
      ref.current.material.opacity = o;
    }
    if (k >= 1 && onDone) onDone();
  });

  return (
    <sprite ref={ref} position={position}>
      <spriteMaterial map={tex} color={'#ffd9a8'} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
    </sprite>
  );
}

function Asteroid() {
  const ref = useRef();
  const flame1 = useRef();
  const flame2 = useRef();
  const sparksRef = useRef();
  const [explosion, setExplosion] = useState(null); // { position: Vector3 }

  // Flame sprite texture
  const flameTex = useMemo(() => {
    const s = 256; const c = document.createElement('canvas'); c.width = s; c.height = s; const g = c.getContext('2d');
    const grd = g.createRadialGradient(s/2, s/2, 10, s/2, s/2, s/2);
    grd.addColorStop(0, 'rgba(255,200,50,1)');
    grd.addColorStop(0.3, 'rgba(255,120,20,0.9)');
    grd.addColorStop(0.6, 'rgba(255,80,0,0.6)');
    grd.addColorStop(1, 'rgba(255,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(s/2, s/2, s/2, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
  }, []);

  // Sparks positions
  const sparks = useMemo(() => {
    const arr = new Float32Array(3 * 400);
    for (let i = 0; i < 400; i++) {
      arr[i*3+0] = -Math.random() * 2;
      arr[i*3+1] = (Math.random() - 0.5) * 0.6;
      arr[i*3+2] = (Math.random() - 0.5) * 0.6;
    }
    return arr;
  }, []);

  // Forward-only motion with impact + respawn
  const prog = useRef(0); // 0..1
  const speed = 0.08; // motion speed
  const START = new THREE.Vector3(6.5, 2.6, -1.4);
  const EARTH_CENTER = new THREE.Vector3(-2.2, -0.2, 0.0);
  const TARGET = EARTH_CENTER.clone();
  const EARTH_RADIUS = 2.6;

  useFrame((state, delta) => {
    // If explosion is rendering, pause asteroid until explosion completes
    if (explosion) return;
    prog.current += delta * speed;
    const t = Math.min(prog.current, 1);
    const pos = new THREE.Vector3().lerpVectors(START, TARGET, t);

    if (ref.current) {
      ref.current.visible = true;
      ref.current.position.copy(pos);
      ref.current.rotation.x += 0.01; ref.current.rotation.y += 0.02;
      const dir = new THREE.Vector3().subVectors(TARGET, START).normalize();
      ref.current.lookAt(pos.clone().add(dir));
    }

    // Flame flicker
    const now = state.clock.getElapsedTime();
    if (flame1.current) flame1.current.material.opacity = 0.5 + Math.sin(now * 20) * 0.25;
    if (flame2.current) flame2.current.material.opacity = 0.35 + Math.cos(now * 17) * 0.2;

    // Impact detection (entering Earth's atmosphere)
    const dist = pos.distanceTo(EARTH_CENTER);
    if (dist <= EARTH_RADIUS * 0.98 || t >= 1) {
      // Hide rock and spawn explosion effect once
      if (ref.current) ref.current.visible = false;
      setExplosion({ position: pos.clone() });
    }
  });

  return (
    <group>
      <group ref={ref}>
        {/* Trail wraps the rock for real positional history */}
        <Trail width={2.2} length={12} color={'#ff7a18'} attenuation={(t) => t}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial color={'#5a5a5a'} roughness={0.9} metalness={0.1} emissive={'#ff6a00'} emissiveIntensity={0.15} />
          </mesh>
        </Trail>

        {/* Flames: additive sprites behind the rock */}
        <sprite ref={flame1} position={[-0.35, 0, 0]}>
          <spriteMaterial map={flameTex} color={'#ff7a18'} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
        </sprite>
        <sprite ref={flame2} position={[-0.6, 0.05, 0]}>
          <spriteMaterial map={flameTex} color={'#ff3d00'} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
        </sprite>

        {/* Sparks */}
        <points ref={sparksRef} position={[-0.6, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute attachObject={["attributes", "position"]} count={sparks.length / 3} array={sparks} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.05} color={'#ffa366'} blending={THREE.AdditiveBlending} transparent />
        </points>
      </group>

      {/* Explosion overlay */}
      {explosion && (
        <Explosion
          position={explosion.position}
          onDone={() => {
            setExplosion(null);
            // Respawn asteroid at start
            prog.current = 0;
            if (ref.current) {
              ref.current.visible = true;
              ref.current.position.copy(START);
            }
          }}
        />
      )}
    </group>
  );
}

function ParallaxRig({ intensity = 0.12 }) {
  const { mouse, camera } = useThree();
  useFrame(() => {
    camera.position.x = 8 * 0.5 + (mouse.x || 0) * intensity;
    camera.position.y = 4 * 0.5 + (mouse.y || 0) * intensity;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CinematicBackground() {
  return (
    <div className="hero-bg-canvas" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [8, 4, 8], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Backdrop */}
        <mesh>
          <sphereGeometry args={[300, 32, 32]} />
          <meshBasicMaterial color="#000005" side={THREE.BackSide} />
        </mesh>
        <Starfield />

        {/* Lights */}
        <ambientLight intensity={0.12} color="#404080" />
        <directionalLight position={[10, 2, 5]} intensity={1.35} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.35} color="#4050ff" />

        <Earth />
        <Asteroid />

        <ParallaxRig />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
