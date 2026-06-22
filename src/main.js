import { World02 } from './World/World02.js';

async function main() {
  const container = document.querySelector('#scene-container');
  const world = new World02(container);
  await world.init();
  world.render();
}

main();