import * as THREE from "three";
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

  let speed = 0.1;
  let lookSpeed = 2;

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

  function connect() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    domElement.addEventListener("mousedown", onMouseDown);
    domElement.addEventListener("mouseup", onMouseUp);
  }

  function update() {
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

    if (moveState.mouseDown) {
      camera.rotateOnWorldAxis(
        UP,
        lookSpeed * (currentMousePosition.x - initialMousePosition.x),
      );

      camera.rotateOnWorldAxis(
        perpendicular,
        lookSpeed * (currentMousePosition.y - initialMousePosition.y),
      );
      initialMousePosition.copy(currentMousePosition);
    }
  }
  if (domElement !== null) {
    connect();
  }

  return { connect, update };
}

export { createSpectatorControls };
