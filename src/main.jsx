import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import { audio } from "./audio.js";
import "./index.css";

// Carica il manifest degli MP3 (se manca, si va di sola voce sintetica)
audio.load();

// Service worker: si aggiorna da solo quando pubblichi una nuova versione
registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
