# Cartella audio 🎙️

Qui vanno gli MP3 generati con il **generatore audio** (voce ElevenLabs).

## Come popolarla

1. Avvia il progetto: `npm run dev`.
2. Apri **http://localhost:5173/generatore.html**.
3. Incolla la tua **API key ElevenLabs** → *Carica le tue voci* → scegli la
   voce (per coerenza usa la **stessa** delle isole 1–6) → *Prova la voce*.
4. Premi *Genera* (~671 clip, ~10k caratteri) e attendi.
5. Scarica `isola-magica-audio.zip`.
6. Estrai lo ZIP: contiene una cartella **`audio/`** con dentro `manifest.json`
   e tutti gli `.mp3`. **Trascina quella cartella `audio/` in `public/`**
   (sovrascrivi), così da avere:

   ```
   public/audio/
   ├── manifest.json          ← mappa frase ↔ file
   ├── word_red.mp3
   ├── prompt_gem_red.mp3
   ├── prompt_simon_run.mp3
   └── … (~671 file)
   ```

> Il gioco carica `audio/manifest.json` all'avvio e associa ogni frase al suo
> MP3. **Se un file manca — o se questa cartella è vuota — parte comunque**:
> usa la voce sintetica del dispositivo (`speechSynthesis`) come riserva.

## Note

- Gli MP3 vengono messi in cache dal service worker **man mano che si giocano**
  (strategia `CacheFirst`), quindi diventano disponibili offline dopo il primo
  ascolto. Non sono pre-scaricati tutti insieme per non appesantire il primo avvio.
- Se rigeneri le clip, mantieni la **stessa voce e impostazioni** (Stability 0.55
  / Style 0.30) per non sentire lo stacco tra vecchie e nuove clip.
