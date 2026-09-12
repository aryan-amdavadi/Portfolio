import * as THREE from 'three';
import { EngineState } from '../engine/EngineState';

/**
 * ProjectArtifacts
 * 
 * Abstract visual artifacts for each major project.
 * 0: SplitSphere (dynamic relationship/network structure)
 * 1: Rapaport Calculator (structured pricing/grid/crystalline system)
 * 2: SecretSpeak (procedural language / pattern-based geometry)
 * 3: Tabster (commerce / transaction / system structure)
 * 4: PulseSync (waveform / signal-based visualization)
 */
export class ProjectArtifacts {
  public group: THREE.Group;
  private artifacts: THREE.Mesh[] = [];
  private material: THREE.MeshPhysicalMaterial;

  constructor() {
    this.group = new THREE.Group();
    // Offset the artifacts so they appear to the side of the main sculpture
    this.group.position.set(4, 0, -2);

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xBC6C25, // Highlight color
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0,
      wireframe: true,
    });

    // 0: SplitSphere
    const splitSphereGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const splitSphere = new THREE.Mesh(splitSphereGeo, this.material);
    
    // 1: Rapaport (Crystalline/Grid)
    const rapaportGeo = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
    const rapaport = new THREE.Mesh(rapaportGeo, this.material);

    // 2: SecretSpeak (Procedural pattern)
    const secretGeo = new THREE.TorusKnotGeometry(1, 0.3, 64, 8);
    const secret = new THREE.Mesh(secretGeo, this.material);

    // 3: Tabster (Commerce/Coin/System)
    const tabsterGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const tabster = new THREE.Mesh(tabsterGeo, this.material);

    // 4: PulseSync (Waveform abstract)
    const pulseGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const pulse = new THREE.Mesh(pulseGeo, this.material);

    this.artifacts = [splitSphere, rapaport, secret, tabster, pulse];

    this.artifacts.forEach(mesh => {
      mesh.visible = false;
      this.group.add(mesh);
    });
  }

  public update(time: number) {
    // Theme colors
    const isLight = EngineState.theme === 'light';
    const targetColor = isLight ? new THREE.Color(0xBC6C25) : new THREE.Color(0x065A60);
    this.material.color.lerp(targetColor, 0.05);

    this.material.opacity = EngineState.artifactsOpacity;
    this.group.visible = EngineState.artifactsOpacity > 0.01 && EngineState.activeArtifactIndex >= 0;

    if (!this.group.visible) return;

    // Show only the active artifact
    this.artifacts.forEach((mesh, index) => {
      mesh.visible = (index === EngineState.activeArtifactIndex);
    });

    const activeMesh = this.artifacts[EngineState.activeArtifactIndex];
    if (activeMesh) {
      // Add subtle unique motion per artifact
      switch (EngineState.activeArtifactIndex) {
        case 0: // SplitSphere
          activeMesh.rotation.y = time * 0.5;
          activeMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
          break;
        case 1: // Rapaport
          activeMesh.rotation.x = time * 0.2;
          activeMesh.rotation.z = time * 0.2;
          break;
        case 2: // SecretSpeak
          activeMesh.rotation.y = time * 0.8;
          break;
        case 3: // Tabster
          activeMesh.rotation.x = Math.PI / 2;
          activeMesh.rotation.y = time; // spinning coin
          break;
        case 4: // PulseSync
          activeMesh.rotation.x = Math.PI / 4;
          activeMesh.scale.setScalar(1 + Math.sin(time * 4) * 0.1); // pulsating
          break;
      }
    }
  }

  public dispose() {
    this.artifacts.forEach(mesh => mesh.geometry.dispose());
    this.material.dispose();
  }
}
