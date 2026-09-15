"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";

// Ashima/Stefan Gustavson classic 3D simplex noise — public-domain reference
// implementation, embedded directly since it's a generic building block, not
// project code carried over from any earlier component.
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  attribute float aRandom;
  varying float vDisplace;

  ${NOISE_GLSL}

  void main() {
    vec3 pos = position;
    vec3 nrm = normalize(pos);
    float n = snoise(pos * 1.6 + uTime * 0.06);
    float displaced = n * (0.16 + uProgress * 0.4);
    pos += nrm * displaced;
    pos.xy += uPointer * 0.12 * (0.35 + aRandom);
    vDisplace = n;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.0 + aRandom * 1.8) * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uTint;
  varying float vDisplace;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uBase, uTint, clamp(vDisplace * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
  }
`;

// Module-level shared material instance: uniforms are mutated in-place from
// useFrame every tick, so this must not be a per-render useMemo value (that
// would trip the React Compiler's hook-return immutability check).
const FIELD_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: VERTEX_SHADER,
  fragmentShader: FRAGMENT_SHADER,
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uBase: { value: new THREE.Color("#8f8570") },
    uTint: { value: new THREE.Color("#ff5a1f") },
  },
});

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    randoms[i] = Math.random();
  }

  return { positions, randoms };
}

function ParticleField({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { positions, randoms } = useMemo(() => fibonacciSphere(count, 1.6), [count]);

  useFrame((_, delta) => {
    const t = sceneState.reduced ? 0 : delta;
    FIELD_MATERIAL.uniforms.uTime.value += t;
    FIELD_MATERIAL.uniforms.uProgress.value = sceneState.progress;
    FIELD_MATERIAL.uniforms.uPointer.value.set(sceneState.pointerX, sceneState.pointerY);
    sceneState.tint.lerp(sceneState.targetTint, 0.05);
    FIELD_MATERIAL.uniforms.uTint.value.copy(sceneState.tint);

    const group = groupRef.current;
    if (!group) return;
    if (!sceneState.reduced) {
      group.rotation.y += delta * 0.045;
    }
    const tiltX = sceneState.pointerY * 0.18;
    const tiltY = sceneState.pointerX * 0.22;
    group.rotation.x += (tiltX - group.rotation.x) * 0.04;
    group.rotation.z += (tiltY * 0.3 - group.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <points material={FIELD_MATERIAL}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}

export default function SceneCanvas() {
  const coarseRef = useRef(false);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    sceneState.reduced = reducedQuery.matches;
    coarseRef.current = !pointerQuery.matches;

    const onReducedChange = (e: MediaQueryListEvent) => {
      sceneState.reduced = e.matches;
    };
    reducedQuery.addEventListener("change", onReducedChange);

    const onPointerMove = (e: PointerEvent) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (pointerQuery.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      reducedQuery.removeEventListener("change", onReducedChange);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 2200 : 5500;

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        style={{ background: "var(--bg)" }}
      >
        <ParticleField count={count} />
      </Canvas>
    </div>
  );
}
