import * as THREE from "three";
import { createSpectatorControls } from "./controls";

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();

const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Render
renderer.render(scene, camera);

// Controls
const controls = createSpectatorControls(camera, renderer.domElement);

renderer.setAnimationLoop(animate);
function animate() {
  controls.update();

  renderer.render(scene, camera);
}
