import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Floor } from './components/Floor.js';
import { Wall } from './components/Wall.js';
import { Window } from './components/Window.js';
import { Light } from './components/Light.js';
import { Lamp } from './components/Lamp.js';
import { Curtain } from './components/Curtain.js';
import { ModelLoader } from './systems/ModelLoader.js';
import { Pillow } from './components/Pillow.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';

const ROOM_WIDTH = 4.5;
const ROOM_DEPTH = 5;
const ROOM_HEIGHT = 2.7;

class World {
  constructor(container) {
    this.container = container;

    this.camera = Camera.create();
    this.renderer = Renderer.create();
    container.append(this.renderer.domElement);
    this.resizer = new Resizer(container, this.camera, this.renderer);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.listenToKeyEvents(window);
    this.controls.target.set(0, 1.4, 0);

    this.guiControls = new GuiControls();
    this.clock = new THREE.Clock();
  }

  async init() {
    // --- Rapier (WASM) precisa terminar de carregar antes de criar o mundo físico ---
    await RAPIER.init();
    this.physicsWorld = new RAPIER.World({ x: 0, y: 0, z: 0 }); // sem gravidade, só cinemática

    RectAreaLightUniformsLib.init();

    this.scene = Scene.create();
    Scene.setBackgroundColor(this.scene, 0x2b2e33);

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    Scene.addGridHelper(this.scene, 10, 10).helper.visible = false;
    Scene.addAxesHelper(this.scene, 2).helper.visible = false;
    Scene.addCameraHelper(this.scene, this.camera).helper.visible = false;

    // --- PISO ---
    const floor = Floor.createCeramicFloor(ROOM_WIDTH, ROOM_DEPTH);
    this.mainGroup.add(floor);

    // --- PAREDES ---
    const backWall = Wall.createWall(ROOM_WIDTH, ROOM_HEIGHT);
    backWall.position.set(0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2);
    this.mainGroup.add(backWall);

    const sideWall = Wall.createDarkWall(ROOM_DEPTH, ROOM_HEIGHT);
    sideWall.position.set(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0);
    sideWall.rotation.y = -Math.PI / 2;
    this.mainGroup.add(sideWall);

    // --- JANELA ---
    const windowGroup = Window.createWindow(2.4, 1.2, 3);
    windowGroup.position.set(-0.6, 1.5, -ROOM_DEPTH / 2 + 0.02);
    this.mainGroup.add(windowGroup);

    // --- PERSIANA (encostada na parede, na frente da janela) ---
    this.curtain = Curtain.create(this.physicsWorld, 2.4, 1.2, 0xe0e0e0);
    this.curtain.position.set(-0.6, 2.1, -ROOM_DEPTH / 2 + 0.05);
    this.mainGroup.add(this.curtain);

    // --- LUMINÁRIA ---
    const lamp = Lamp.create(1.4, 0.15, 0xfff4e0, 8);
    lamp.position.set(0.8, ROOM_HEIGHT - 0.05, -1);
    lamp.rotation.y = Math.PI / 2;
    this.mainGroup.add(lamp);

    // --- MÓVEIS (assets glb) ---
    const sofa = await ModelLoader.load('src/World/assets/models/low_poly_old_sofa_with_bake_normal.glb');
    ModelLoader.tintMaterials(sofa, 0x161616); // escurece pra ficar preto
    ModelLoader.enableShadows(sofa);
    sofa.position.set(-0.5, 0, -1.8);
    sofa.rotation.y = Math.PI*2; 
    sofa.scale.set(1, 1, 1);
    this.mainGroup.add(sofa);

    // --- ALMOFADAS (sobre o sofá) ---
    const pillowColors = [0x8e7cc3, 0xd6336c, 0xa8d8ea, 0xf5a17a]; // roxo, pink, azul claro, salmão
    pillowColors.forEach((color, i) => {
        const pillow = Pillow.create(0.34, color);
        pillow.position.set(-1.3 + i * 0.42, 0.55, -2);
        pillow.rotation.y = (Math.random() - 0.5) * 0.4; // leve rotação aleatória, parece mais natural
        pillow.rotation.z = (Math.random() - 0.5) * 0.2;
        this.mainGroup.add(pillow);
    });

    const armchair = await ModelLoader.load('src/World/assets/models/armchair.glb');
    armchair.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.map = null;
        obj.material.color.setHex(0x664d3e);
        obj.material.needsUpdate = true;
      }
    });
    ModelLoader.enableShadows(armchair);
    armchair.position.set(1.6, 0, -1);
    armchair.rotation.y = Math.PI*1.7;
    armchair.scale.set(0.25, 0.25, 0.25);
    this.mainGroup.add(armchair);

    const airConditioner = await ModelLoader.load('src/World/assets/models/air_conditioner.glb');
    ModelLoader.tintMaterials(airConditioner, 0xe6e0cf); 
    /*
    
    airConditioner.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.map = null;
        obj.material.color.setHex(0xbfb8a5);
        obj.material.needsUpdate = true;
      }
    });
    */
    ModelLoader.enableShadows(airConditioner);
    airConditioner.position.set(-0.6, 1.9, -ROOM_DEPTH / 2 + 0.1);
    airConditioner.scale.set(0.1, 0.1, 0.1);
    this.mainGroup.add(airConditioner);

    const plant = await ModelLoader.load('src/World/assets/models/plant_vase.glb');
    ModelLoader.enableShadows(plant);
    plant.position.set(1.1, 0, -1.8);
    plant.scale.set(0.35, 0.35, 0.35);
    plant.rotation.y = Math.PI * 0.84;
    this.mainGroup.add(plant);

    // --- ILUMINAÇÃO GERAL ---
    const ambientLight = Light.createAmbientLight(0xffffff, 0.4);
    this.mainGroup.add(ambientLight);

    const directionalLight = Light.createDirectionalLight(1, 2.5, 1, 0xffffff, 0.6);
    const dlHelper = Light.createDirectionalLightHelper(directionalLight, 1);
    this.mainGroup.add(directionalLight, dlHelper);

    this.guiControls.addCameraFolder(this.camera, this.controls);
    this.guiControls.addLightFolder(ambientLight);
    this.guiControls.addLightFolder(directionalLight, dlHelper);
    this.guiControls.addSceneFolder(this.scene);
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      const elapsed = this.clock.getElapsedTime();

      this.physicsWorld.step();
      Curtain.animate(this.curtain, elapsed);

      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World };