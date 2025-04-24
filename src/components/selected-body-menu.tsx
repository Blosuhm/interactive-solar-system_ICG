import CelestialBody from "@/three/celestial-body";
import { useState } from "react";
import { useSelectedBody } from "./selected-body-provider";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

export default function SelectedBodyMenu() {
  const { selectedBody } = useSelectedBody();
  if (selectedBody === null) return null;
  return (
    <aside className="text-foreground absolute top-8 left-8 w-96 space-y-4 rounded-md border-2 border-white bg-black/70 p-4">
      <NameEditor selectedBody={selectedBody} />
      <ParentEditor selectedBody={selectedBody} />
      <RadiusEditor selectedBody={selectedBody} />
      <DistanceEditor selectedBody={selectedBody} />
      <TextureEditor selectedBody={selectedBody} />
    </aside>
  );
}

type SelectedBodyProp = {
  selectedBody: CelestialBody;
};

function NameEditor({ selectedBody }: SelectedBodyProp) {
  return <p className="text-xl font-semibold">{selectedBody.name}</p>;
}

function ParentEditor({ selectedBody }: SelectedBodyProp) {
  return <p>parent editor</p>;
}

function RadiusEditor({ selectedBody }: SelectedBodyProp) {
  return <p>Radius Editor</p>;
}

const MIN = 0;
const MAX = 10000;

function DistanceEditor({ selectedBody }: SelectedBodyProp) {
  const [distance, setDistance] = useState(selectedBody.distance);
  if (selectedBody.parent === null) return null;
  return (
    <div className="space-y-2">
      <p className="text-lg">Distance to Parent:</p>
      <div className="flex gap-2">
        <Slider
          value={[distance]}
          onValueChange={(value) => {
            selectedBody.distance = value[0];
            setDistance(value[0]);
          }}
          min={MIN}
          max={MAX}
          step={1}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(distance * 100) / 100}
          onChange={(ev) => {
            let newDistance = parseFloat(ev.target.value);
            if (newDistance > MAX) newDistance = MAX;
            else if (newDistance < MIN) newDistance = MIN;

            selectedBody.distance = newDistance;
            setDistance(newDistance);
          }}
        />
      </div>
    </div>
  );
}
function PeriodEditor({ selectedBody }: SelectedBodyProp) {
  return <p>Period Editor</p>;
}
function TextureEditor({ selectedBody }: SelectedBodyProp) {
  return <p>Texture Editor</p>;
}
