import * as THREE from 'three';

class Puff {
  static create(radius = 0.4, height = 0.5) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);

    const material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.7
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }
}

export { Puff };