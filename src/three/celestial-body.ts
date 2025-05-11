import * as THREE from "three";

type CelestialBodyConfig = {
  name: CelestialBody["name"];
  distance: CelestialBody["_distance"];
  radius: CelestialBody["_radius"];
  orbitalPeriod: CelestialBody["orbitalPeriod"];
  parent?: CelestialBody["parent"];
  lightSource?: CelestialBody["lightSource"];
  color?: THREE.ColorRepresentation;
};

const SEGMENTS = 128;

export const celestialBodyRecord = new Map<number, CelestialBody>();

export default class CelestialBody {
  private readonly clock = new THREE.Clock();

  private static _counter = 0;

  public readonly id: number;
  private _name: string;
  private _distance: number;
  private _radius: number;
  private readonly _radius_scale: number;
  public readonly orbitalPeriod: number;
  private _lightSource: boolean;
  public readonly object: THREE.Object3D;
  public readonly body: THREE.Object3D;
  private _parent: CelestialBody | null;
  public readonly orbit: THREE.Object3D;

  private readonly _bodyMaterial: THREE.MeshLambertMaterial;

  private _pointLight: THREE.PointLight;

  public readonly color: THREE.Color;

  public constructor({
    name,
    distance,
    radius,
    color = 0xffffff,
    orbitalPeriod,
    lightSource = false,
    parent = null,
  }: CelestialBodyConfig) {
    CelestialBody._counter++;

    this.id = CelestialBody._counter;

    celestialBodyRecord.set(this.id, this);

    // TODO: Figure out shadows and lighting
    this._pointLight = new THREE.PointLight(color, 10000, 0, 0.5);
    this._pointLight.castShadow = true;
    this._pointLight.shadow.camera.near = 0.1;
    this._pointLight.shadow.camera.far = 10000;
    this._pointLight.shadow.mapSize.width = 4096;
    this._pointLight.shadow.mapSize.height = 4096;
    this._pointLight.shadow.bias = -0.000007;

    this._name = name;
    // TODO: Fix scales
    this._distance = (distance * 0.1) / 80;
    this._radius = radius * 0.1;
    this._radius_scale = 1 / this._radius;
    this.orbitalPeriod = orbitalPeriod;
    this.color = new THREE.Color(color);
    this._lightSource = lightSource;

    this._parent = parent;

    this.object = new THREE.Object3D();

    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: color,
      emissive: lightSource ? color : 0x000000,
      shadowSide: THREE.FrontSide,
    });
    this._bodyMaterial = sphereMaterial;
    const sphereGeometry = new THREE.SphereGeometry(
      this._radius,
      SEGMENTS,
      SEGMENTS,
    );
    this.body = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.body.receiveShadow = true;
    this.body.castShadow = true;
    this.object.add(this.body);

    this.object.position.set(0, 0, this._distance);

    if (this._lightSource) {
      this.object.add(this._pointLight);
    }
    this.object.userData.celestialBody = this;

    this.orbit = new THREE.Object3D();
    this.orbit.add(this.object);

    this._parent?.object.add(this.orbit);
  }

  public readonly animate: XRFrameRequestCallback = () => {
    if (this.orbitalPeriod === 0) return;

    const angle = (2 * Math.PI) / (this.orbitalPeriod / 10);
    const rotation = angle * this.clock.getDelta();
    this.orbit.rotateY(rotation);
    this.object.rotateY(-rotation);
  };

  public set distance(distance: number) {
    if (distance < 0 || this.parent === null) {
      return;
    }
    this._distance = distance;
    this.object.position.set(0, 0, distance);
  }

  public get distance() {
    return this._distance;
  }

  public set radius(radius: number) {
    if (radius < 0) {
      return;
    }

    this._radius = radius;
    const scale = this._radius_scale * radius;

    this.body.scale.setScalar(scale);
  }

  public get radius() {
    return this._radius;
  }

  public set parent(parent: CelestialBody) {
    if (this._parent === null)
      throw Error("Cannot change parent of root celestial body");

    this._parent = parent;
    this.orbit.parent?.remove(this.orbit);
    parent.object.add(this.orbit);
  }

  public get parent(): CelestialBody | null {
    return this._parent;
  }
  public set lightSource(lightSource: boolean) {
    if (lightSource && !this._lightSource) {
      this.object.add(this._pointLight);
      this._bodyMaterial.emissive = this.color;
    } else if (!lightSource && this._lightSource) {
      this.object.remove(this._pointLight);
      this._bodyMaterial.emissive = new THREE.Color(0x000000);
    }

    this._bodyMaterial.needsUpdate = true;
    this._lightSource = lightSource;
  }

  public get lightSource() {
    return this._lightSource;
  }

  public set name(name: string) {
    const text = name.trim();
    if (text.length <= 0) return;
    this._name = text;
  }

  public get name() {
    return this._name;
  }
}
