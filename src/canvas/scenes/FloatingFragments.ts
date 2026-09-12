import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

/**
 * FloatingFragments
 * 
 * Represents decomposition of real-world problems.
 * Abstract tetrahedrons drifting in space.
 */
export class FloatingFragments {
  public mesh: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  private count = 40;
  private material: THREE.MeshPhysicalMaterial;

  constructor(tier: number) {
    this.count = tier <= 1 ? 10 : 40;

    const geometry = new THREE.TetrahedronGeometry(0.2);
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x312244, // Atmospheric violet
      metalness: 0.2,
      roughness: 0.8,
      transparent: true,
      opacity: 0,
      wireframe: true
    });

    this.mesh = new THREE.InstancedMesh(geometry, this.material, this.count);
    
    // Distribute randomly in a field
    for (let i = 0; i < this.count; i++) {
      this.dummy.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      );
      
      this.dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public update(time: number) {
    this.mesh.visible = EngineState.fragmentsOpacity > 0.01;
    this.material.opacity = EngineState.fragmentsOpacity * 0.8; // Max opacity 0.8

    if (!this.mesh.visible) return;

    this.mesh.scale.setScalar(EngineState.fragmentsScale);

    // Slowly drift the field upwards and rotate
    this.mesh.position.y = Math.sin(time * 0.1) * 0.5;
    this.mesh.rotation.z = time * 0.02;
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
