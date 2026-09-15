"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(cameraPosition - worldPosition.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uLightDir1;
uniform vec3 uLightDir2;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  // Fresnel rim term — brighter where the surface grazes away from the camera
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);

  // Gradient ramp sampled by a normal-derived angle that drifts over time —
  // fakes a rotating environment reflection without an actual env map/HDR.
  float angle = atan(normal.y, normal.x) + uTime * 0.15;
  float t = (sin(angle) + 1.0) * 0.5;
  vec3 base = t < 0.5
    ? mix(uColorA, uColorB, t * 2.0)
    : mix(uColorB, uColorC, (t - 0.5) * 2.0);

  // Cheap two-light Blinn-Phong specular, no real THREE.Light needed
  float spec1 = pow(max(dot(normal, normalize(viewDir + uLightDir1)), 0.0), 40.0);
  float spec2 = pow(max(dot(normal, normalize(viewDir + uLightDir2)), 0.0), 40.0);

  vec3 color = base * (0.5 + 0.5 * fresnel) + vec3(1.0) * (spec1 + spec2) * 0.6;
  gl_FragColor = vec4(color, 1.0);
}
`;

// Shared across the knot + both rings — one glossy "material family", built
// once at module load (not via useMemo, so useFrame can mutate its uniforms
// directly without tripping the React Compiler's hook-return immutability
// check, the same reason the old sakura pool lived at module scope).
const CENTERPIECE_MATERIAL = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color("#7b6cff") },
    uColorB: { value: new THREE.Color("#4f9dff") },
    uColorC: { value: new THREE.Color("#ff5fc4") },
    uLightDir1: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
    uLightDir2: { value: new THREE.Vector3(-0.6, -0.3, 0.5).normalize() },
  },
});

function Centerpiece({ showRings, animate }: { showRings: boolean; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Auto-rotation and pointer-tilt are tracked separately and summed each
  // frame, rather than both nudging `rotation` directly — additive drift
  // plus a lerp-toward-target on the same property fight each other.
  const autoRotation = useRef({ x: 0, y: 0 });
  const pointerTilt = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (animate) {
      CENTERPIECE_MATERIAL.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (ring1Ref.current && animate) ring1Ref.current.rotation.z += delta * 0.25;
    if (ring2Ref.current && animate) ring2Ref.current.rotation.x += delta * -0.18;

    if (!groupRef.current) return;

    if (animate) {
      autoRotation.current.y += delta * 0.15;
      autoRotation.current.x += delta * 0.05;

      const targetTiltX = state.pointer.y * 0.15;
      const targetTiltY = state.pointer.x * 0.15;
      pointerTilt.current.x += (targetTiltX - pointerTilt.current.x) * 0.04;
      pointerTilt.current.y += (targetTiltY - pointerTilt.current.y) * 0.04;

      groupRef.current.rotation.x = autoRotation.current.x + pointerTilt.current.x;
      groupRef.current.rotation.y = autoRotation.current.y + pointerTilt.current.y;
    }
  });

  return (
    <group ref={groupRef} scale={0.6} position={[1.4, -0.1, -0.5]} rotation={[0.4, 0.6, 0]}>
      <mesh material={CENTERPIECE_MATERIAL}>
        <torusKnotGeometry args={[1, 0.32, 220, 24, 2, 3]} />
      </mesh>
      {showRings && (
        <>
          <mesh ref={ring1Ref} material={CENTERPIECE_MATERIAL} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.9, 0.03, 16, 100]} />
          </mesh>
          <mesh ref={ring2Ref} material={CENTERPIECE_MATERIAL} rotation={[0, Math.PI / 4, Math.PI / 6]}>
            <torusGeometry args={[2.2, 0.025, 16, 100]} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function HeroScene() {
  // Lazy initializers, not effects: this component is only ever mounted
  // client-side (dynamic(..., { ssr: false }) in Hero.tsx), so `window` is
  // already available on the very first render.
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      {/* Reduced motion: render the object static (no rotation/parallax,
          no shifting gradient) rather than nothing — a blank hero is a
          bigger regression than a still 3D object. */}
      <Centerpiece showRings={!isMobile} animate={!reducedMotion} />
    </Canvas>
  );
}
