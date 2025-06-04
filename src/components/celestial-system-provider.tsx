import CelestialBody from "@/three/celestial-body";
import { SystemScene } from "@/three/init";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type CelestialSystemContext = {
  celestialSystem: CelestialBody[];
  celestialSystemRoot: CelestialBody;
  setCelestialSystemRoot: Dispatch<SetStateAction<CelestialBody>>;
  refreshCelestialSystem(): void;
};

const CelestialSystemContext = createContext<CelestialSystemContext>(
  undefined!,
);

export function CelestialSystemProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [celestialSystemRoot, setCelestialSystemRoot] = useState(
    () => SystemScene.instance.celestialSystemRoot,
  );
  const [celestialSystem, setCelestialSystem] = useState(() =>
    SystemScene.instance.celestialSystemRoot.getCelestialSystem(),
  );

  const refreshCelestialSystem = useCallback(() => {
    setCelestialSystem(celestialSystemRoot.getCelestialSystem());
  }, [celestialSystemRoot, setCelestialSystem]);

  useEffect(() => {
    refreshCelestialSystem();
    SystemScene.instance.celestialSystemRoot = celestialSystemRoot;
  }, [celestialSystemRoot, refreshCelestialSystem]);

  return (
    <CelestialSystemContext.Provider
      value={{
        celestialSystem,
        celestialSystemRoot,
        setCelestialSystemRoot,
        refreshCelestialSystem,
      }}
    >
      {children}
    </CelestialSystemContext.Provider>
  );
}

export function useCelestialSystem() {
  return useContext(CelestialSystemContext);
}
