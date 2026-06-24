import * as THREE from 'three';

class BigWindow {
    static create(width = 3, height = 1.2, panes = 4, topRatio = 0.42) {
        const group = new THREE.Group();

        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xe8e8e8,
            metalness: 0.3,
            roughness: 0.4
        });

        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x05070a,
            roughness: 0.05,
            transparent: true,
            opacity: 0.88,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });

        const ft = 0.05;
        const paneW = width / panes;
        const topH = height * topRatio;
        const bottomH = height - topH;
        const hDivY = height / 2 - topH;


        // moldura externa
        const outerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.1, height + 0.1, 0.08),
            frameMat
        );
        outerFrame.position.set(0, 0, -0.04);
        group.add(outerFrame);

        // divisor horizontal
        const hDiv = new THREE.Mesh(new THREE.BoxGeometry(width, ft, ft), frameMat);
        hDiv.position.set(0, hDivY, 0.04);
        group.add(hDiv);

        for (let row = 0; row < 2; row++) {
          const rowH = row === 0 ? topH : bottomH;
          const y = row === 0
              ? height / 2 - rowH / 2
              : -height / 2 + rowH / 2;
  
          for (let col = 0; col < panes; col++) {
              const x = -width / 2 + paneW * col + paneW / 2;
  
              const glass = new THREE.Mesh(
                  new THREE.PlaneGeometry(paneW - ft, rowH - ft),
                  glassMat
              );
              glass.position.set(x, y, 0.06);
              group.add(glass);
  
              if (col > 0) {
                  const vDiv = new THREE.Mesh(
                      new THREE.BoxGeometry(ft, rowH, ft),
                      frameMat
                  );
                  vDiv.position.set(x - paneW / 2, y, 0.04);
                  group.add(vDiv);
              }
          }
        }

        return group;
    }
}

export { BigWindow };