import * as THREE from 'three';

/**
 * PrimarySculpture
 * 
 * An abstract wrapper for the primary 3D identity object.
 * Currently renders a temporary geometric placeholder.
 * Designed to seamlessly accept `PortraitModel.glb` in the future
 * without changing the SceneDirector architecture.
 */
export class PrimarySculpture {
  public mesh: THREE.Group;
  private placeholderMesh: THREE.Mesh;
  private material: THREE.MeshPhysicalMaterial;

  constructor() {
    this.mesh = new THREE.Group();

    // Premium physical material for a cinematic, sculptural look
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x006466, // Teal base
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true, // Temporary abstract feel
      transparent: true,
      opacity: 0.8,
    });

    // Temporary geometric placeholder
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    this.placeholderMesh = new THREE.Mesh(geometry, this.material);
    
    this.mesh.add(this.placeholderMesh);
  }

  /**
   * Called every frame by SceneDirector
   * @param time - elapsed time
   * @param scrollProgress - normalized scroll (0 to 1)
   * @param pointer - normalized pointer coordinates (-1 to 1)
   */
  public update(time: number, scrollProgress: number, pointer: { x: number, y: number }) {
    // Subtle environmental motion
    this.mesh.rotation.y = time * 0.1 + (pointer.x * 0.5) + (scrollProgress * Math.PI * 2);
    this.mesh.rotation.x = Math.sin(time * 0.2) * 0.1 + (pointer.y * 0.2);
    
    // Scale or position transforms based on scroll (pushes it back or moves it as we scroll)
    const targetZ = scrollProgress * -10; // moves away as we scroll
    this.mesh.position.z += (targetZ - this.mesh.position.z) * 0.1;
  }

  public dispose() {
    this.placeholderMesh.geometry.dispose();
    this.material.dispose();
  }
}
