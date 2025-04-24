import CelestialBody from "@/three/celestial-body";
import { SystemScene } from "@/three/init";
import { solarSystem } from "@/three/solar-system";
import { useSelectedBody } from "./selected-body-provider";
import { Button } from "./ui/button";

const { controls } = SystemScene.instance;

export default function CelestialBodyList() {
  const { setSelectedBody } = useSelectedBody();
  const handleOnClick = (celestialBody: CelestialBody) => {
    setSelectedBody(celestialBody);
    controls.orbit(celestialBody.object, 4 * celestialBody.radius);
  };
  return (
    <aside className="absolute top-8 right-8 w-32 space-y-4">
      {solarSystem.map((celestialBody) => {
        return (
          <Button
            size="sm"
            key={celestialBody.name}
            className="w-full"
            onClick={() => handleOnClick(celestialBody)}
          >
            {celestialBody.name}
          </Button>
        );
      })}
    </aside>
  );
}
