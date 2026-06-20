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
import { Pillar } from './components/Pillar.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';

const ROOM_WIDTH = 4.5;
const ROOM_DEPTH = 5;
const ROOM_HEIGHT = 3.3;

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
    await RAPIER.init();
    this.physicsWorld = new RAPIER.World({ x: 0, y: 0, z: 0 });

    RectAreaLightUniformsLib.init();

    this.scene = Scene.create();
    Scene.setBackgroundColor(this.scene, 0x2b2e33);

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    Scene.addGridHelper(this.scene, 10, 10).helper.visible = false;
    Scene.addAxesHelper(this.scene, 2).helper.visible = false;
    Scene.addCameraHelper(this.scene, this.camera).helper.visible = false;
    
    // --- TETO
    const ceiling = Wall.createCeiling(ROOM_WIDTH, ROOM_DEPTH);
    ceiling.position.set(0, ROOM_HEIGHT, 0);
    this.mainGroup.add(ceiling);

    // --- PISO
    const floor = Floor.createCeramicFloor(ROOM_WIDTH, ROOM_DEPTH);
    this.mainGroup.add(floor);

    // --- PAREDES
    const backWall = Wall.createWall(ROOM_WIDTH, ROOM_HEIGHT);
    backWall.position.set(0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2);
    this.mainGroup.add(backWall);

    const sideWall = Wall.createDarkWall(ROOM_DEPTH, ROOM_HEIGHT);
    sideWall.position.set(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0);
    sideWall.rotation.y = -Math.PI / 2;
    this.mainGroup.add(sideWall);

    // --- PILAR
    const pillar = Pillar.create(ROOM_HEIGHT);
    pillar.position.set(2.2, ROOM_HEIGHT / 2, -2.25);
    this.mainGroup.add(pillar);


    // --- JANELA
    const windowGroup = Window.createWindow(2.4, 1.2, 3);
    windowGroup.position.set(-0.6, 1.90, -ROOM_DEPTH / 2 + 0.01);
    this.mainGroup.add(windowGroup);

    // --- PERSIANA 
    this.curtain = Curtain.createSplit(this.physicsWorld, 2.7, 1.2, 2);
    this.curtain.position.set(-0.6, 2.55, -ROOM_DEPTH / 2 + 0.13);
    this.mainGroup.add(this.curtain);

    // --- MÓVEIS
    const sofa = await ModelLoader.load('src/World/assets/models/low_poly_old_sofa_with_bake_normal.glb');
    ModelLoader.tintMaterials(sofa, 0x161616);
    ModelLoader.enableShadows(sofa);
    sofa.position.set(-0.5, -0.15, -1.8);
    sofa.rotation.y = Math.PI*2; 
    sofa.scale.set(1, 1, 1);
    this.mainGroup.add(sofa);

    // --- ALMOFADAS
    const pillowRoxa = Pillow.create(0.34, 0x8e7cc3);
    pillowRoxa.position.set(-0.8, 0.5, -1.85);
    pillowRoxa.rotation.x = Math.PI / 1.5;
    pillowRoxa.rotation.y = Math.PI * 1.05;
    pillowRoxa.rotation.z = Math.PI / 1.6;
    this.mainGroup.add(pillowRoxa);
    
    const pillowPink = Pillow.create(0.34, 0xd6336c);
    pillowPink.position.set(0, 0.5, -1.7);
    pillowPink.rotation.x = Math.PI * 1.8;
    pillowPink.rotation.y = Math.PI / 1.4;
    pillowPink.rotation.z = Math.PI / 1.6;
    this.mainGroup.add(pillowPink);
    
    const pillowAzul = Pillow.create(0.32, 0xa8d8ea);
    pillowAzul.position.set(0.2, 0.47, -1.65);
    pillowAzul.rotation.x = Math.PI * 2;
    pillowAzul.rotation.y = Math.PI / 1.5;
    
    this.mainGroup.add(pillowAzul);
    
    const pillowPessegoFrente = Pillow.create(0.32, 0xf5a17a);
    pillowPessegoFrente.position.set(0.3, 0.5, -1.65);
    pillowPessegoFrente.rotation.x = Math.PI * 2;
    pillowPessegoFrente.rotation.y = Math.PI / 1.5;
    this.mainGroup.add(pillowPessegoFrente);
    
    const pillowPessegoTras = Pillow.create(0.34, 0xf2a98e);
    pillowPessegoTras.position.set(0.5, 0.80, -1.7);
    pillowPessegoTras.rotation.x = Math.PI / 2;
    pillowPessegoTras.rotation.y = Math.PI * 1.05;
    pillowPessegoTras.rotation.z = -Math.PI;
    this.mainGroup.add(pillowPessegoTras);

    const armchair = await ModelLoader.load('src/World/assets/models/armchair.glb');
    armchair.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.map = null;
        obj.material.color.setHex(0x664d3e);
        obj.material.needsUpdate = true;
      }
    });
    ModelLoader.enableShadows(armchair);
    armchair.position.set(1.6, -0.15, -1);
    armchair.rotation.y = Math.PI*1.7;
    armchair.scale.set(0.25, 0.25, 0.25);
    this.mainGroup.add(armchair);

    const airConditioner = await ModelLoader.load('src/World/assets/models/air_conditioner.glb');
    //ModelLoader.tintMaterials(airConditioner, 0xe6e0cf); 
    airConditioner.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.map = null;
    
        obj.material.color.multiply(
          new THREE.Color(0xbfb8a5)
        );
    
        obj.material.needsUpdate = true;
      }
    });
    ModelLoader.enableShadows(airConditioner);
    airConditioner.position.set(-0.6, 2.3, -ROOM_DEPTH / 2 + 0.1);
    airConditioner.scale.set(0.1, 0.1, 0.1);
    this.mainGroup.add(airConditioner);

    const plant = await ModelLoader.load('src/World/assets/models/plant_vase.glb');
    ModelLoader.enableShadows(plant);
    plant.position.set(1.1, 0, -1.8);
    plant.scale.set(0.35, 0.35, 0.35);
    plant.rotation.y = Math.PI * 0.84;
    this.mainGroup.add(plant);

    // --- LUMINÁRIA
    const lamp = Lamp.create(1.4, 0.15, 0xfff4e0, 8);
    lamp.position.set(0.8, ROOM_HEIGHT - 0.05, -1);
    lamp.rotation.y = Math.PI / 2;
    this.mainGroup.add(lamp);

    // --- ILUMINAÇÃO GERAL
    const ambientLight = Light.createAmbientLight(0xffffff, 0.4);
    this.mainGroup.add(ambientLight);

    //const directionalLight = Light.createDirectionalLight(1, 2.5, 1, 0xffffff, 0.6);
    const directionalLight = Light.createDirectionalLight(0, 3, 0, 0xffffff, 0.6);
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
      Curtain.animateSplit(this.curtain, elapsed);

      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World };