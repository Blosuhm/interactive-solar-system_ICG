import { names } from "@/configs/names";
import { textures } from "@/configs/textures";
import CelestialBody from "./celestial-body";

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomBool(probability = 0.5) {
  return Math.random() < probability;
}

export class RandomSystemGenerator {
  private static rootLimits = {
    radius: { min: 7, max: 15 },
  };

  private static planetLimits = {
    radius: {
      min: 1,
      max: 10,
    },
    distance: { min: 0, max: 100 },
    orbitalPeriod: { min: 200, max: 1500 },
    gap: 1,
  };

  private constructor() {}

  public static generateSystem() {
    const root = this.generateRoot();

    const numberOfPlanets = getRandomInt(3, 7);

    const distancePerPlanet = this.planetLimits.distance.max / numberOfPlanets;

    for (let i = 0; i < numberOfPlanets; i++) {
      const radius = getRandomFloat(
        this.planetLimits.radius.min,
        this.planetLimits.radius.max,
      );

      const distance = getRandomFloat(
        distancePerPlanet * i,
        Math.max(
          distancePerPlanet - this.planetLimits.gap - 2 * radius,
          distancePerPlanet * i,
        ),
      );

      const name = getRandomItem(names);
      // @ts-expect-error: TS doesn't like using tuples as arrays
      const texture = getRandomItem<(typeof textures)[number]>(textures);

      const lightSource = getRandomBool(0.05);

      const orbitalPeriod = getRandomFloat(
        this.planetLimits.orbitalPeriod.min,
        this.planetLimits.orbitalPeriod.max,
      );

      new CelestialBody({
        radius,
        distance,
        name,
        parent: root,
        textureSrc: texture.src,
        lightSource,
        orbitalPeriod,
      });
    }

    return root;
  }

  private static generateRoot() {
    const radius = getRandomFloat(
      this.rootLimits.radius.min,
      this.rootLimits.radius.max,
    );

    const name = getRandomItem(names);
    // @ts-expect-error: TS doesn't like using tuples as arrays
    const texture = getRandomItem<(typeof textures)[number]>(textures);

    return new CelestialBody({
      name,
      textureSrc: texture.src,
      radius,
      distance: 0,
      orbitalPeriod: 0,
      lightSource: true,
    });
  }
}
