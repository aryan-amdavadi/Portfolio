import * as THREE from 'three';
import { PrimarySculpture } from '../scenes/PrimarySculpture';

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
  private clock: THREE.Clock;
  
  private sculpture: PrimarySculpture;
  
  // Shared state bridged from DOM
  public state = {
    scrollProgress: 0,
    pointer: { x: 0, y: 0 },
    isReducedMotion: false,
  };

  // Lerped state for smooth interpolation
  private lerpedState = {
    scrollProgress: 0,
    pointer: { x: 0, y: 0 },
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 1. Initialize WebGL Context
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    
    // 2. Setup Scene & Camera
    this.scene = new THREE.Scene();
    // Use atmospheric violet for ambient fog
    this.scene.fog = new THREE.FogExp2(0x312244, 0.05);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 8;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x006466, 2); // Teal structural light
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0x4D194D, 3); // Violet fill
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);

    // 4. Add Primary Sculpture
    this.sculpture = new PrimarySculpture();
    this.scene.add(this.sculpture.mesh);

    // 5. Setup Resize Observer
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

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
    this.clock.start();
    this.tick();
  }

  public stop() {
    this.isRunning = false;
    this.clock.stop();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = () => {
    if (!this.isRunning) return;

    const time = this.clock.getElapsedTime();

    // Lerp bridging states
    const lerpFactor = this.state.isReducedMotion ? 1 : 0.05;
    this.lerpedState.scrollProgress += (this.state.scrollProgress - this.lerpedState.scrollProgress) * lerpFactor;
    this.lerpedState.pointer.x += (this.state.pointer.x - this.lerpedState.pointer.x) * lerpFactor;
    this.lerpedState.pointer.y += (this.state.pointer.y - this.lerpedState.pointer.y) * lerpFactor;

    // Update scene objects
    this.sculpture.update(time, this.lerpedState.scrollProgress, this.lerpedState.pointer);

    // Render
    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.sculpture.dispose();
    this.renderer.dispose();
  }
}
