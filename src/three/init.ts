import * as THREE from "three";
import { createSpectatorControls } from "./controls";

export type Animate = {
  animationLoop: XRFrameRequestCallback | null;
  animate: Animate[];
};

export class SystemScene {
  private static _instance: SystemScene | null = null;

  public readonly renderer: THREE.WebGLRenderer;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly scene: THREE.Scene;
  public readonly animate: Animate;
  public readonly controls: ReturnType<typeof createSpectatorControls>;

  private constructor() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Camera
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000000);
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(0, 0, 0);

    // Scene
    this.scene = new THREE.Scene();

    const skyboxGeo = new THREE.BoxGeometry(200000, 200000, 200000);
    const skyboxTexture = new THREE.TextureLoader().load(
      "/interactive-solar-system_ICG/skybox.png",
    );
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      map: skyboxTexture,
      side: THREE.BackSide,
    });
    const skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);
    this.scene.add(skybox);

    // Controls
    this.controls = createSpectatorControls(
      this.camera,
      this.renderer.domElement,
    );

    // Animate
    this.animate = {
      animate: [],
      animationLoop: null,
    };

    this.animate.animationLoop = (time, frame) => {
      this.controls.update();
      this.animate.animate.forEach((a) => a.animationLoop?.(time, frame));
      this.renderer.render(this.scene, this.camera);
    };

    this.renderer.setAnimationLoop(this.animate.animationLoop);

    // Window resize
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.controls.updateFakeCamera(this.camera);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public static init() {
    if (SystemScene._instance === null) {
      SystemScene._instance = new SystemScene();
    }
  }

  public static get instance(): SystemScene {
    if (SystemScene._instance === null) {
      SystemScene._instance = new SystemScene();
    }
    return SystemScene._instance;
  }
}

// export function initEmptyScene() {
//   // Renderer
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setClearColor(new THREE.Color(0x000000));
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.shadowMap.enabled = true;
//   document.body.appendChild(renderer.domElement);
//   renderer.setAnimationLoop;
//
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//
//   // Camera
//   const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000000);
//   camera.position.set(0, 0, 500);
//   camera.lookAt(0, 0, 0);
//
//   const scene = new THREE.Scene();
//
//   const skyboxGeo = new THREE.BoxGeometry(200000, 200000, 200000);
//
//   const skyboxTexture = new THREE.TextureLoader().load(
//     "/interactive-solar-system_ICG/skybox.png",
//   );
//
//   const skyboxMaterial = new THREE.MeshBasicMaterial({
//     map: skyboxTexture,
//     side: THREE.BackSide,
//   });
//
//   const skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);
//
//   scene.add(skybox);
//
//   // Controls
//   const controls = createSpectatorControls(camera, renderer.domElement);
//
//   // Animation
//   const animate: Animate = {
//     animate: [],
//     animationLoop: null,
//   };
//
//   animate.animationLoop = (time, frame) => {
//     controls.update();
//     animate.animate.forEach((a) => a.animationLoop?.(time, frame));
//
//     renderer.render(scene, camera);
//   };
//   renderer.setAnimationLoop(animate.animationLoop);
//
//   // Setup window resizing
//   window.addEventListener("resize", onResize, false);
//   function onResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.render(scene, camera);
//   }
//
//   return {
//     camera,
//     renderer,
//     scene,
//     animate,
//     controls,
//   } as const;
// }
