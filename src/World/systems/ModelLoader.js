import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

class ModelLoader {
    static load(path) {
        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(error)
            );
        });
    }

    // Aplica sombra em todos os meshes do modelo carregado
    static enableShadows(object3D) {
        object3D.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return object3D;
    }

    // Tinge a cor base de todos os materiais do modelo, preservando mapas (normal, roughness, etc)
    static tintMaterials(object3D, hexColor) {
        object3D.traverse((child) => {
            if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat) => {
                    if (mat.color) mat.color.set(hexColor);
                });
            }
        });
        return object3D;
    }
}

export { ModelLoader };