import { textureMapping } from "@/configs/textures";
import CelestialBody from "./celestial-body";

const sun = new CelestialBody({
  name: "Sun",
  distance: 0,
  radius: 10,
  lightSource: true,
  orbitalPeriod: 0,
  textureSrc: textureMapping.get("Sun")!.src,
});

new CelestialBody({
  name: "Mercury",
  distance: 10,
  radius: 1,
  orbitalPeriod: 88,
  parent: sun,
  textureSrc: textureMapping.get("Mercury")!.src,
});

new CelestialBody({
  name: "Venus",
  distance: 20,
  radius: 2.48,
  orbitalPeriod: 225,
  parent: sun,
  textureSrc: textureMapping.get("Venus")!.src,
});

const earth = new CelestialBody({
  name: "Earth",
  distance: 26,
  radius: 2.61,
  orbitalPeriod: 365,
  parent: sun,
  textureSrc: textureMapping.get("Earth")!.src,
});

new CelestialBody({
  name: "Moon",
  distance: 3,
  radius: 0.712,
  orbitalPeriod: 27.3,
  parent: earth,
  textureSrc: textureMapping.get("Moon")!.src,
});

new CelestialBody({
  name: "Mars",
  distance: 32,
  radius: 1.39,
  orbitalPeriod: 687,
  parent: sun,
  textureSrc: textureMapping.get("Mars")!.src,
});

new CelestialBody({
  name: "Jupiter",
  distance: 38,
  radius: 5,
  orbitalPeriod: 800,
  parent: sun,
  textureSrc: textureMapping.get("Jupiter")!.src,
});

new CelestialBody({
  name: "Saturn",
  distance: 54,
  radius: 4.3,
  orbitalPeriod: 1074,
  parent: sun,
  textureSrc: textureMapping.get("Saturn")!.src,
});

new CelestialBody({
  name: "Uranus",
  distance: 60,
  radius: 3,
  orbitalPeriod: 3058,
  parent: sun,
  textureSrc: textureMapping.get("Uranus")!.src,
});

new CelestialBody({
  name: "Neptune",
  distance: 68,
  radius: 2.8,
  orbitalPeriod: 5980,
  parent: sun,
  textureSrc: textureMapping.get("Neptune")!.src,
});

export { sun };
