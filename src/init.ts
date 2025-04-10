import * as THREE from "three";
import { createSpectatorControls } from "./controls";

export type Animate = {
  animationLoop: XRFrameRequestCallback | null;
  animate: Animate[];
};

export function initEmptyScene() {
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  renderer.setAnimationLoop;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Camera
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000000);
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);

  const cameraHUD = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    5000,
    2000000,
  );
  cameraHUD.position.copy(camera.position);
  cameraHUD.rotation.copy(camera.rotation);

  const sceneHUD = new THREE.Scene();

  const scene = new THREE.Scene();

  const skyboxGeo = new THREE.BoxGeometry(200000, 200000, 200000);

  const skyboxTexture = new THREE.TextureLoader().load(
    "/interactive-solar-system_ICG/skybox.png",
  );

  const skyboxMaterial = new THREE.MeshBasicMaterial({
    map: skyboxTexture,
    side: THREE.BackSide,
  });

  const skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);

  scene.add(skybox);

  // Controls
  const controls = createSpectatorControls(camera, renderer.domElement);

  // Animation
  const animate: Animate = {
    animate: [],
    animationLoop: null,
  };

  animate.animationLoop = (time, frame) => {
    controls.update();
    animate.animate.forEach((a) => a.animationLoop?.(time, frame));

    cameraHUD.position.copy(camera.position);
    cameraHUD.rotation.copy(camera.rotation);

    renderer.render(sceneHUD, cameraHUD);
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = true;
  };
  renderer.setAnimationLoop(animate.animationLoop);

  // Setup window resizing
  window.addEventListener("resize", onResize, false);
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  return {
    camera,
    renderer,
    scene,
    animate,
    controls,
    cameraHUD,
    sceneHUD,
  } as const;
}
