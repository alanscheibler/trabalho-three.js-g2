import * as THREE from 'three';

class Platform {
    /**
     * @param {number} cfg.straightRightDepth
     * @param {number} cfg.rightDiagonalInset
     */
    static createLevel({
        width = 5.5,
        backBarDepth = 0.6,
        rightBarDepth = null,
        protrusionWidthBack = 1.9,
        protrusionWidthFront = 1.3,
        protrusionDepth = 1.15,
        rightDiagonalInset = 0.30,
        height = 0.38,
        color = 0xcc6a3d
    }) {
        const hw = width / 2;
        const gDepth = rightBarDepth ?? backBarDepth;
    
        const shape = new THREE.Shape();
    
        shape.moveTo(-hw, 0);
        shape.lineTo(hw, 0);
        shape.lineTo(hw, -gDepth);
        shape.lineTo(hw - rightDiagonalInset, -protrusionDepth);
        shape.lineTo(hw - rightDiagonalInset - protrusionWidthFront, -protrusionDepth);
        shape.lineTo(hw - protrusionWidthBack, -backBarDepth);
        shape.lineTo(-hw, -backBarDepth);
        shape.lineTo(-hw, 0);
    
        const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.08 });
    
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    
        return mesh;
    }

    static createPlatform(color = 0xcc6a3d) {
        const group = new THREE.Group();

        const lower = Platform.createLevel({
            width: 5.5,
            backBarDepth: 1.2,
            protrusionWidthBack: 3.5,
            protrusionWidthFront: 1.5,
            protrusionDepth: 2.6,
            straightRightDepth: 0.55,
            rightDiagonalInset: 0.8,
            height: 0.5,
            color
        });
        lower.position.y = 0;
        group.add(lower);

        const upper = Platform.createLevel({
          width: 5.5,
          backBarDepth: 0.7,
          rightBarDepth: 0.4, 
          protrusionWidthBack: 2.6,
          protrusionWidthFront: 1.3,
          protrusionDepth: 1.6,
          straightRightDepth: 0.55,
          rightDiagonalInset: 0.8,
          height: 0.5,
          color
        });
        upper.position.y = 0.5;
        group.add(upper);

        return group;
    }
}

export { Platform };