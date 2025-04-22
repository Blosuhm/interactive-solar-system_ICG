import * as THREE from "three";
import CelestialBody from "./celestial-body";
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

scene.add(solarSystem[0].orbit);

solarSystem.forEach((celestialBody) => {
  const animation: Animate = {
    animationLoop: celestialBody.animate,
    animate: [],
  };
  animate.animate.push(animation);
});

solarSystem.forEach((body) => {
  return;
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

const selected = document.getElementById("selected-body");
if (selected === null) {
  throw new Error("Please create an element with id selected-body");
}

const updateSelectedBody = (selectedBody: CelestialBody) => {
  selected.innerHTML = `
    <p class="font-bold text-lg">Distance to parent</p>
    <input type="range" min="0" max="1000" value="${selectedBody.distance}" class="" id="range">
  `;
  const input = document.getElementById("range") as HTMLInputElement;
  input.oninput = (ev) => {
    const prevDistance = selectedBody.distance;
    selectedBody.distance = parseInt((ev.target as HTMLInputElement).value);
    controls.updateDistance(selectedBody.distance - prevDistance);
  };
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let mouseDownPosition = { x: 0, y: 0 };
const dragThreshold = 5; // pixels

window.addEventListener("mousedown", (event) => {
  isDragging = false;
  mouseDownPosition.x = event.clientX;
  mouseDownPosition.y = event.clientY;
});

window.addEventListener("mousemove", (event) => {
  const dx = event.clientX - mouseDownPosition.x;
  const dy = event.clientY - mouseDownPosition.y;
  if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
    isDragging = true;
  }
});

window.addEventListener("mouseup", (event) => {
  if (isDragging) return;

  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length < 1) return;

  const selectedObject = intersects[0].object;

  if (selectedObject.userData.celestialBody === undefined) return;

  const body = selectedObject.userData.celestialBody as CelestialBody;

  updateSelectedBody(body);
  camera.parent?.remove(camera);
  if (body.parent !== null) {
    body.orbit?.add(camera);
  }
  controls.orbit(body.object, 4 * body.radius);
});

for (let body of solarSystem) {
  const button = document.createElement("button");
  button.innerHTML = body.name;
  button.className =
    "w-full bg-black/80 border-white border-2 rounded-md hover:bg-black/60 font-semibold text-lg hover:border-green-500";

  button.onclick = () => {
    updateSelectedBody(body);
    camera.parent?.remove(camera);
    if (body.parent !== null) {
      body.orbit?.add(camera);
    }
    controls.orbit(body.object, 4 * body.radius);
  };
  sidebar.appendChild(button);
}

renderer.render(scene, camera);
