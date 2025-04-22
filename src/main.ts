import * as THREE from "three";
import { Animate, initEmptyScene } from "./init";
import { solarSystem } from "./solar-system";

const { scene, renderer, camera, controls, animate } = initEmptyScene();

export { animate };

const ringGeometry = new THREE.RingGeometry(16, 20, 64);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});

const clock = new THREE.Clock();

solarSystem.forEach((body) => {
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: body.color,
    emissive: body.lightSource ? 0xffffff : undefined,
    // shininess: body.lightSource ? 10000 : undefined,
    // wireframe: true,
  });
  const sphereGeometry = new THREE.SphereGeometry(body.radius);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  body.object3d = sphere;
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);

  const orbit = new THREE.Object3D();

  if (body.hasParent) {
    sphere.position.set(0, 0, body.distanceToParent / 80);
    ring.position.set(0, 0, body.distanceToParent / 80);
    orbit.add(sphere);
    body.orbit = orbit;

    const orbitAnimate: Animate = {
      animate: [],
      animationLoop: null,
    };
    orbitAnimate.animationLoop = () => {
      const angle = (2 * Math.PI) / (body.period / 10);
      orbit.rotation.y = angle * clock.getElapsedTime();
    };
    animate.animate.push(orbitAnimate);
  }
  if (body.lightSource) {
    const l = new THREE.PointLight(0xffffff, 1000000, 0, 0.5);
    scene.add(l);
  }

  // ring.lookAt(cameraHUD.position);
  // sceneHUD.add(ring);
  scene.add(body.hasParent ? orbit : sphere);
});

const sidebar = document.getElementById("sidebar");
if (sidebar === null) {
  throw new Error("Please create an element with id sidebar");
}

for (let body of solarSystem) {
  if (body.object3d === undefined) continue;
  const button = document.createElement("button");
  button.innerHTML = body.name;
  button.className =
    "w-full bg-black/80 border-white border-2 rounded-md hover:bg-black/60 font-semibold text-lg hover:border-green-500";

  button.onclick = () => {
    camera.parent?.remove(camera);
    if (body.hasParent) {
      body.orbit?.add(camera);
    }
    controls.orbit(body.object3d as THREE.Object3D, 4 * body.radius);
  };
  sidebar.appendChild(button);
}

renderer.render(scene, camera);
