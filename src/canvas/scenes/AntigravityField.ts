import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

export interface AntigravityFieldOptions {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: number | string;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  fieldStrength?: number;
}

export interface AntigravityParticle {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  randomRadiusOffset: number;
}

export class AntigravityField {
  public group: THREE.Group;
  private mesh!: THREE.InstancedMesh;
  private dummy: THREE.Object3D;
  private particles: AntigravityParticle[] = [];
  private virtualMouse: THREE.Vector2;
  private lastMousePos: THREE.Vector2;
  
  private options: Required<AntigravityFieldOptions>;

  constructor(options: AntigravityFieldOptions = {}) {
    this.options = {
      count: 300,
      magnetRadius: 10,
      ringRadius: 10,
      waveSpeed: 0.4,
      waveAmplitude: 1,
      particleSize: 2,
      lerpSpeed: 0.1,
      color: 0xFF9FFC,
      particleVariance: 1,
      rotationSpeed: 0,
      depthFactor: 1,
      pulseSpeed: 3,
      fieldStrength: 10,
      ...options
    };

    this.group = new THREE.Group();
    this.dummy = new THREE.Object3D();
    this.virtualMouse = new THREE.Vector2(0, 0);
    this.lastMousePos = new THREE.Vector2(0, 0);

    this.initParticles();
  }

  private initParticles() {
    const { count, color } = this.options;
    // We don't have access to viewport width/height directly in init, we'll assume a bounding box
    const width = 100;
    const height = 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      this.particles.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset
      });
    }

    // Use a small smooth sphere for premium technical feel instead of capsule
    const geometry = new THREE.SphereGeometry(0.05, 16, 16); 
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
    
    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    this.group.add(this.mesh);
  }

  public update(time: number, pointer: { x: number, y: number }, isReducedMotion: boolean = false) {
    if (isReducedMotion) {
      // In reduced motion, just keep them static and don't react to pointer
      return;
    }

    // Convert normalized pointer (-1 to 1) to world coordinates approximate to our z=0 plane
    // Assume camera is at z=50, fov=35. We'll map pointer to our virtual bounding box
    const vWidth = 100;
    const vHeight = 100;
    
    const m = { x: pointer.x, y: pointer.y };
    const destX = (m.x * vWidth) / 2;
    const destY = (m.y * vHeight) / 2;

    const smoothFactor = 0.05;
    this.virtualMouse.x += (destX - this.virtualMouse.x) * smoothFactor;
    this.virtualMouse.y += (destY - this.virtualMouse.y) * smoothFactor;

    const targetX = this.virtualMouse.x;
    const targetY = this.virtualMouse.y;

    const globalRotation = time * this.options.rotationSpeed;

    // React to system state from EngineState.
    // Map scroll progress (0-1) to state (0-2)
    const state = EngineState.scrollProgress * 2; 

    const dynamicMagnetRadius = this.options.magnetRadius * (1 + state * 0.5);
    const dynamicLerpSpeed = this.options.lerpSpeed * (1 + state);
    
    // Theme colors
    const isLight = EngineState.theme === 'light';
    const targetColor = isLight ? new THREE.Color(0x606C38) : new THREE.Color(0xFF9FFC);
    (this.mesh.material as THREE.MeshBasicMaterial).color.lerp(targetColor, 0.05);

    this.particles.forEach((particle, i) => {
      const { speed, mx, my, mz, cz, randomRadiusOffset } = particle;

      particle.t += speed / 2;
      const t = particle.t;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const targetPos = { x: mx, y: my, z: mz * this.options.depthFactor };

      if (dist < dynamicMagnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;

        const wave = Math.sin(t * this.options.waveSpeed + angle) * (0.5 * this.options.waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (this.options.fieldStrength + 0.1));

        const currentRingRadius = this.options.ringRadius + wave + deviation;

        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = mz * this.options.depthFactor + Math.sin(t) * (1 * this.options.waveAmplitude * this.options.depthFactor);
      } else {
        // System structure pull if state is high
        if (state > 1.5) {
            targetPos.x = mx * 0.5 + Math.sin(t + i) * 5;
            targetPos.y = my * 0.5 + Math.cos(t - i) * 5;
        }
      }

      particle.cx += (targetPos.x - particle.cx) * dynamicLerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * dynamicLerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * dynamicLerpSpeed;

      this.dummy.position.set(particle.cx, particle.cy, particle.cz);
      this.dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      this.dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const distFromRing = Math.abs(currentDistToMouse - this.options.ringRadius);
      let scaleFactor = 1 - distFromRing / 10;
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * (0.8 + Math.sin(t * this.options.pulseSpeed) * 0.2 * this.options.particleVariance) * this.options.particleSize;
      
      // Make non-ring particles slightly visible too
      const baseScale = Math.max(0.2, finalScale);
      
      this.dummy.scale.set(baseScale, baseScale, baseScale);
      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(i, this.dummy.matrix);
    });

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
