import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

export interface AntigravityFieldOptions {
  count?: number;
  color?: number | string;
}

const vertexShader = `
uniform float uTime;
uniform vec2 uPointer;
uniform float uState;
uniform float uReducedMotion;

attribute vec3 aBasePosition;
attribute vec3 aParams; // x: speed, y: randomRadiusOffset, z: randomSeed

varying float vScale;

void main() {
    float speed = aParams.x;
    float randomRadiusOffset = aParams.y;
    float rSeed = aParams.z;
    
    // Determine simulated time, freeze if reduced motion
    float t = uReducedMotion > 0.5 ? 0.0 : (uTime * speed * 50.0 + rSeed * 100.0);
    
    vec3 basePos = aBasePosition;
    
    float magnetRadius = 10.0 * (1.0 + uState * 0.5);
    float ringRadius = 10.0;
    float waveSpeed = 0.4;
    float waveAmplitude = 1.0;
    float fieldStrength = 10.0;
    
    // Virtual width/height ~ 100
    vec2 projectedTarget = uPointer * 50.0; 
    
    // Depth projection factor
    float projectionFactor = 1.0 - (basePos.z / 50.0);
    projectedTarget *= projectionFactor;
    
    vec2 d = basePos.xy - projectedTarget;
    float dist = length(d);
    
    vec3 targetPos = basePos;
    float scaleFactor = 0.0;
    
    if (uReducedMotion < 0.5) {
        if (dist < magnetRadius) {
            float angle = atan(d.y, d.x);
            float wave = sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
            float deviation = randomRadiusOffset * (5.0 / (fieldStrength + 0.1));
            
            float currentRingRadius = ringRadius + wave + deviation;
            
            targetPos.x = projectedTarget.x + currentRingRadius * cos(angle);
            targetPos.y = projectedTarget.y + currentRingRadius * sin(angle);
            targetPos.z = basePos.z + sin(t) * waveAmplitude;
            
            float currentDistToMouse = length(targetPos.xy - projectedTarget);
            float distFromRing = abs(currentDistToMouse - ringRadius);
            scaleFactor = 1.0 - (distFromRing / 10.0);
        } else {
            if (uState > 1.5) {
                targetPos.x = basePos.x * 0.5 + sin(t + rSeed) * 5.0;
                targetPos.y = basePos.y * 0.5 + cos(t - rSeed) * 5.0;
            }
        }
    }
    
    scaleFactor = clamp(scaleFactor, 0.0, 1.0);
    float finalScale = scaleFactor * (0.8 + sin(t * 3.0) * 0.2) * 2.0;
    finalScale = max(0.2, finalScale);
    
    vScale = finalScale;
    
    vec3 transformed = position * finalScale + targetPos;
    
    // Three.js InstancedMesh uses instanceMatrix
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vScale;

void main() {
    float alpha = 0.6 + (vScale * 0.1);
    gl_FragColor = vec4(uColor, alpha);
}
`;

export class AntigravityField {
  public group: THREE.Group;
  private mesh!: THREE.InstancedMesh;
  private material!: THREE.ShaderMaterial;
  private options: Required<AntigravityFieldOptions>;
  private targetColor: THREE.Color;

  constructor(options: AntigravityFieldOptions = {}) {
    this.options = {
      count: 300,
      color: 0xFF9FFC,
      ...options
    };

    this.group = new THREE.Group();
    this.targetColor = new THREE.Color(this.options.color);
    this.initParticles();
  }

  private initParticles() {
    const { count } = this.options;
    const width = 100;
    const height = 100;

    const basePositions = new Float32Array(count * 3);
    const params = new Float32Array(count * 3); // x: speed, y: randomRadiusOffset, z: randomSeed

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      basePositions[i3 + 0] = (Math.random() - 0.5) * width;
      basePositions[i3 + 1] = (Math.random() - 0.5) * height;
      basePositions[i3 + 2] = -5 - Math.random() * 20;

      params[i3 + 0] = 0.01 + Math.random() / 200; // speed
      params[i3 + 1] = (Math.random() - 0.5) * 2; // randomRadiusOffset
      params[i3 + 2] = Math.random() * 100; // randomSeed
    }

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    geometry.setAttribute('aBasePosition', new THREE.InstancedBufferAttribute(basePositions, 3));
    geometry.setAttribute('aParams', new THREE.InstancedBufferAttribute(params, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uState: { value: 0 },
        uReducedMotion: { value: 0 },
        uColor: { value: this.targetColor }
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count);
    
    // Initialize instance matrices to identity so the shader math isn't multiplied by 0
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    
    this.group.add(this.mesh);
  }

  public update(time: number, pointer: { x: number, y: number }, isReducedMotion: boolean = false) {
    // 1. Determine theme target color
    const isLight = EngineState.theme === 'light';
    const desiredColorHex = isLight ? 0x606C38 : 0xFF9FFC;
    
    // Smoothly lerp color (CPU side, only done once per frame for the uniform)
    this.targetColor.lerp(new THREE.Color(desiredColorHex), 0.05);

    // 2. Pass lightweight uniforms to GPU
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uPointer.value.set(pointer.x, pointer.y);
    this.material.uniforms.uState.value = EngineState.scrollProgress * 2;
    this.material.uniforms.uReducedMotion.value = isReducedMotion ? 1 : 0;
    this.material.uniforms.uColor.value.copy(this.targetColor);
    
    // Absolutely NO per-particle CPU math! The GPU Vertex Shader handles everything.
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
