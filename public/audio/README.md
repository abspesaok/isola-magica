# Cartella audio 🎙️

Qui vanno gli MP3 generati con **`generatore-audio-regno.jsx`** (voce ElevenLabs).

## Come popolarla

1. Apri il generatore, inserisci la tua API key ElevenLabs e genera tutte le clip.
2. Scarica `regno-incantato-audio.zip`.
3. Estrai il contenuto **dentro questa cartella**, così da avere:

   ```
   public/audio/
   ├── manifest.json          ← mappa file ↔ frase
   ├── word_red.mp3
   ├── prompt_gem_red.mp3
   ├── sys_welcome.mp3
   └── … (~300 file)
   ```

> Il gioco carica `audio/manifest.json` all'avvio e associa ogni frase al suo
> MP3. **Se un file manca — o se questa cartella è vuota — parte comunque**:
> usa la voce sintetica del dispositivo (`speechSynthesis`) come riserva.

## Note

- Gli MP3 vengono messi in cache dal service worker **man mano che si giocano**
  (strategia `CacheFirst`), quindi diventano disponibili offline dopo il primo
  ascolto. Non sono pre-scaricati tutti insieme per non appesantire il primo avvio.
- Se rigeneri le clip, sostituisci anche `manifest.json`.
