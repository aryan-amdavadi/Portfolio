import * as THREE from 'three';
import { PrimarySculpture } from '../scenes/PrimarySculpture';
import { OrbitalNodes } from '../scenes/OrbitalNodes';
import { FloatingFragments } from '../scenes/FloatingFragments';
import { ProjectArtifacts } from '../scenes/ProjectArtifacts';
import { AntigravityField } from '../scenes/AntigravityField';
import { EngineState } from './EngineState';

/**
 * SceneDirector.ts
 * 
 * Isolated 3D engine controller.
 * Operates independently of React's DOM lifecycle.
 */

export class SceneDirector {
  private canvas: HTMLCanvasElement;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  private sculpture: PrimarySculpture;
  private orbitalNodes: OrbitalNodes;
  private floatingFragments: FloatingFragments;
  private projectArtifacts: ProjectArtifacts;
  private antigravityField: AntigravityField;
  
  // Custom timer instead of deprecated THREE.Clock
  private startTime: number = 0;
  private lastTime: number = 0;
  
  // Local state bridging
  public state = {
    pointer: { x: 0, y: 0 },
    isReducedMotion: false,
  };

  private lerpedPointer = { x: 0, y: 0 };
  private tier: number;

  constructor(canvas: HTMLCanvasElement, tier: number = 3) {
    this.canvas = canvas;
    this.tier = tier;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: tier >= 2, // Only antialias on mid/high-end
      powerPreference: 'high-performance'
    });
    
    // Adaptive Pixel Ratio based on Tier
    let pixelRatio = 1;
    if (tier === 2) pixelRatio = 1.5;
    if (tier === 3) pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x312244, EngineState.fogDensity);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = EngineState.cameraZ;

    const ambientLight = new THREE.AmbientLight(0xffffff, EngineState.ambientIntensity);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x006466, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.name = 'dirLight';
    this.scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0x4D194D, 3);
    fillLight.position.set(-5, 0, -5);
    fillLight.name = 'fillLight';
    this.scene.add(fillLight);

    this.sculpture = new PrimarySculpture();
    this.scene.add(this.sculpture.mesh);

    this.orbitalNodes = new OrbitalNodes(this.tier);
    this.scene.add(this.orbitalNodes.mesh);

    this.floatingFragments = new FloatingFragments(this.tier);
    this.scene.add(this.floatingFragments.mesh);

    this.projectArtifacts = new ProjectArtifacts();
    this.scene.add(this.projectArtifacts.group);

    // Initialize Antigravity Field with reduced count on lower tiers
    const particleCount = this.tier >= 3 ? 300 : (this.tier === 2 ? 150 : 50);
    this.antigravityField = new AntigravityField({ count: particleCount });
    this.scene.add(this.antigravityField.group);

    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.onResize();
  }

  private onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.stop();
    } else {
      this.start();
    }
  };

  private onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public updateState(newState: Partial<typeof this.state>) {
    Object.assign(this.state, newState);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.tick();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.startTime) * 0.001; // seconds

    const lerpFactor = this.state.isReducedMotion ? 1 : 0.05;
    this.lerpedPointer.x += (this.state.pointer.x - this.lerpedPointer.x) * lerpFactor;
    this.lerpedPointer.y += (this.state.pointer.y - this.lerpedPointer.y) * lerpFactor;

    // Theme colors
    const darkFogColor = new THREE.Color(0x312244);
    const lightFogColor = new THREE.Color(0xFEFAE0); // Warm off-white
    
    const darkDirColor = new THREE.Color(0x006466); // Cool teal
    const lightDirColor = new THREE.Color(0x606C38); // Olive
    
    const darkFillColor = new THREE.Color(0x4D194D); // Violet
    const lightFillColor = new THREE.Color(0xDDA15E); // Copper
    
    const isLight = EngineState.theme === 'light';
    const targetFog = isLight ? lightFogColor : darkFogColor;
    const targetFogDensity = isLight ? EngineState.fogDensity * 0.5 : EngineState.fogDensity; // Lower fog density in light mode
    const targetDir = isLight ? lightDirColor : darkDirColor;
    const targetFill = isLight ? lightFillColor : darkFillColor;
    const targetAmbient = isLight ? EngineState.ambientIntensity * 1.5 : EngineState.ambientIntensity; // Brighter ambient

    // Sync camera and environment from GSAP controlled EngineState
    this.camera.position.z = EngineState.cameraZ;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.density += (targetFogDensity - this.scene.fog.density) * 0.05;
      this.scene.fog.color.lerp(targetFog, 0.05);
    }
    
    // Update lighting
    this.scene.children.forEach(child => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity += (targetAmbient - child.intensity) * 0.05;
      } else if (child instanceof THREE.DirectionalLight) {
        if (child.name === 'dirLight') {
          child.color.lerp(targetDir, 0.05);
        } else if (child.name === 'fillLight') {
          child.color.lerp(targetFill, 0.05);
        }
      }
    });

    // Update scene objects
    this.sculpture.update(elapsedTime, this.lerpedPointer);
    this.orbitalNodes.update(elapsedTime);
    this.floatingFragments.update(elapsedTime);
    this.projectArtifacts.update(elapsedTime);
    this.antigravityField.update(elapsedTime, this.lerpedPointer, this.state.isReducedMotion);

    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.sculpture.dispose();
    this.orbitalNodes.dispose();
    this.floatingFragments.dispose();
    this.projectArtifacts.dispose();
    this.antigravityField.dispose();
    this.renderer.dispose();
  }
}
