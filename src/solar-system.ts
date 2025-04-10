// NOTE: All distances considered in this file are relative do the radius of
// mercury, that is, the radius of mercury is considered to be one unit of
// distance.

import * as THREE from "three";

type CelestialBody = {
  radius: number;
  texture?: undefined;
  color: number;
  lightSource?: boolean;
  name: string;
  object3d?: THREE.Object3D;
} & (
  | {
      hasParent: true;
      parent: CelestialBody;
      distanceToParent: number;
      period: number;
      orbit?: THREE.Object3D;
    }
  | { hasParent: false }
);

const sun: CelestialBody = {
  hasParent: false,
  radius: 285.08,
  color: 0xffffff,
  lightSource: true,
  name: "Sun",
};

const mercury: CelestialBody = {
  hasParent: true,
  radius: 1,
  parent: sun,
  distanceToParent: 23773.41,
  color: 0xaaaaaa,
  period: 88,
  name: "Mercury",
};

const venus: CelestialBody = {
  hasParent: true,
  radius: 2.48,
  parent: sun,
  distanceToParent: 44267.74,
  color: 0xffff00,
  period: 225,
  name: "Venus",
};

const earth: CelestialBody = {
  hasParent: true,
  radius: 2.61,
  parent: sun,
  distanceToParent: 62302.74,
  color: 0x00ff00,
  period: 365,
  name: "Earth",
};

const mars: CelestialBody = {
  hasParent: true,
  radius: 1.39,
  parent: sun,
  distanceToParent: 93454.11,
  color: 0xff0000,
  period: 687,
  name: "Mars",
};

const jupiter: CelestialBody = {
  hasParent: true,
  radius: 28.66,
  parent: sun,
  distanceToParent: 319301.55,
  color: 0xcd853f,
  period: 4331,
  name: "Jupiter",
};

const saturn: CelestialBody = {
  hasParent: true,
  radius: 23.87,
  parent: sun,
  distanceToParent: 586137.64,
  color: 0xffdead,
  period: 10747,
  name: "Saturn",
};

const uranus: CelestialBody = {
  hasParent: true,
  radius: 23.87,
  parent: sun,
  distanceToParent: 1180473.01,
  color: 0x20b2aa,
  period: 30589,
  name: "Uranus",
};

const neptune: CelestialBody = {
  hasParent: true,
  radius: 23.87,
  parent: sun,
  distanceToParent: 1844489.08,
  color: 0x0000ff,
  period: 59800,
  name: "Neptune",
};

export const solarSystem: CelestialBody[] = [
  sun,
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
];
