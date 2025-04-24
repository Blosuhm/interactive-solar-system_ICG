import { Animate, SystemScene } from "./init";
import { solarSystem } from "./solar-system";

SystemScene.init();

const { scene, renderer, camera, animate } = SystemScene.instance;

scene.add(solarSystem[0].orbit);

solarSystem.forEach((celestialBody) => {
  const animation: Animate = {
    animationLoop: celestialBody.animate,
    animate: [],
  };
  animate.animate.push(animation);
});

renderer.render(scene, camera);
