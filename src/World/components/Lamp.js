import * as THREE from 'three';
import { Light } from './Light.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

class Lamp {
    static create(length = 1.4, width = 0.15, color = 0xffffff, intensity = 8) {
        const group = new THREE.Group();

        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
        const body = new THREE.Mesh(
            new RoundedBoxGeometry(length, 0.06, width, 4, 0.02),
            bodyMaterial
        );
        group.add(body);

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

        const light = Light.createRectAreaLight(0, -0.05, 0, length * 0.9, width * 0.7, color, intensity);
        light.rotation.x = -Math.PI / 2;
        group.add(light);

        group.userData.light = light;

        return group;
    }
}

export { Lamp };