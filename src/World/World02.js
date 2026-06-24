import * as THREE from "three";

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
import { Light } from './components/Light.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';

const ROOM_WIDTH = 5.5;
const ROOM_DEPTH = 4.5;
const ROOM_HEIGHT = 3.3;

class World02 {
  constructor(container) {
    this.container = container;

    this.camera = Camera.create();
    this.camera.position.set(4, 3, 6);
    this.camera.lookAt(0, 1, 0);

    this.renderer = Renderer.create();
    container.append(this.renderer.domElement);

    this.resizer = new Resizer(container, this.camera, this.renderer);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.update();

    this.guiControls = new GuiControls(this.container);
    this.clock = new THREE.Clock();
  }

  async init() {
    RectAreaLightUniformsLib.init();

    this.scene = Scene.create();
    Scene.setBackgroundColor(this.scene, 0x2b2e33);

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    Scene.addGridHelper(this.scene, 10, 10).helper.visible = false;
    Scene.addAxesHelper(this.scene, 2).helper.visible = false;

    // --- TETO (metade branca frente, metade laranja atrás)
    const ceilingFront = Wall.createCeiling(ROOM_WIDTH, ROOM_DEPTH / 2, 0xf0f0ee);
    ceilingFront.position.set(0, ROOM_HEIGHT, ROOM_DEPTH / 4);
    ceilingFront.material.roughness = 0.3;
    ceilingFront.material.metalness = 0.2;
    this.mainGroup.add(ceilingFront);

    const ceilingBack = Wall.createCeiling(ROOM_WIDTH, ROOM_DEPTH / 2, 0xb55322);
    ceilingBack.position.set(0, ROOM_HEIGHT, -ROOM_DEPTH / 4);
    ceilingBack.material.roughness = 0.3;
    ceilingBack.material.metalness = 0.2;
    this.mainGroup.add(ceilingBack);

    // --- SANCA DE LED
    const led = LedStrip.create(ROOM_WIDTH);
    led.position.set(0, -0.01, 0 );
    this.mainGroup.add(led);

    // --- PISO
    const floor = Floor.createCeramicFloor(ROOM_WIDTH, ROOM_DEPTH, 9);
    this.mainGroup.add(floor);

    // --- PAREDE LARANJA (fundo)
    const backWall = Wall.createOrangeWall(ROOM_WIDTH, ROOM_HEIGHT);
    backWall.position.set(0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2);
    this.mainGroup.add(backWall);

    // --- PAREDE LATERAL DIREITA
    const sideWall = Wall.createOrangeWall(ROOM_DEPTH /2, ROOM_HEIGHT);
    sideWall.position.set(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, -1.13);
    sideWall.rotation.y = -Math.PI / 2;
    this.mainGroup.add(sideWall);

    // --- JANELA
    const windowGroup = BigWindow.create(3, 1.3, 4, 0.42);
    windowGroup.position.set(0, ROOM_HEIGHT - 1.0, -ROOM_DEPTH / 2 + 0.06);
    this.mainGroup.add(windowGroup);

    // --- PLATAFORMA 
    const platform = Platform.createPlatform(0xcc6a3d);
    platform.position.set(0, 0, -ROOM_DEPTH / 2);
    this.mainGroup.add(platform);

    // --- PUFF
    const puff = Puff.create(0.25, 0.6);
    puff.position.set(-0.2, 0.225, 0.4);
    this.mainGroup.add(puff);

    // --- ILUMINAÇÃO
    const ambient = Light.createAmbientLight(0xffffff, 0.65);
    this.mainGroup.add(ambient);

    // luz de preenchimento suave vinda de cima
    //const fill = Light.createPointLight(0, ROOM_HEIGHT - 0.3, 0.5, 0xfff4e0, 1.0, 8, false);
    //this.mainGroup.add(fill);

    this.guiControls.addCameraFolder(this.camera, this.controls);
    this.guiControls.addLightFolder(ambient);
    //this.guiControls.addLightFolder(fill);
    this.guiControls.addSceneFolder(this.scene);
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World02 };