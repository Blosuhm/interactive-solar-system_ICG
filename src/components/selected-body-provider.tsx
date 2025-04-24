import CelestialBody from "@/three/celestial-body";
import { SystemScene } from "@/three/init";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import * as THREE from "three";

const { camera, controls, scene, renderer } = SystemScene.instance;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

type SelectedBodyContext = {
  selectedBody: CelestialBody | null;
  setSelectedBody: Dispatch<SetStateAction<CelestialBody | null>>;
};

const SelectedBodyContext = createContext<SelectedBodyContext>(undefined!);

export function SelectedBodyProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);

  useEffect(() => {
    let isDragging = false;
    let mouseDownPosition = { x: 0, y: 0 };
    const dragThreshold = 5; // pixels

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = false;
      mouseDownPosition.x = event.clientX;
      mouseDownPosition.y = event.clientY;
    };
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - mouseDownPosition.x;
      const dy = event.clientY - mouseDownPosition.y;
      if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
        isDragging = true;
      }
    };
    const handleMouseUp = (event: MouseEvent) => {
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

      setSelectedBody(body);
      controls.orbit(body.object, 4 * body.radius);
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <SelectedBodyContext.Provider value={{ selectedBody, setSelectedBody }}>
      {children}
    </SelectedBodyContext.Provider>
  );
}

export function useSelectedBody() {
  return useContext(SelectedBodyContext);
}
