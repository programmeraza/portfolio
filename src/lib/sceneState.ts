import * as THREE from "three";

// Mutable, non-reactive bridge between scroll/DOM-driven GSAP timelines and
// the WebGL frame loop. Deliberately not React state: the canvas reads this
// every frame via useFrame, so writes here never trigger a re-render.
export const sceneState = {
  progress: 0, // 0..1 overall document scroll
  pointerX: 0, // -1..1
  pointerY: 0, // -1..1
  reduced: false,
  tint: new THREE.Color("#ff5a1f"),
  targetTint: new THREE.Color("#ff5a1f"),
};

export function setSceneTint(hex: string) {
  sceneState.targetTint.set(hex);
}

export function resetSceneTint() {
  sceneState.targetTint.set("#ff5a1f");
}
