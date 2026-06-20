import * as THREE from 'three';

class Wall {
    static createWall(width, height, color = 0xf5f5f3) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.9,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        return mesh;
    }

    static createDarkWall(width, height) {
        return this.createWall(width, height, 0x14161a);
    }

    static createCeiling(width, depth, color = 0xf0f0ee) {
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.95, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        mesh.receiveShadow = true;
        return mesh;
    }
}

export { Wall };