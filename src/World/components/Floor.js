import * as THREE from 'three';

class Floor {
    static createBoxFloor(width = 10, height = 0.5, depth = 8, receiveShadow = true) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({ color: 'skyblue' });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        return mesh;
    }

    static createPlaneFloor(width = 10, height = 10, receiveShadow = true) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        return mesh;
    }

    // Piso cerâmico branco da sala, com leve brilho (reflexo de teto)
    static createCeramicFloor(width = 10, depth = 8) {
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshStandardMaterial({
            color: 0xf2f2f0,
            roughness: 0.35,
            metalness: 0.05
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        return mesh;
    }
}

export { Floor };