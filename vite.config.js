import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: { allowedHosts: ["laptop.neko-nominal.ts.net"] },
  base: "/interactive-solar-system_ICG/",
});
