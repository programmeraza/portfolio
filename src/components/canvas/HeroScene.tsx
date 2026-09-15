"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const REPEL_RADIUS = 1.5;
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS;

const vertexShader = `
uniform float uTime;
attribute float aSize;
attribute vec3 aTarget;
varying vec3 vColor;
void main() {
  vec3 pos = position;
  float time = uTime * 0.2;
  
  // Falling motion (Sakura)
  pos.y -= mod(time * aSize + aTarget.y, 10.0) - 5.0;
  
  // Wind / swirling motion
  pos.x += sin(time + pos.y * 1.5) * 0.3;
  pos.z += cos(time + pos.x * 1.5) * 0.3;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (15.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  
  // Sakura colors
  vColor = mix(vec3(1.0, 0.71, 0.77), vec3(1.0, 0.9, 0.95), (sin(time + pos.x) + 1.0) / 2.0);
}
`;

const fragmentShader = `
varying vec3 vColor;
void main() {
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  
  // Shape the point into an oval/petal
  float ll = length(vec2(xy.x * 1.5, xy.y * 0.8));
  if (ll > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.2, ll);
  gl_FragColor = vec4(vColor, alpha * 0.9);
}
`;

function SakuraParticles({ particleCount }: { particleCount: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, targets, sizes] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const t = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread across a wide area
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;

      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
      
      t[i * 3] = x;
      t[i * 3 + 1] = y;
      t[i * 3 + 2] = z;
      
      s[i] = Math.random() * 3.0 + 1.0;
    }
    return [p, t, s];
  }, [particleCount]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    const ptr = state.pointer;

    // Mutate the live Three.js material's own uniforms, not the object
    // `uniforms` returned by useMemo above — React Compiler's immutability
    // check flags writes to a value a hook returned, even from inside
    // useFrame, so update the instance materialRef points at instead.
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Mouse repel physics
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const currentPositions = positionsAttr.array as Float32Array;

    const mouseX = (ptr.x * state.viewport.width) / 2;
    const mouseY = (ptr.y * state.viewport.height) / 2;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      let tx = targets[ix];
      let ty = targets[iy];
      let tz = targets[iz];

      // Re-calculate visual position roughly for mouse collision
      const visualY = ty - ((state.clock.elapsedTime * 0.2 * sizes[i] + ty) % 10.0 - 5.0);

      const dx = mouseX - tx;
      const dy = mouseY - visualY;
      const distSq = dx * dx + dy * dy;

      // Skip the sqrt (and the repel math) for particles nowhere near the
      // pointer — that's the vast majority of them on every frame.
      if (distSq < REPEL_RADIUS_SQ) {
        const dist = Math.sqrt(distSq);
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        tx -= (dx / dist) * force * 2.0;
        ty -= (dy / dist) * force * 2.0;
        tz += force * 2.0;
      }

      currentPositions[ix] += (tx - currentPositions[ix]) * 0.05;
      currentPositions[iy] += (ty - currentPositions[iy]) * 0.05;
      currentPositions[iz] += (tz - currentPositions[iz]) * 0.05;
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[targets, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  // Lazy initializers, not an effect: this component is only ever mounted
  // client-side (dynamic(..., { ssr: false }) in Hero.tsx), so `window` is
  // already available on the very first render — no flash, and no
  // regenerating (and re-randomizing) the particle field right after mount.
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  // Fewer particles on small/likely-mobile viewports — same visual density
  // relative to screen size, far less per-frame CPU work.
  const [particleCount] = useState(() => (window.innerWidth < 768 ? 1200 : 4000));

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  // No reduced-but-still-animated fallback — the entire scene *is* the animation.
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <SakuraParticles particleCount={particleCount} />
    </Canvas>
  );
}
