import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import Gate from "./Gate.jsx";
import { audio } from "./audio.js";
import "./index.css";

// Carica il manifest degli MP3 (se manca, si va di sola voce sintetica)
audio.load();

/* Service worker: si aggiorna da solo quando pubblichi una nuova versione.
   Non basta però registrarlo: una pagina già aperta continua a eseguire il
   JavaScript vecchio finché non viene ricaricata — sul tablet, dove l'app resta
   aperta o torna dallo sfondo, si poteva restare per giorni su una versione
   vecchia (le correzioni pubblicate sembravano "non applicate").
   Quindi: ricontrolliamo se c'è una versione nuova all'avvio, ogni ora e ogni
   volta che l'app torna in primo piano; e quando il nuovo service worker
   prende il controllo, ricarichiamo una volta sola. */
let ricaricando = false;
const avevaControllo = "serviceWorker" in navigator && !!navigator.serviceWorker.controller;

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, r) {
    if (!r) return;
    const controlla = () => { r.update().catch(() => {}); };
    setInterval(controlla, 60 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") controlla();
    });
  },
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!avevaControllo || ricaricando) return; // 1ª installazione: nessun reload
    ricaricando = true;
    window.location.reload();
  });
}

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
