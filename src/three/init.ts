import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import CelestialBody from "./celestial-body";
import { createControls } from "./controls";
import { sun } from "./solar-system";

export type Animate = {
  animationLoop: XRFrameRequestCallback | null;
  animate: Set<Animate>;
};

export class SystemScene {
  private static _instance: SystemScene | null = null;

  public readonly renderer: THREE.WebGLRenderer;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly scene: THREE.Scene;
  public readonly animate: Animate;
  public readonly controls: ReturnType<typeof createControls>;

  private _systemRoot: CelestialBody;

  private constructor() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "low-power",
      precision: "highp",
      logarithmicDepthBuffer: true,
    });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const stats = new Stats();
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(stats.dom);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Camera
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000000);
    this.camera.lookAt(0, 0, 0);

    // Scene
    this.scene = new THREE.Scene();

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starRadius = 1000; // Adjust as needed
    const positions = [];

    for (let i = 0; i < starCount; i++) {
      // Generate random angles
      const theta = Math.acos(2 * Math.random() - 1); // polar angle
      const phi = 2 * Math.PI * Math.random(); // azimuthal angle

      // Convert spherical coordinates to Cartesian coordinates
      const x = starRadius * Math.sin(theta) * Math.cos(phi);
      const y = starRadius * Math.sin(theta) * Math.sin(phi);
      const z = starRadius * Math.cos(theta);

      positions.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starField = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(starField);
    // const loader = new THREE.TextureLoader();
    // loader.load("/interactive-solar-system_ICG/skybox.png", (texture) => {
    //   this.scene.background = texture;
    // });

    // Controls
    this.controls = createControls(this.camera, this.renderer.domElement);

    // Animate
    this.animate = {
      animate: new Set(),
      animationLoop: null,
    };

    this.animate.animationLoop = (time, frame) => {
      this.controls.update();
      this.animate.animate.forEach((a) => a.animationLoop?.(time, frame));
      this.renderer.render(this.scene, this.camera);
      stats.update();
    };

    this._systemRoot = sun;
    this.scene.add(sun.orbit);
    this.animate.animate.add(sun.animation);

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

  public get celestialSystemRoot() {
    return this._systemRoot;
  }

  public set celestialSystemRoot(celestialSystemRoot) {
    this.scene.remove(this._systemRoot.orbit);
    this.animate.animate.delete(this._systemRoot.animation);

    this._systemRoot = celestialSystemRoot;
    this.scene.add(celestialSystemRoot.orbit);
    this.animate.animate.add(celestialSystemRoot.animation);

    this.renderer.render(this.scene, this.camera);
  }
}
