import CelestialBody from "@/three/celestial-body";
import { useState } from "react";

export function useSelectedBody() {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);

  return { selectedBody };
}
