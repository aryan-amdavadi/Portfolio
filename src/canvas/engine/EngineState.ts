/**
 * EngineState.ts
 * 
 * Global mutable state proxy for the 3D Engine.
 * GSAP ScrollTrigger will animate these values directly.
 * The SceneDirector reads these values in its RequestAnimationFrame loop.
 * This completely decouples Scroll/Animation logic from React component re-renders.
 */

export const EngineState = {
  // Theme State
  theme: 'dark' as 'dark' | 'light',

  // Camera
  cameraZ: 8,
  
  // Primary Sculpture
  sculptureX: 0,
  sculptureY: 0,
  sculptureZ: 0,
  sculptureRotX: 0,
  sculptureRotY: 0,
  sculptureScale: 1,
  
  // Environment
  fogDensity: 0.05,
  ambientIntensity: 0.5,
  
  // Secondary Object Opacities & Scales
  orbitalNodesOpacity: 0,
  orbitalNodesScale: 1,
  fragmentsOpacity: 0,
  fragmentsScale: 1,
  artifactsOpacity: 0,
  activeArtifactIndex: -1, // -1: None, 0: SplitSphere, 1: Rapaport, 2: SecretSpeak, 3: Tabster, 4: PulseSync
  
  // DOM state sync (optional)
  scrollProgress: 0,
};
