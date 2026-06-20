import * as THREE from 'three';

class Pillow {
    // Almofada simples: caixa com bordas arredondadas (RoundedBox manual via BoxGeometry + bevel leve)
    static create(size = 0.35, color = 0xe07a8a) {
        const geometry = new THREE.BoxGeometry(size, size * 0.85, size * 0.3, 4, 4, 2);

        // leve deformação dos vértices pra parecer "macia" em vez de caixa perfeita
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);
            position.setXYZ(i, x * (1 - 0.08 * Math.abs(z) / (size * 0.15)), y, z);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
}

export { Pillow };