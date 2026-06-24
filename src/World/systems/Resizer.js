class Resizer {
  constructor(container, camera, renderer) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;

    this.resize();
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const { camera, renderer, container } = this;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

export { Resizer };