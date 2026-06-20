import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

class Curtain {
    // Cria a persiana: mesh visual + rigid body kinematic do Rapier
    static create(rapierWorld, width = 2.4, maxHeight = 1.2, color = 0xd9d9d9) {
        const group = new THREE.Group();

        const geometry = new THREE.PlaneGeometry(width, maxHeight, 1, 20);
        geometry.translate(0, -maxHeight / 2, 0); // pivot no topo (onde fica o rolinho)

        const material = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        group.add(mesh);

        // rolinho no topo
        const roller = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, width, 16),
            new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 })
        );
        roller.rotation.z = Math.PI / 2;
        group.add(roller);

        // --- corpo físico kinematic (controlado por código, não por gravidade) ---
        const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
        const rigidBody = rapierWorld.createRigidBody(bodyDesc);

        const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, maxHeight / 2, 0.01);
        rapierWorld.createCollider(colliderDesc, rigidBody);

        group.userData = { rigidBody, mesh, maxHeight };

        return group;
    }

    // Anima abrindo/fechando em loop. t = tempo acumulado (segundos)
    static animate(curtainGroup, t, speed = 0.4) {
        const { rigidBody, mesh, maxHeight } = curtainGroup.userData;

        // openAmount oscila suavemente entre 0 (fechada) e 1 (aberta/enrolada)
        const openAmount = (Math.sin(t * speed) + 1) / 2;
        const visibleHeight = maxHeight * (1 - openAmount * 0.85);

        mesh.scale.y = visibleHeight / maxHeight;

        // sincroniza o collider físico com a altura visível atual
        const worldPos = new THREE.Vector3();
        curtainGroup.getWorldPosition(worldPos);
        rigidBody.setNextKinematicTranslation({
            x: worldPos.x,
            y: worldPos.y - visibleHeight / 2,
            z: worldPos.z
        });
    }
}

export { Curtain };