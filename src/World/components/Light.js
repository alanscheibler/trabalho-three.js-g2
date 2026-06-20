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

  // Luz de área retangular - simula painel/calha de LED
  static createRectAreaLight(x, y, z, width = 1.2, height = 0.15, color = 0xffffff, intensity = 8) {
    const light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(x, y, z);
    return light;
  }

  static createPointLight(x, y, z, color = 0xffffff, intensity = 1, distance = 0) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    light.castShadow = true;
    return light;
  }
}

export { Light };