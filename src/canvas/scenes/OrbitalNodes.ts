import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

/**
 * OrbitalNodes
 * 
 * Represents relationships, systems, and connected information.
 * Uses InstancedMesh for performance.
 */
export class OrbitalNodes {
  public mesh: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  private count = 50;
  private radius = 4;
  private material: THREE.MeshPhysicalMaterial;

  constructor(tier: number) {
    // Reduce count on lower-end devices
    this.count = tier <= 1 ? 15 : 50;

    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xDDA15E, // Accent color
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0,
    });

    this.mesh = new THREE.InstancedMesh(geometry, this.material, this.count);
    
    // Distribute nodes spherically
    for (let i = 0; i < this.count; i++) {
      const phi = Math.acos(-1 + (2 * i) / this.count);
      const theta = Math.sqrt(this.count * Math.PI) * phi;
      
      this.dummy.position.setFromSphericalCoords(this.radius, phi, theta);
      // Give each node a random offset phase for oscillation
      this.dummy.userData = { phase: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.5 };
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public update(time: number) {
    // Theme colors
    const isLight = EngineState.theme === 'light';
    const targetColor = isLight ? new THREE.Color(0x283618) : new THREE.Color(0x1B3A4B);
    this.material.color.lerp(targetColor, 0.05);

    // Sync overall opacity with EngineState
    this.mesh.visible = EngineState.orbitalNodesOpacity > 0.01;
    this.material.opacity = EngineState.orbitalNodesOpacity * 0.7; // Max opacity 0.7
    if (!this.mesh.visible) return;

    this.mesh.scale.setScalar(EngineState.orbitalNodesScale);

    // Slowly rotate the entire system
    this.mesh.rotation.y = time * 0.05;
    this.mesh.rotation.x = time * 0.02;

    // We can also animate individual instances if needed, but for extreme performance 
    // on secondary elements, rotating the parent InstancedMesh is sufficient.
    // If we wanted individual oscillation:
    /*
    for (let i = 0; i < this.count; i++) {
       // read matrix, update position, write matrix
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    */
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
