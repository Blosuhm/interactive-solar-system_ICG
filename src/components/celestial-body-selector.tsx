import { cn, downloadFile } from "@/lib/utils";
import CelestialBody from "@/three/celestial-body";
import { SystemScene } from "@/three/init";
import { solarSystem, solarSystemRoot } from "@/three/solar-system";
import { FileDown, FileUp, Pause, Play } from "lucide-react";
import { ComponentRef, useRef, useState } from "react";
import { useSelectedBody } from "./selected-body-provider";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const { controls } = SystemScene.instance;

export default function CelestialBodyList() {
  const { setSelectedBody } = useSelectedBody();
  const handleOnClick = (celestialBody: CelestialBody) => {
    setSelectedBody(celestialBody);
    controls.orbit(celestialBody.object, 4 * celestialBody.radius);
  };
  const [isPaused, setIsPaused] = useState(() => solarSystemRoot.isPaused);
  const toggleBodyRotation = () => {
    solarSystemRoot.isPaused = !solarSystemRoot.isPaused;
    setIsPaused(solarSystemRoot.isPaused);
  };

  const fileInputRef = useRef<ComponentRef<"input">>(null);

  return (
    <aside className="absolute top-8 right-8 flex gap-8">
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        onChange={async (e) => {
          if (e.target.files === null || e.target.files.length === 0) return;
          const file = e.target.files[0];
          const content = await file.text();
          console.log(CelestialBody.import(content));
        }}
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        <FileUp />
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          downloadFile(
            `planetary-system-${Date.now()}.json`,
            JSON.stringify(solarSystemRoot.export(), undefined, 2),
          )
        }
      >
        <FileDown />
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="relative cursor-pointer"
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
      <ul className="w-32 space-y-4">
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
      </ul>
    </aside>
  );
}
