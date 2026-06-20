import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

class Curtain {
    static create(rapierWorld, width = 2.4, maxHeight = 1.2, color = 0xd9d9d9) {
        const group = new THREE.Group();

        const geometry = new THREE.PlaneGeometry(width, maxHeight, 1, 20);
        geometry.translate(0, -maxHeight / 2, 0);

        const material = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        group.add(mesh);

        const roller = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, width, 16),
            new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 })
        );
        roller.rotation.z = Math.PI / 2;
        group.add(roller);

        const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
        const rigidBody = rapierWorld.createRigidBody(bodyDesc);

        const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, maxHeight / 2, 0.01);
        rapierWorld.createCollider(colliderDesc, rigidBody);

        group.userData = { rigidBody, mesh, maxHeight };

        return group;
    }

    static animate(curtainGroup, t, speed = 0.4) {
        const { rigidBody, mesh, maxHeight } = curtainGroup.userData;

        const openAmount = (Math.sin(t * speed) + 1) / 2;
        const visibleHeight = maxHeight * (1 - openAmount * 0.85);

        mesh.scale.y = visibleHeight / maxHeight;

        const worldPos = new THREE.Vector3();
        curtainGroup.getWorldPosition(worldPos);
        rigidBody.setNextKinematicTranslation({
            x: worldPos.x,
            y: worldPos.y - visibleHeight / 2,
            z: worldPos.z
        });
    }
    
    static createSplit(rapierWorld, totalWidth = 2.4, maxHeight = 1.2, segments = 2, color = 0xe0e0e0) {
        const group = new THREE.Group();
        const segWidth = totalWidth / segments;
    
        for (let i = 0; i < segments; i++) {
            const seg = this.create(rapierWorld, segWidth - 0.02, maxHeight, color);
            seg.position.x = -totalWidth / 2 + segWidth * i + segWidth / 2;
            seg.userData.speed = 0.3 + i * 0.15;
            group.add(seg);
        }
    
        return group;
    }
    
    static animateSplit(splitGroup, t) {
        splitGroup.children.forEach((seg) => {
            this.animate(seg, t, seg.userData.speed);
        });
    }
}

export { Curtain };