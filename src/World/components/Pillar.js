import * as THREE from 'three';

class Pillar {
    static create(height, width = 0.5, depth = 0.5, color = 0xe8e8e6) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
}

export { Pillar };