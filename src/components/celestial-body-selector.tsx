import { cn, downloadFile } from "@/lib/utils";
import CelestialBody, { celestialBodyRecord } from "@/three/celestial-body";
import { SystemScene } from "@/three/init";
import { RandomSystemGenerator } from "@/three/random-system-generator";
import { Dices, FileDown, FileUp, Pause, Play, Plus } from "lucide-react";
import { ComponentRef, useRef, useState } from "react";
import { useCelestialSystem } from "./celestial-system-provider";
import { useSelectedBody } from "./selected-body-provider";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function CelestialBodyList() {
  const { setSelectedBody } = useSelectedBody();
  const handleOnClick = (celestialBody: CelestialBody) => {
    setSelectedBody(celestialBody);
  };
  const [isPaused, setIsPaused] = useState(
    () => SystemScene.instance.celestialSystemRoot?.isPaused ?? false,
  );

  const toggleBodyRotation = () => {
    const root = SystemScene.instance.celestialSystemRoot;
    if (root === null) return;
    root.isPaused = !root.isPaused;
    setIsPaused(root.isPaused);
  };

  const {
    celestialSystem,
    celestialSystemRoot,
    setCelestialSystemRoot,
    refreshCelestialSystem,
  } = useCelestialSystem();

  const fileInputRef = useRef<ComponentRef<"input">>(null);

  return (
    <aside className="absolute top-8 right-8 bottom-8 grid grid-cols-2 grid-rows-[auto_auto_1fr] gap-2 overflow-hidden">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="relative w-full cursor-pointer"
            onClick={toggleBodyRotation}
          >
            <Pause
              className={cn("transition-opacity", {
                "opacity-0": isPaused,
              })}
            />
            <div className="absolute inset-0 grid place-items-center">
              <Play
                className={cn("opacity-0 transition-opacity", {
                  "opacity-100": isPaused,
                })}
              />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isPaused ? "Unpause" : "Pause"} System</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            className="w-full"
            onClick={() => {
              celestialBodyRecord.clear();
              setCelestialSystemRoot(RandomSystemGenerator.generateSystem());
            }}
          >
            <Dices />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Generate random celestial system</TooltipContent>
      </Tooltip>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        onChange={async (e) => {
          if (e.target.files === null || e.target.files.length === 0) return;
          const file = e.target.files[0];
          const content = await file.text();
          celestialBodyRecord.clear();
          const newSystem = CelestialBody.import(content);
          if (newSystem !== null) setCelestialSystemRoot(newSystem);
        }}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import celestial system from file</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            onClick={() =>
              downloadFile(
                `planetary-system-${Date.now()}.json`,
                JSON.stringify(celestialSystemRoot.export(), undefined, 2),
              )
            }
          >
            <FileDown />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Export celestial system to file</TooltipContent>
      </Tooltip>
      <ul className="col-span-2 mt-2 h-full w-32 space-y-4 overflow-scroll">
        <li>
          <Button
            className="w-full"
            onClick={() => {
              const newBody = new CelestialBody({
                name: "Body",
                radius: 3,
                distance: 30,
                orbitalPeriod: 100,
                parent: celestialSystemRoot,
              });
              refreshCelestialSystem();
              setSelectedBody(newBody);
            }}
          >
            <Plus /> Add
          </Button>
        </li>
        {celestialSystem.map((celestialBody) => {
          return (
            <li key={celestialBody.name}>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleOnClick(celestialBody)}
              >
                {celestialBody.name}
              </Button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
