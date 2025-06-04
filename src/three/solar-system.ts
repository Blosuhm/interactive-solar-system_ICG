import CelestialBody from "./celestial-body";

const sun = new CelestialBody({
  name: "Sun",
  distance: 0,
  radius: 10,
  lightSource: true,
  orbitalPeriod: 0,
});

new CelestialBody({
  name: "Mercury",
  color: 0xff0000,
  distance: 10,
  radius: 1,
  orbitalPeriod: 88,
  parent: sun,
});

new CelestialBody({
  name: "Venus",
  distance: 20,
  radius: 2.48,
  orbitalPeriod: 225,
  parent: sun,
});

const earth = new CelestialBody({
  name: "Earth",
  distance: 26,
  radius: 2.61,
  orbitalPeriod: 365,
  parent: sun,
});

new CelestialBody({
  name: "Moon",
  distance: 3,
  radius: 0.712,
  orbitalPeriod: 27.3,
  parent: earth,
});

new CelestialBody({
  name: "Mars",
  distance: 32,
  radius: 1.39,
  orbitalPeriod: 687,
  parent: sun,
});

new CelestialBody({
  name: "Jupiter",
  distance: 38,
  radius: 5,
  orbitalPeriod: 800,
  parent: sun,
});

new CelestialBody({
  name: "Saturn",
  distance: 54,
  radius: 4.3,
  orbitalPeriod: 1074,
  parent: sun,
});

new CelestialBody({
  name: "Uranus",
  distance: 60,
  radius: 3,
  orbitalPeriod: 3058,
  parent: sun,
});

new CelestialBody({
  name: "Neptune",
  distance: 68,
  radius: 2.8,
  orbitalPeriod: 5980,
  parent: sun,
});

export { sun };
