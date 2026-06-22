import * as THREE from 'three';

class BigWindow {
  static create(width = 4, height = 2) {
    const group = new THREE.Group();

    // moldura
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    // vidro
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.9, height * 0.9),
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0,
        transparent: true
      })
    );

    glass.position.z = 0.06;

    group.add(frame);
    group.add(glass);

    return group;
  }
}

export { BigWindow };