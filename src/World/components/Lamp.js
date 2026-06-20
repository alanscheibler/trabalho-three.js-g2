import * as THREE from 'three';
import { Light } from './Light.js';

class Lamp {
    // Cria a luminária de teto: caixa branca (corpo) + faixa emissiva (difusor) + RectAreaLight
    static create(length = 1.4, width = 0.15, color = 0xffffff, intensity = 8) {
        const group = new THREE.Group();

        // corpo da calha (plástico branco)
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(length, 0.06, width),
            bodyMaterial
        );
        group.add(body);

        // difusor (faixa que "acende", parte de baixo)
        const diffuserMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 2
        });
        const diffuser = new THREE.Mesh(
            new THREE.BoxGeometry(length * 0.92, 0.02, width * 0.7),
            diffuserMaterial
        );
        diffuser.position.y = -0.04;
        group.add(diffuser);

        // luz de verdade emitida pra baixo
        const light = Light.createRectAreaLight(0, -0.05, 0, length * 0.9, width * 0.7, color, intensity);
        light.rotation.x = -Math.PI / 2; // aponta pra baixo
        group.add(light);

        group.userData.light = light;

        return group;
    }
}

export { Lamp };