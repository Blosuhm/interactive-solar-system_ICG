import { Button } from "./components/ui/button";
import { Slider } from "./components/ui/slider";
import { useSelectedBody } from "./hooks/use-selected-body";
import CelestialBody from "./three/celestial-body";
import { SystemScene } from "./three/init";
import { solarSystem } from "./three/solar-system";

const { camera, controls } = SystemScene.instance;

function App() {
  const { selectedBody, setSelectedBody } = useSelectedBody();

  const handleOnClick = (celestialBody: CelestialBody) => {
    camera.parent?.remove(camera);
    if (celestialBody.parent !== null) {
      celestialBody.object?.add(camera);
    }
    controls.orbit(celestialBody.object, 4 * celestialBody.radius);
    setSelectedBody(celestialBody);
  };
  return (
    <>
      <SelectedBodyMenu selectedBody={selectedBody} />
      <CelestialBodyList handleOnClick={handleOnClick} />
    </>
  );
}

type SelectedBodyMenuProps = {
  selectedBody: CelestialBody | null;
};

function SelectedBodyMenu({ selectedBody }: SelectedBodyMenuProps) {
  if (selectedBody === null) return null;
  return (
    <aside className="text-foreground absolute top-8 left-8 rounded-md border-2 border-white bg-black/70 p-4">
      <p className="text-xl font-semibold">{selectedBody.name}</p>
      {selectedBody.parent !== null && (
        <>
          <p className="text-lg">Distance to parent</p>
          <Slider
            defaultValue={[selectedBody.distance]}
            onValueChange={(value) => {
              const prevDistance = selectedBody.distance;
              selectedBody.distance = value[0];
              // controls.updateDistance(selectedBody.distance - prevDistance);
            }}
            min={0}
            max={100000}
            step={1}
          />
        </>
      )}
    </aside>
  );
}

type CelestialBodyListProps = {
  handleOnClick(celestialBody: CelestialBody): void;
};

function CelestialBodyList({ handleOnClick }: CelestialBodyListProps) {
  return (
    <aside className="absolute top-8 right-8 w-32 space-y-4">
      {solarSystem.map((celestialBody) => {
        return (
          <Button
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

export default App;
