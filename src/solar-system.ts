// NOTE: All distances considered in this file are relative do the radius of
// mercury, that is, the radius of mercury is considered to be one unit of
// distance.

import CelestialBody from "./celestial-body";

const sun = new CelestialBody({
  name: "Sun",
  distance: 0,
  radius: 285.08,
  lightSource: true,
  orbitalPeriod: 0,
});

const mercury = new CelestialBody({
  name: "Mercury",
  color: 0xff0000,
  distance: 23773.41,
  radius: 1,
  orbitalPeriod: 88,
  parent: sun,
});

const venus = new CelestialBody({
  name: "Venus",
  distance: 44267.74,
  radius: 2.48,
  orbitalPeriod: 225,
  parent: sun,
});

const earth = new CelestialBody({
  name: "Earth",
  distance: 62302.74,
  radius: 2.61,
  orbitalPeriod: 365,
  parent: sun,
});

const mars = new CelestialBody({
  name: "Mars",
  distance: 93454.11,
  radius: 1.39,
  orbitalPeriod: 687,
  parent: sun,
});

const jupiter = new CelestialBody({
  name: "Jupiter",
  distance: 319301.55,
  radius: 28.66,
  orbitalPeriod: 4331,
  parent: sun,
});

const saturn = new CelestialBody({
  name: "Saturn",
  distance: 586137.64,
  radius: 23.87,
  orbitalPeriod: 10747,
  parent: sun,
});

const uranus = new CelestialBody({
  name: "Uranus",
  distance: 1180473.01,
  radius: 23.87,
  orbitalPeriod: 30589,
  parent: sun,
});

const neptune = new CelestialBody({
  name: "Neptune",
  distance: 1844489.08,
  radius: 23.87,
  orbitalPeriod: 59800,
  parent: sun,
});

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
