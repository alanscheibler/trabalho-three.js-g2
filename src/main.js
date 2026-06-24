import { World } from './World/World.js';
import { World02 } from './World/World02.js';

async function main() {
  const container1 = document.querySelector('#scene-container-1');
  const container2 = document.querySelector('#scene-container-2');

  const world1 = new World(container1);
  const world2 = new World02(container2);

  await Promise.all([world1.init(), world2.init()]);

  world1.render();
  world2.render();
}

main();