import * as THREE from 'three';

class Camera {
  static create() {
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
    // altura dos olhos ~1,6m, posicionada de frente pro sofá, olhando a sala
    camera.position.set(0, 1.6, 6);
    return camera;
  }
}

export { Camera };