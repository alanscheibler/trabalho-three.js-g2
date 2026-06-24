import { World } from './World/World.js';
import { World02 } from './World/World02.js';

async function main() {
  const container1 = document.querySelector('#scene-container-1');
  const container2 = document.querySelector('#scene-container-2');
  const dualView = document.querySelector('#dual-view');
  const menuButtons = document.querySelectorAll('#view-menu button');

  const world1 = new World(container1);
  const world2 = new World02(container2);

  await Promise.all([world1.init(), world2.init()]);

  function setView(view) {
    dualView.classList.remove('mode-world1', 'mode-world2');

    if (view === 'world1') {
      dualView.classList.add('mode-world1');
      world1.play();
      world2.pause();
    } else if (view === 'world2') {
      dualView.classList.add('mode-world2');
      world2.play();
      world1.pause();
    } else {
      world1.play();
      world2.play();
    }

    world1.resize();
    world2.resize();

    menuButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
  }

  menuButtons.forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  setView('dual');
}

main();