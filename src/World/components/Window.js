import * as THREE from 'three';

class Window {
    // width/height = vão total da janela; panes = número de folhas
    static createWindow(width = 3.6, height = 1.4, panes = 3) {
        const group = new THREE.Group();

        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xd9d9d9, metalness: 0.3, roughness: 0.5 });
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0a0e14,
            roughness: 0.1,
            metalness: 0,
            transmission: 0.1,
            opacity: 0.85,
            transparent: true
        });

        const frameThickness = 0.06;
        const paneWidth = width / panes;

        // moldura externa
        const outerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(width + frameThickness, height + frameThickness, frameThickness),
            frameMaterial
        );
        outerFrame.position.z = -0.01;
        group.add(outerFrame);

        for (let i = 0; i < panes; i++) {
            const paneGroup = new THREE.Group();
            const x = -width / 2 + paneWidth * i + paneWidth / 2;

            const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(paneWidth - frameThickness, height - frameThickness),
                glassMaterial
            );
            paneGroup.add(glass);

            const divider = new THREE.Mesh(
                new THREE.BoxGeometry(frameThickness, height, frameThickness),
                frameMaterial
            );
            divider.position.x = -paneWidth / 2;
            paneGroup.add(divider);

            paneGroup.position.x = x;
            group.add(paneGroup);
        }

        return group;
    }
}

export { Window };