import * as THREE from 'three';

class LedStrip {
  static create(width = 4.5) {
    const group = new THREE.Group();

    // LED 
    const geometry = new THREE.BoxGeometry(width, 0.02, 0.08);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffe6cc,
      emissive: 0xffaa88,
      emissiveIntensity: 2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 3.29, 0); // colado no teto
    group.add(mesh);

    // Iluminação
    const light = new THREE.RectAreaLight(0xffaa88, 8, width, 0.2);
    light.position.set(0, 3.28, 0);
    light.rotation.x = -Math.PI / 2;

    group.add(light);

    return group;
  }
}

export { LedStrip };