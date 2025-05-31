import CelestialBody, { celestialBodyRecord } from "@/three/celestial-body";
import { SelectValue } from "@radix-ui/react-select";
import { Pencil, PencilOff } from "lucide-react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { useSelectedBody } from "./selected-body-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

export default function SelectedBodyMenu() {
  const { selectedBody } = useSelectedBody();
  if (selectedBody === null) return null;
  return (
    <aside className="text-foreground absolute top-8 left-8 w-96 space-y-4 rounded-md border-2 border-white bg-black/70 p-4">
      <div className="grid grid-cols-2 gap-2">
        <NameEditor selectedBody={selectedBody} />
        <LightSourceEditor selectedBody={selectedBody} />
      </div>
      <ParentEditor selectedBody={selectedBody} />
      <RadiusEditor selectedBody={selectedBody} />
      <DistanceEditor selectedBody={selectedBody} />
      <PeriodEditor selectedBody={selectedBody} />
      <TextureEditor selectedBody={selectedBody} />
    </aside>
  );
}

type SelectedBodyProp = {
  selectedBody: CelestialBody;
};

function NameEditor({ selectedBody }: SelectedBodyProp) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(selectedBody.name);
  useEffect(() => {
    setName(selectedBody.name);
  }, [selectedBody.name]);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const inputRef = useRef<ComponentRef<"input">>(null);

  const enterEditingMode = () => {
    setEditing(true);
  };
  const exitEditingMode = () => {
    setEditing(false);
  };
  if (editing)
    return (
      <div className="flex w-full justify-between gap-1 text-xl font-semibold">
        <Input
          ref={inputRef}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          onBlur={() => {
            const text = name.trim();
            if (text.length > 0) {
              selectedBody.name = text;
              setName(text);
            } else {
              setName(selectedBody.name);
            }
            exitEditingMode();
          }}
          onKeyUp={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={exitEditingMode}
        >
          <PencilOff />
        </Button>
      </div>
    );
  return (
    <div className="flex w-full justify-between text-xl font-semibold">
      <span onDoubleClick={enterEditingMode}>{selectedBody.name}</span>{" "}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={enterEditingMode}
      >
        <Pencil />
      </Button>
    </div>
  );
}

function LightSourceEditor({ selectedBody }: SelectedBodyProp) {
  const [lightSource, setLightSource] = useState(selectedBody.lightSource);
  useEffect(() => {
    setLightSource(selectedBody.lightSource);
  }, [selectedBody.lightSource]);
  return (
    <Label className="ml-auto">
      Emit Light{" "}
      <Switch
        checked={lightSource}
        onCheckedChange={(lightSource) => {
          selectedBody.lightSource = lightSource;
          setLightSource(lightSource);
        }}
      />
    </Label>
  );
}

function ParentEditor({ selectedBody }: SelectedBodyProp) {
  const [parent, setParent] = useState(selectedBody.parent);
  useEffect(() => {
    setParent(selectedBody.parent);
  }, [selectedBody.parent]);
  if (parent === null) return null;
  return (
    <>
      <p className="text-lg">Parent:</p>
      <Select
        value={parent.id.toString()}
        onValueChange={(value) => {
          const id = parseInt(value);
          const body = celestialBodyRecord.get(id);
          if (body === undefined)
            throw new Error(
              "Illegal state reached. Select contains non existing celestial body!",
            );

          selectedBody.parent = body;
          setParent(body);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from(celestialBodyRecord.entries()).map(
            ([id, celestialBody]) => {
              if (id === selectedBody.id) return null;
              return (
                <SelectItem key={id} value={id.toString()}>
                  {celestialBody.name}
                </SelectItem>
              );
            },
          )}
        </SelectContent>
      </Select>
    </>
  );
}

const MIN_RADIUS = 0;
const MAX_RADIUS = 500;

function RadiusEditor({ selectedBody }: SelectedBodyProp) {
  const [radius, setRadius] = useState(selectedBody.radius);
  useEffect(() => {
    setRadius(selectedBody.radius);
  }, [selectedBody.radius]);

  return (
    <div className="space-y-2">
      <p className="text-lg">Radius:</p>
      <div className="flex gap-2">
        <Slider
          value={[radius]}
          onValueChange={(value) => {
            selectedBody.radius = value[0];
            setRadius(value[0]);
          }}
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={1}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(radius * 100) / 100}
          onChange={(ev) => {
            let newRadius = parseFloat(ev.target.value);
            if (newRadius > MAX_RADIUS) newRadius = MAX_RADIUS;
            else if (newRadius < MIN_RADIUS) newRadius = MIN_RADIUS;

            selectedBody.radius = newRadius;
            setRadius(newRadius);
          }}
        />
      </div>
    </div>
  );
}

const MIN = 0;
const MAX = 10000;

function DistanceEditor({ selectedBody }: SelectedBodyProp) {
  const [distance, setDistance] = useState(selectedBody.distance);
  useEffect(() => {
    setDistance(selectedBody.distance);
  }, [selectedBody.distance]);
  if (selectedBody.parent === null) return null;

  const minDistance = selectedBody.parent.radius + selectedBody.radius;
  const min = minDistance > MIN ? minDistance : MIN;
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
          min={min}
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
            else if (newDistance < min) newDistance = min;

            selectedBody.distance = newDistance;
            setDistance(newDistance);
          }}
        />
      </div>
    </div>
  );
}

const MIN_ORBIT = 2;
const MAX_ORBIT = 1000;

function PeriodEditor({ selectedBody }: SelectedBodyProp) {
  const [period, setPeriod] = useState(selectedBody.orbitalPeriod);
  useEffect(() => {
    setPeriod(selectedBody.orbitalPeriod);
  }, [selectedBody.orbitalPeriod]);

  return (
    <div className="space-y-2">
      <p className="text-lg">Orbital Period:</p>
      <div className="flex gap-2">
        <Slider
          value={[period]}
          onValueChange={(value) => {
            selectedBody.orbitalPeriod = value[0];
            setPeriod(value[0]);
          }}
          min={MIN_ORBIT}
          max={MAX_ORBIT}
          step={1}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(period * 100) / 100}
          onChange={(ev) => {
            let newPeriod = parseFloat(ev.target.value);
            if (newPeriod > MAX_ORBIT) newPeriod = MAX_ORBIT;
            else if (newPeriod < MIN_ORBIT) newPeriod = MIN_ORBIT;

            selectedBody.orbitalPeriod = newPeriod;
            setPeriod(newPeriod);
          }}
        />
      </div>
    </div>
  );
}
function TextureEditor({ selectedBody }: SelectedBodyProp) {
  return <p>Texture Editor ({selectedBody.color.getHex()})</p>;
}
