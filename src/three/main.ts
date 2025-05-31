import { SystemScene } from "./init";
import { solarSystemRoot } from "./solar-system";

SystemScene.init();

const { scene, renderer, camera, animate } = SystemScene.instance;

scene.add(solarSystemRoot.orbit);
animate.animate.push(solarSystemRoot.animation);

renderer.render(scene, camera);
