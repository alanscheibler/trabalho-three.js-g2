import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

class Pillow {
    static create(size = 0.35, color = 0xe07a8a) {
        const width = size;
        const height = size * 0.85;
        const depth = size * 0.3;

        const geometry = new RoundedBoxGeometry(width, height, depth, 5, depth * 0.4);

        const position = geometry.attributes.position;
        const halfW = width / 2;
        const halfH = height / 2;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);

            const distX = 1 - Math.abs(x) / halfW;
            const distY = 1 - Math.abs(y) / halfH;
            const centerFactor = Math.max(0, distX * distY);

            const inflate = z >= 0 ? 1 : -1;
            const newZ = z + inflate * centerFactor * depth * 0.6;

            position.setXYZ(i, x, y, newZ);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
}

export { Pillow };