import * as THREE from "three";
import {
  OrbitControls,
  PointerLockControls,
} from "three/examples/jsm/Addons.js";
const UP = new THREE.Vector3(0, 1, 0);

type MoveState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;

  up: boolean;
  down: boolean;

  mouseDown: boolean;
};

function createSpectatorControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
) {
  const moveState: MoveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,

    up: false,
    down: false,

    mouseDown: false,
  };
  const fakeCamera = camera.clone();
  const orbitControls = new OrbitControls(fakeCamera, domElement);
  let shouldOrbit = true;

  function orbit(targetObject: THREE.Object3D, distance = 0) {
    shouldOrbit = true;

    orbitControls.target.set(0, 0, 0);

    fakeCamera.position.copy(new THREE.Vector3(distance, 0, 0));
  }

  function updateFakeCamera(camera: THREE.PerspectiveCamera) {
    fakeCamera.copy(camera);
  }

  function updateDistance(deltaDistance: number) {
    fakeCamera.position.add(new THREE.Vector3(0, 0, deltaDistance));
  }

  const pointerLockControls = new PointerLockControls(camera, domElement);
  domElement.addEventListener("click", () => {
    if (shouldOrbit) return;
    // pointerLockControls.lock();
  });

  let speed = 10;

  function onKey(event: KeyboardEvent, value: boolean) {
    if (event.altKey) return;
    switch (event.code) {
      case "KeyW":
        moveState.forward = value;
        break;
      case "KeyS":
        moveState.backward = value;
        break;
      case "KeyA":
        moveState.left = value;
        break;
      case "KeyD":
        moveState.right = value;
        break;

      case "Space":
        moveState.up = value;
        break;
      case "ShiftLeft":
        moveState.down = value;
        break;
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    onKey(event, true);
  }

  function onKeyUp(event: KeyboardEvent) {
    onKey(event, false);
  }

  const initialMousePosition = new THREE.Vector2();
  const currentMousePosition = new THREE.Vector2();

  function setMousePosition(event: MouseEvent, vector: THREE.Vector2) {
    vector.set(
      event.clientX / window.innerWidth,
      event.clientY / window.innerHeight,
    );
  }

  function onMouseMove(event: MouseEvent) {
    setMousePosition(event, currentMousePosition);
  }

  function onMouseDown(event: MouseEvent) {
    setMousePosition(event, currentMousePosition);
    initialMousePosition.copy(currentMousePosition);

    moveState.mouseDown = true;
    domElement.addEventListener("mousemove", onMouseMove);
  }
  function onMouseUp() {
    moveState.mouseDown = false;
    domElement.removeEventListener("mousemove", onMouseMove);
  }

  function onWheel(event: WheelEvent) {
    // TODO: Tweak speed values
    speed -= event.deltaY / 1000;
    speed = clamp(speed, 0, 100000);
  }

  function connect() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("wheel", onWheel);

    domElement.addEventListener("mousedown", onMouseDown);
    domElement.addEventListener("mouseup", onMouseUp);
  }

  // const q = new THREE.Quaternion();
  function update() {
    if (shouldOrbit) {
      orbitControls.update();
      camera.copy(fakeCamera);
      return;
    }

    pointerLockControls.update(1);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    const projected = new THREE.Vector3();
    projected.copy(direction).projectOnPlane(UP).normalize();

    const perpendicular = new THREE.Vector3();
    perpendicular.crossVectors(projected, UP).normalize();

    if (moveState.forward) {
      camera.position.add(projected.multiplyScalar(speed));
    } else if (moveState.backward) {
      camera.position.sub(projected.multiplyScalar(speed));
    }

    if (moveState.right) {
      camera.position.add(perpendicular.multiplyScalar(speed));
    } else if (moveState.left) {
      camera.position.sub(perpendicular.multiplyScalar(speed));
    }

    if (moveState.up) {
      camera.position.add(UP.clone().multiplyScalar(speed));
    } else if (moveState.down) {
      camera.position.sub(UP.clone().multiplyScalar(speed));
    }

    // if (moveState.mouseDown) {
    //   const angleToUp = direction.angleTo(UP);
    //   const movementY = clamp(
    //     currentMousePosition.y - initialMousePosition.y,
    //     -(Math.PI - angleToUp - 0.1),
    //     angleToUp - 0.1,
    //   );
    //   q.setFromAxisAngle(perpendicular, movementY);
    //   camera.applyQuaternion(q);
    //
    //   const movementX = currentMousePosition.x - initialMousePosition.x;
    //   q.setFromAxisAngle(UP, movementX);
    //   camera.applyQuaternion(q);
    //
    //   initialMousePosition.copy(currentMousePosition);
    // }
  }
  if (domElement !== null) {
    connect();
  }

  return { connect, update, orbit, updateDistance, updateFakeCamera };
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export { createSpectatorControls };
