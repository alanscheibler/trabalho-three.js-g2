import * as THREE from "three";

class Platform {

  //BASE IRREGULAR
  static createIrregularBase() {
    const shape = new THREE.Shape();

    shape.moveTo(-2.2, -1.2);
    shape.lineTo(2.2, -1.2);
    shape.lineTo(2.2, 0.8);

    shape.lineTo(0.5, 1.2);
    shape.lineTo(-0.8, 1.0);
    shape.lineTo(-2.2, 0.3);

    shape.lineTo(-2.2, -1.2);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: false
    });

    const material = new THREE.MeshStandardMaterial({
      color: 0xb55322,
      roughness: 0.6,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);

    //
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.50; 

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  // SEGUNDO NÍVEL
  static createUpperLevel() {
    const shape = new THREE.Shape();

    shape.moveTo(-1.6, -0.6);
    shape.lineTo(1.6, -0.6);
    shape.lineTo(1.6, 0.3);

    shape.lineTo(0.6, 0.7);
    shape.lineTo(-0.6, 0.7);

    shape.lineTo(-1.6, 0.3);
    shape.lineTo(-1.6, -0.6);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: false
    });

    const material = new THREE.MeshStandardMaterial({
      color: 0xb55322,
      roughness: 0.6,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);

  
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.40; 

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }
}

export { Platform };