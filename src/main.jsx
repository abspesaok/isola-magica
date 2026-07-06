import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import Gate from "./Gate.jsx";
import { audio } from "./audio.js";
import "./index.css";

// Carica il manifest degli MP3 (se manca, si va di sola voce sintetica)
audio.load();

// Service worker: si aggiorna da solo quando pubblichi una nuova versione
registerSW({ immediate: true });

// NB: niente <StrictMode>. In dev raddoppiava il montaggio dei componenti,
// facendo partire due prompt audio all'inizio di ogni gioco (bug solo di
// sviluppo; in produzione non accadeva). Così dev e produzione coincidono.
// <Gate> chiede il codice famiglia prima di mostrare il gioco. App non viene
// nemmeno montata finché non si sblocca (nessun audio parte dietro al cancello).
createRoot(document.getElementById("root")).render(
  <Gate>
    <App />
  </Gate>
);
