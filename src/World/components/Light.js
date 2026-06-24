import * as THREE from "three";

class Light {

  static createAmbientLight(color = 0xffffff, intensity = 0.5) {
    const light = new THREE.AmbientLight(color, intensity);
    return light;
  }

  static createDirectionalLight(x = 0, y = 2, z = 2, color = 0xffffff, intensity = 1) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    light.castShadow = true;
    return light;
  }

  static createDirectionalLightHelper(light, size = 3) {
    const helper = new THREE.DirectionalLightHelper(light, size);
    helper.visible = false;
    return helper;
  }

  static createRectAreaLight(x, y, z, width = 1.2, height = 0.15, color = 0xffffff, intensity = 8) {
    const light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(x, y, z);
    return light;
  }

  static createPointLight(x, y, z, color = 0xffffff, intensity = 1, distance = 0, castShadow = true) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    light.castShadow = castShadow;
    return light;
  }

  static createLinearShadowLights(x, y, z, length = 1.2, axis = 'x', count = 3, color = 0xffffff, totalIntensity = 1.2, distance = 6) {
    const lights = [];
    const middleIndex = Math.floor(count / 2);

    const shadowLightIntensity = totalIntensity * 0.6;
    const fillLightIntensity = (totalIntensity * 0.4) / (count - 1);

    for (let i = 0; i < count; i++) {
        const offset = (i / (count - 1) - 0.5) * length;
        const lightX = axis === 'x' ? x + offset : x;
        const lightZ = axis === 'z' ? z + offset : z;

        const isShadowCaster = (i === middleIndex);
        const intensity = isShadowCaster ? shadowLightIntensity : fillLightIntensity;

        const light = this.createPointLight(lightX, y, lightZ, color, intensity, distance, isShadowCaster);

        if (isShadowCaster) {
            light.shadow.bias = -0.002;
            light.shadow.mapSize.set(1024, 1024);
        }

        lights.push(light);
    }

    return lights;
  } 
}

export { Light };