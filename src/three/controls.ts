import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function createControls(camera: THREE.Camera, domElement: HTMLElement) {
  const fakeCamera = camera.clone();
  const orbitControls = new OrbitControls(fakeCamera, domElement);

  function orbit(targetObject: THREE.Object3D, distance = 0) {
    camera.parent?.remove(camera);
    targetObject.add(camera);

    fakeCamera.position.copy(new THREE.Vector3(distance, 0, 0));
  }

  function updateFakeCamera(camera: THREE.PerspectiveCamera) {
    fakeCamera.copy(camera);
  }

  function updateDistance(deltaDistance: number) {
    fakeCamera.position.add(new THREE.Vector3(0, 0, deltaDistance));
  }

  function update() {
    orbitControls.update();
    camera.copy(fakeCamera);
  }

  return { update, orbit, updateDistance, updateFakeCamera };
}

export { createControls };
