import * as THREE from 'three';

class Camera {
  static create() {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
    camera.position.set(0, 1.6, 6);
    return camera;
  }
}

export { Camera };