import * as THREE from "three";
import { z } from "zod";
import { Animate } from "./init";

type CelestialBodyConfig = {
  name: CelestialBody["name"];
  distance: CelestialBody["_distance"];
  radius: CelestialBody["_radius"];
  orbitalPeriod: CelestialBody["orbitalPeriod"];
  parent?: CelestialBody["parent"];
  lightSource?: CelestialBody["lightSource"];
  textureSrc?: string;
};

const SEGMENTS = 128;

export const celestialBodyRecord = new Map<number, CelestialBody>();

interface CelestialBodyJSON {
  name: string;
  radius: number;
  distance: number;
  lightSource: boolean;
  orbitalPeriod: number;
  satellites?: CelestialBodyJSON[];
}

// TODO: Make config for limits
const celestialBodyJSONSchema: z.ZodType<CelestialBodyJSON> = z.object({
  name: z.string().min(1),
  radius: z.number().gt(0),
  distance: z.number().gte(0),
  lightSource: z.boolean(),
  orbitalPeriod: z.number().gte(0),
  satellites: z
    .lazy(() => celestialBodyJSONSchema)
    .array()
    .optional(),
});

export default class CelestialBody {
  private readonly clock = new THREE.Clock();

  private static _counter = 0;

  public readonly id: number;
  private _name: string;
  private _distance: number;
  private _radius: number;
  private readonly _radius_scale: number;
  private _orbitalPeriod: number;
  private _lightSource: boolean;
  public readonly object: THREE.Object3D;
  public readonly body: THREE.Object3D;
  private _parent: CelestialBody | null;
  private _isPaused: boolean | undefined;
  public readonly orbit: THREE.Object3D;

  private static readonly loader = new THREE.TextureLoader();

  private readonly _satelliteSet = new Set<CelestialBody>();

  private readonly _bodyMaterial: THREE.MeshLambertMaterial;

  private _pointLight: THREE.PointLight;

  public readonly color: THREE.Color;

  public animation: Animate;

  public constructor({
    name,
    distance,
    radius,
    textureSrc,
    orbitalPeriod,
    lightSource = false,
    parent = null,
  }: CelestialBodyConfig) {
    CelestialBody._counter++;

    this.id = CelestialBody._counter;

    celestialBodyRecord.set(this.id, this);

    this._pointLight = new THREE.PointLight(0xffffff, 5, 0, 0);
    this._pointLight.castShadow = true;
    this._pointLight.shadow.camera.near = 0.1;
    this._pointLight.shadow.camera.far = 10000;
    this._pointLight.shadow.mapSize.width = 4096;
    this._pointLight.shadow.mapSize.height = 4096;
    this._pointLight.shadow.bias = -0.00005;

    this._name = name;
    this._distance = parent === null ? 0 : distance;
    this._radius = radius;
    this._radius_scale = 1 / this._radius;
    this._orbitalPeriod = orbitalPeriod;
    this.color = new THREE.Color(0xffffff);
    this._lightSource = lightSource;
    this._isPaused = parent === null ? undefined : false;

    this._parent = parent;

    this.object = new THREE.Object3D();

    const texture = CelestialBody.loader.load(
      textureSrc ?? "4k_ceres_fictional.jpg",
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      emissive: lightSource ? 0xffffff : 0x000000,
      shadowSide: THREE.FrontSide,
      map: texture,
      emissiveMap: texture,
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

    if (this._parent !== null) {
      this.object.position.set(
        0,
        0,
        this._distance + this._radius + this._parent._radius,
      );
    }

    if (this._lightSource) {
      this.object.add(this._pointLight);
    }

    this.orbit = new THREE.Object3D();
    this.orbit.add(this.object);

    this.body.userData.celestialBody = this;

    this._parent?.object.add(this.orbit);

    this._parent?._addToSatelliteSet(this);

    this.animation = {
      animationLoop: this.animate,
      animate: new Set(),
    };

    this._parent?.animation.animate.add(this.animation);
  }

  public readonly animate: XRFrameRequestCallback = (time, frame) => {
    this.animation.animate.forEach((a) => a.animationLoop?.(time, frame));
    const delta = this.clock.getDelta();
    if (this._orbitalPeriod === 0 || this.isPaused) return;

    const angle = (2 * Math.PI) / (this._orbitalPeriod / 10);
    const rotation = angle * delta;
    this.orbit.rotateY(rotation);
    this.object.rotateY(-rotation);
  };

  public set distance(distance: number) {
    if (distance < 0 || this._parent === null) {
      return;
    }
    this._distance = distance;
    this.object.position.set(
      0,
      0,
      this._distance + this._radius + this._parent._radius,
    );
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
    if (this._parent !== null) {
      this.object.position.set(
        0,
        0,
        this._distance + this._radius + this._parent._radius,
      );
    }

    this._satelliteSet.forEach((satellite) => {
      satellite.distance = satellite._distance;
    });
  }

  public get radius() {
    return this._radius;
  }

  public set parent(parent: CelestialBody | null) {
    if (this._parent === null)
      throw Error("Cannot change parent of root celestial body");

    this._parent._removeToSatelliteSet(this);
    parent?._addToSatelliteSet(this);

    this._parent = parent;
    this.orbit.parent?.remove(this.orbit);
    parent?.object.add(this.orbit);

    this.distance = this._distance;
  }

  public get parent(): CelestialBody | null {
    return this._parent;
  }

  public set lightSource(lightSource: boolean) {
    if (lightSource && !this._lightSource) {
      this.object.add(this._pointLight);
      this._bodyMaterial.emissive = new THREE.Color(0xffffff);
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

  public set orbitalPeriod(period: number) {
    this._orbitalPeriod = period;
  }

  public get orbitalPeriod() {
    return this._orbitalPeriod;
  }

  public get isPaused(): boolean {
    return this.parent === null ? !!this._isPaused : this.parent.isPaused;
  }

  public set isPaused(isPaused) {
    if (this.parent === null) {
      this._isPaused = isPaused;
    } else {
      this.parent.isPaused = isPaused;
    }
  }

  private _addToSatelliteSet(celestialBody: CelestialBody) {
    this._satelliteSet.add(celestialBody);
  }

  private _removeToSatelliteSet(celestialBody: CelestialBody) {
    this._satelliteSet.delete(celestialBody);
  }

  public export() {
    const { name, radius, distance, lightSource, orbitalPeriod } = this;
    const root: CelestialBodyJSON = {
      name,
      radius,
      distance,
      lightSource,
      orbitalPeriod,
    };

    if (this._satelliteSet.size === 0) {
      return root;
    }

    root.satellites = [];
    this._satelliteSet.forEach((satellite) =>
      root.satellites?.push(satellite.export()),
    );

    return root;
  }

  private static _import(
    {
      name,
      distance,
      radius,
      lightSource,
      orbitalPeriod,
      satellites,
    }: CelestialBodyJSON,
    parent: CelestialBody | null,
  ) {
    const body = new CelestialBody({
      name,
      distance,
      radius,
      lightSource,
      orbitalPeriod,
      parent,
    });

    satellites?.forEach((satellite) => CelestialBody._import(satellite, body));

    return body;
  }

  public static import(content: string) {
    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      console.error("parse error");
      return null;
    }
    const result = celestialBodyJSONSchema.safeParse(json);
    if (!result.success) {
      console.error("failed to validate");
      return null;
    }

    const root = result.data;
    return CelestialBody._import(root, null);
  }

  public getCelestialSystem() {
    const celestialSystem: CelestialBody[] = [this];
    this._satelliteSet.forEach((satellite) =>
      celestialSystem.push(...satellite.getCelestialSystem()),
    );

    return celestialSystem;
  }

  public set texture(texture: THREE.Texture) {
    this._bodyMaterial.map = texture;
    this._bodyMaterial.emissiveMap = texture;
    this._bodyMaterial.needsUpdate = true;
  }
}
