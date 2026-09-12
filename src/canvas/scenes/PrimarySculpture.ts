import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

/**
 * PrimarySculpture
 * 
 * An abstract wrapper for the primary 3D identity object.
 * Designed to seamlessly accept `PortraitModel.glb` in the future.
 */
export class PrimarySculpture {
  public mesh: THREE.Group;
  private placeholderMesh: THREE.Mesh;
  private material: THREE.MeshPhysicalMaterial;

  constructor() {
    this.mesh = new THREE.Group();

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x006466, // Teal base
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true, 
      transparent: true,
      opacity: 0.8,
    });

    const geometry = new THREE.IcosahedronGeometry(2, 4);
    this.placeholderMesh = new THREE.Mesh(geometry, this.material);
    
    this.mesh.add(this.placeholderMesh);
  }

  /**
   * Called every frame by SceneDirector
   * @param time - elapsed time in seconds
   * @param pointer - normalized pointer coordinates (-1 to 1)
   */
  public update(time: number, pointer: { x: number, y: number }) {
    // Theme colors
    const isLight = EngineState.theme === 'light';
    const targetColor = isLight ? new THREE.Color(0x606C38) : new THREE.Color(0x006466);
    
    if (this.material) {
      this.material.color.lerp(targetColor, 0.05);
    }

    // Shared transform logic applies universally to the root group, pointer subtle movement, and scroll-driven rotation from EngineState
    this.mesh.rotation.y = (time * 0.1) + (pointer.x * 0.1) + EngineState.sculptureRotY;
    this.mesh.rotation.x = (Math.sin(time * 0.2) * 0.1) + (pointer.y * 0.1) + EngineState.sculptureRotX;
    
    // Apply interpolated positions from GSAP
    this.mesh.position.x = EngineState.sculptureX;
    this.mesh.position.y = EngineState.sculptureY;
    this.mesh.position.z = EngineState.sculptureZ;
    
    this.mesh.scale.setScalar(EngineState.sculptureScale);
  }

  public dispose() {
    this.placeholderMesh.geometry.dispose();
    this.material.dispose();
  }
}
