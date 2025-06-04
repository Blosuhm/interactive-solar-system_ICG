import { useEffect, useState } from "react";
import * as THREE from "three";

const manager = new THREE.LoadingManager();

manager.onLoad = () => {
  console.log("loaded");
};

export default function Loading() {
  const [width, setWidth] = useState("1%");
  useEffect(() => {
    manager.onProgress = (_, loaded, total) => {
      console.log("updating");
      setWidth(`${(loaded / total) * 100}%`);
    };
    console.log("hi");
  }, []);
  return (
    <div className="absolute inset-0 z-9999 grid place-items-center bg-black">
      <div className="space-y-2">
        <p className="text-center text-3xl font-bold text-white">Loading...</p>
        <div className="w-64 border border-white p-1">
          <div className="h-4 bg-white" style={{ width }} />
        </div>
      </div>
    </div>
  );
}
