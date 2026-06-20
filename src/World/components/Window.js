import * as THREE from 'three';

class Window {
    static createWindow(width = 2.4, height = 1.2, panes = 3) {
        const group = new THREE.Group();

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xc7c7c5,
            metalness: 0.4,
            roughness: 0.4,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x05070a,
            roughness: 0.05,
            metalness: 0,
            transmission: 0.3,
            transparent: true,
            opacity: 0.92,
            reflectivity: 0.5,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2
        });

        const frameThickness = 0.05;
        const paneWidth = width / panes;
        const rowHeight = height / 2;

        const outerMargin = 0.08;
        const outerDepth = 0.08;

        const outerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(width + outerMargin * 2, height + outerMargin * 2, outerDepth),
            frameMaterial
        );
        outerFrame.position.z = -0.04;
        group.add(outerFrame);

        const sill = new THREE.Mesh(
            new THREE.BoxGeometry(width + outerMargin * 2.5, 0.05, outerDepth * 1.8),
            frameMaterial
        );
        sill.position.set(0, -height / 2 - outerMargin - 0.02, outerDepth / 2);
        group.add(sill);

        const hDivider = new THREE.Mesh(
            new THREE.BoxGeometry(width, frameThickness, frameThickness),
            frameMaterial
        );
        hDivider.position.z = 0.04;
        group.add(hDivider);

        for (let row = 0; row < 2; row++) {
            const y = row === 0 ? rowHeight / 2 : -rowHeight / 2;

            for (let col = 0; col < panes; col++) {
                const x = -width / 2 + paneWidth * col + paneWidth / 2;

                const glass = new THREE.Mesh(
                    new THREE.PlaneGeometry(paneWidth - frameThickness, rowHeight - frameThickness - 0.05),
                    glassMaterial
                );
                glass.position.set(x, y, 0.06);
                group.add(glass);

                if (col > 0) {
                    const vDivider = new THREE.Mesh(
                        new THREE.BoxGeometry(frameThickness, rowHeight, frameThickness),
                        frameMaterial
                    );
                    vDivider.position.set(x - paneWidth / 2, y, 0.04);
                    group.add(vDivider);
                }
            }
        }

        return group;
    }
}

export { Window };