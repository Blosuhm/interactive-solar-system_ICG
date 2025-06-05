import { limits } from "@/configs";
import CelestialBody, { celestialBodyRecord } from "@/three/celestial-body";
import { SelectValue } from "@radix-ui/react-select";
import { Pencil, PencilOff, Trash2 } from "lucide-react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCelestialSystem } from "./celestial-system-provider";
import { useSelectedBody } from "./selected-body-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

export default function SelectedBodyMenu() {
  const { selectedBody, setSelectedBody } = useSelectedBody();
  const { refreshCelestialSystem } = useCelestialSystem();
  if (selectedBody === null) return null;
  return (
    <aside className="text-foreground absolute top-8 bottom-8 left-8 w-96 space-y-4 overflow-scroll rounded-md border-2 border-white bg-black/70 p-4">
      <div className="grid grid-cols-2 gap-2">
        <NameEditor selectedBody={selectedBody} />
        <LightSourceEditor selectedBody={selectedBody} />
      </div>
      <ParentEditor selectedBody={selectedBody} />
      <RadiusEditor selectedBody={selectedBody} />
      <DistanceEditor selectedBody={selectedBody} />
      <PeriodEditor selectedBody={selectedBody} />
      <TextureEditor selectedBody={selectedBody} />
      {selectedBody.parent !== null && (
        <Button
          type="button"
          variant="destructive"
          className="cursor-pointer"
          onClick={() => {
            setSelectedBody(selectedBody.parent);
            selectedBody.parent = null;
            refreshCelestialSystem();
          }}
        >
          <Trash2 />
          Delete
        </Button>
      )}
    </aside>
  );
}

type SelectedBodyProp = {
  selectedBody: CelestialBody;
};

function NameEditor({ selectedBody }: SelectedBodyProp) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(selectedBody.name);
  const { refreshCelestialSystem } = useCelestialSystem();
  useEffect(() => {
    setName(selectedBody.name);
  }, [selectedBody.name]);

  const updateName = (name: string) => {
    setName(name);
    refreshCelestialSystem();
  };

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
            updateName(event.target.value);
          }}
          onBlur={() => {
            const text = name.trim();
            if (text.length > 0) {
              selectedBody.name = text;
              updateName(text);
            } else {
              updateName(selectedBody.name);
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

function RadiusEditor({ selectedBody }: SelectedBodyProp) {
  const [radius, setRadius] = useState(selectedBody.radius);
  useEffect(() => {
    setRadius(selectedBody.radius);
  }, [selectedBody.radius]);

  const { min, max } = limits.radius;

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
          min={min}
          max={max}
          step={0.1}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(radius * 100) / 100}
          onChange={(ev) => {
            let newRadius = parseFloat(ev.target.value);
            if (newRadius > max) newRadius = max;
            else if (newRadius < min) newRadius = min;

            selectedBody.radius = newRadius;
            setRadius(newRadius);
          }}
        />
      </div>
    </div>
  );
}

function DistanceEditor({ selectedBody }: SelectedBodyProp) {
  const [distance, setDistance] = useState(selectedBody.distance);
  const { min, max } = limits.distance;
  useEffect(() => {
    setDistance(selectedBody.distance);
  }, [selectedBody.distance]);
  if (selectedBody.parent === null) return null;

  return (
    <div className="space-y-2">
      <p className="text-lg">Distance to Parent:</p>
      <div className="flex gap-2">
        <Slider
          value={[distance * 100]}
          onValueChange={(value) => {
            selectedBody.distance = value[0] / 100;
            setDistance(value[0] / 100);
          }}
          min={min * 100}
          max={max * 100}
          step={1}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(distance * 100) / 100}
          onChange={(ev) => {
            let newDistance = parseFloat(ev.target.value);
            if (newDistance > max) newDistance = max;
            else if (newDistance < min) newDistance = min;

            selectedBody.distance = newDistance;
            setDistance(newDistance);
          }}
        />
      </div>
    </div>
  );
}

function PeriodEditor({ selectedBody }: SelectedBodyProp) {
  const [period, setPeriod] = useState(selectedBody.orbitalPeriod);
  const { min, max } = limits.orbitalPeriod;
  useEffect(() => {
    setPeriod(selectedBody.orbitalPeriod);
  }, [selectedBody.orbitalPeriod]);
  if (selectedBody.parent === null) return null;

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
          min={min}
          max={max}
          step={0.01}
        />
        <Input
          className="w-[9rem]"
          type="number"
          value={Math.round(period * 100) / 100}
          onChange={(ev) => {
            let newPeriod = parseFloat(ev.target.value);
            if (newPeriod > max) newPeriod = max;
            else if (newPeriod < min) newPeriod = min;

            selectedBody.orbitalPeriod = newPeriod;
            setPeriod(newPeriod);
          }}
        />
      </div>
    </div>
  );
}
function TextureEditor({ selectedBody }: SelectedBodyProp) {
  const fileInputRef = useRef<ComponentRef<"input">>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  return (
    <div>
      <p className="text-lg">Texture:</p>
      <Button onClick={handleButtonClick}>Upload Image</Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(event) => {
          if (event.target.files === null) return;
          const file = event.target.files[0];
          if (file !== null) {
            const reader = new FileReader();
            reader.onload = function (e) {
              const image = new Image();
              image.onload = function () {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                selectedBody.texture = texture;
              };
              if (e.target !== null && typeof e.target.result === "string") {
                image.src = e.target.result;
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
}
