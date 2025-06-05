import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CelestialSystemProvider } from "./components/celestial-system-provider.tsx";
import { SelectedBodyProvider } from "./components/selected-body-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SelectedBodyProvider>
      <CelestialSystemProvider>
        <App />
      </CelestialSystemProvider>
    </SelectedBodyProvider>
  </StrictMode>,
);
