import * as THREE from 'three';
import { PrimarySculpture } from '../scenes/PrimarySculpture';
import { OrbitalNodes } from '../scenes/OrbitalNodes';
import { FloatingFragments } from '../scenes/FloatingFragments';
import { ProjectArtifacts } from '../scenes/ProjectArtifacts';
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
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x312244, EngineState.fogDensity);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = EngineState.cameraZ;

    const ambientLight = new THREE.AmbientLight(0xffffff, EngineState.ambientIntensity);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x006466, 2);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0x4D194D, 3);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);

    this.sculpture = new PrimarySculpture();
    this.scene.add(this.sculpture.mesh);

    this.orbitalNodes = new OrbitalNodes(this.tier);
    this.scene.add(this.orbitalNodes.mesh);

    this.floatingFragments = new FloatingFragments(this.tier);
    this.scene.add(this.floatingFragments.mesh);

    this.projectArtifacts = new ProjectArtifacts();
    this.scene.add(this.projectArtifacts.group);

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

    // Sync camera and environment from GSAP controlled EngineState
    this.camera.position.z = EngineState.cameraZ;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.density = EngineState.fogDensity;
    }

    // Update scene objects
    this.sculpture.update(elapsedTime, this.lerpedPointer);
    this.orbitalNodes.update(elapsedTime);
    this.floatingFragments.update(elapsedTime);
    this.projectArtifacts.update(elapsedTime);

    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.sculpture.dispose();
    this.orbitalNodes.dispose();
    this.floatingFragments.dispose();
    this.projectArtifacts.dispose();
    this.renderer.dispose();
  }
}
