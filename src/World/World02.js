import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Floor } from './components/Floor.js';
import { Wall } from './components/Wall.js';
import { Platform } from './components/Platform.js';
import { BigWindow } from './components/Big_window.js';
import { Puff } from './components/Puff.js';
import { LedStrip } from './components/Led.js';
import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';

const ROOM_WIDTH = 5.5;
const ROOM_DEPTH = 4.5;
const ROOM_HEIGHT = 3.3;

class World02 {
  constructor(container) {
    this.container = container;

    this.camera = Camera.create();

    //CÂMERA
    this.camera.position.set(4, 3, 6);
    this.camera.lookAt(0, 1, 0);

    this.renderer = Renderer.create();
    container.append(this.renderer.domElement);

    this.resizer = new Resizer(container, this.camera, this.renderer);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.update();

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

// --- TETO FRENTE (branco)
    const ceilingFront = Wall.createCeiling(ROOM_WIDTH, ROOM_DEPTH / 2 - 0.02, 0xf0f0ee);
    ceilingFront.position.set(0, ROOM_HEIGHT, ROOM_DEPTH / 4 + 0.01);
    this.mainGroup.add(ceilingFront);

    // --- TETO TRÁS (laranja)
    const ceilingBack = Wall.createCeiling(ROOM_WIDTH, ROOM_DEPTH / 2 - 0.02, 0xb55322);
    ceilingBack.position.set(0, ROOM_HEIGHT, -ROOM_DEPTH / 4 - 0.01);
    this.mainGroup.add(ceilingBack);

    ceilingFront.material.roughness = 0.3;
    ceilingFront.material.metalness = 0.2;

    ceilingBack.material.roughness = 0.3;
    ceilingBack.material.metalness = 0.2;

    const led = LedStrip.create(ROOM_WIDTH);
    this.mainGroup.add(led);

    const floor = Floor.createCeramicFloor(ROOM_WIDTH, ROOM_DEPTH);
    this.mainGroup.add(floor);

    const backWall = Wall.createOrangeWall(ROOM_WIDTH, ROOM_HEIGHT);
    backWall.position.set(0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2);
    this.mainGroup.add(backWall);

    const sideWall = Wall.createOrangeWall(ROOM_DEPTH, ROOM_HEIGHT);
    sideWall.position.set(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0);
    sideWall.rotation.y = -Math.PI / 2;
    this.mainGroup.add(sideWall);

    // Base plataforma
    const base = Platform.createIrregularBase();
    const baseGroup = new THREE.Group();

    baseGroup.add(base);
    baseGroup.position.set(0, 0.5, -1.2);
    baseGroup.rotation.y = Math.PI;

    this.mainGroup.add(baseGroup);

    // Segundo nível da plataforma
    const level2 = Platform.createUpperLevel();
    const level2Group = new THREE.Group();

    level2Group.add(level2);
    level2Group.position.set(0, 1.0, -1.6);
    level2Group.rotation.y = Math.PI;

    this.mainGroup.add(level2Group);
  
    //Janela

    const windowGroup = BigWindow.create(3, 2);
    windowGroup.position.set(0, 2, -ROOM_DEPTH / 2 + 0.01);
    this.mainGroup.add(windowGroup);

    //PUFF

    const puff = Puff.create();
    puff.position.set(-1, 0.25, 1);
    this.mainGroup.add(puff);

    //  ILUMINAÇÃO 

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    this.mainGroup.add(ambient);

    const light = new THREE.PointLight(0xffaa88, 2);
    light.position.set(0, 2.5, 1);
    this.mainGroup.add(light);

    // GUI
    this.guiControls.addCameraFolder(this.camera, this.controls);
    this.guiControls.addSceneFolder(this.scene);
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      this.physicsWorld.step();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World02 };