import { useEffect } from "react";
import CelestialBodyList from "./components/celestial-body-selector";
import SelectedBodyMenu from "./components/selected-body-menu";
import { useSelectedBody } from "./components/selected-body-provider";
import { SystemScene } from "./three/init";

function App() {
  const { setSelectedBody } = useSelectedBody();
  useEffect(() => {
    setSelectedBody(SystemScene.instance.celestialSystemRoot);
  }, []);
  return (
    <>
      <SelectedBodyMenu />
      <CelestialBodyList />
    </>
  );
}

export default App;
