export const textures = [
  { name: "Venus", src: "4k_venus_atmosphere.jpg" },
  { name: "Venus2", src: "8k_venus_surface.jpg" },
  { name: "Neptune", src: "2k_neptune.jpg" },
  { name: "Uranus", src: "2k_uranus.jpg" },
  { name: "Earth", src: "8k_earth_daymap.jpg" },
  { name: "Jupiter", src: "8k_jupiter.jpg" },
  { name: "Mars", src: "8k_mars.jpg" },
  { name: "Mercury", src: "8k_mercury.jpg" },
  { name: "Moon", src: "8k_moon.jpg" },
  { name: "Saturn", src: "8k_saturn.jpg" },
  { name: "Sun", src: "8k_sun.jpg" },
  { name: "Ceres", src: "4k_ceres_fictional.jpg" },
  { name: "Eris", src: "4k_eris_fictional.jpg" },
  { name: "Haumea", src: "4k_haumea_fictional.jpg" },
  { name: "Makemake", src: "4k_makemake_fictional.jpg" },
] as const;

export const textureMapping = new Map<
  (typeof textures)[number]["name"],
  (typeof textures)[number]
>();
textures.forEach((t) => textureMapping.set(t.name, t));
