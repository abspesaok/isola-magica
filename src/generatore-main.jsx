/* Entry SOLO per sviluppo: apre il generatore audio ElevenLabs.
   Uso: npm run dev → http://localhost:5173/generatore.html
   Non finisce nel build di produzione (index.html è l'unica entry buildata). */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Generatore from "../reference/generatore-audio-regno.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Generatore />
  </StrictMode>
);
