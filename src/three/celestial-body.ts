import * as THREE from "three";

type CelestialBodyConfig = {
  name: CelestialBody["name"];
  distance: CelestialBody["_distance"];
  radius: CelestialBody["radius"];
  orbitalPeriod: CelestialBody["orbitalPeriod"];
  parent?: CelestialBody["parent"];
  lightSource?: CelestialBody["lightSource"];
  color?: CelestialBody["color"];
};

const SEGMENTS = 128;

export default class CelestialBody {
  private readonly clock = new THREE.Clock();

  public readonly name: string;
  private _distance: number;
  public readonly radius: number;
  public readonly orbitalPeriod: number;
  private readonly lightSource: boolean;
  public readonly object: THREE.Object3D;
  public readonly parent: CelestialBody | null;
  public readonly orbit: THREE.Object3D;

  public readonly color: THREE.ColorRepresentation;

  public constructor({
    name,
    distance,
    radius,
    color = 0xffffff,
    orbitalPeriod,
    lightSource = false,
    parent = null,
  }: CelestialBodyConfig) {
    this.name = name;
    this._distance = distance / 80;
    this.radius = radius;
    this.orbitalPeriod = orbitalPeriod;
    this.color = color;
    this.lightSource = lightSource;

    this.parent = parent;

    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: color,
      emissive: lightSource ? color : undefined,
    });
    const sphereGeometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
    this.object = new THREE.Mesh(sphereGeometry, sphereMaterial);

    this.object.position.set(0, 0, this._distance);

    if (this.lightSource) {
      const l = new THREE.PointLight(color, 1000000, 0, 0.5);
      this.object.add(l);
    }
    this.object.userData.celestialBody = this;

    this.orbit = new THREE.Object3D();
    this.orbit.add(this.object);

    this.parent?.object.add(this.orbit);
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
}
