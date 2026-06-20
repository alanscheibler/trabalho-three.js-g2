import * as THREE from 'three';

class Floor {
    static createCeramicFloor(width = 10, depth = 8, repeats = 8) {
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshStandardMaterial({
            map: this.createTileTexture(repeats),
            roughness: 0.35,
            metalness: 0.05
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        return mesh;
    }

    static createTileTexture(repeats = 8) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f5f5f3';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = '#2e2d28';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, 252, 252);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeats, repeats);
        texture.needsUpdate = true;
        return texture;
    }
}

export { Floor };