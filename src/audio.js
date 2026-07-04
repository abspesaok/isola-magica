/* ═══════════════════════════════════════════════════════════
   MOTORE AUDIO DEL REGNO
   - Carica public/audio/manifest.json  → mappa  testo → file MP3
   - speak(...frasi) riproduce le clip in sequenza
   - Se un file manca (o la cartella audio non c'è ancora) → fallback
     automatico su speechSynthesis (voce del sistema, in inglese)
   Il gioco chiama sempre e solo speak(...): non deve sapere se sta
   suonando un MP3 di ElevenLabs o la voce sintetica.
   ═══════════════════════════════════════════════════════════ */

// Rispetta la base di Vite ("/" in locale, "/<repo>/" su GitHub Pages)
const AUDIO_BASE = `${import.meta.env.BASE_URL}audio/`;

// WAV silenzioso di ~1 frame: serve a "sbloccare" l'audio su iOS/Android
// (il primo play va fatto dentro un gesto dell'utente).
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=";

/* Normalizza una frase per il confronto col manifest:
   minuscolo, via la punteggiatura, spazi compattati.
   "Find the red gem!"  →  "find the red gem"          */
function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

class AudioEngine {
  constructor() {
    this.map = new Map(); // testo normalizzato → nome file
    this.ready = false; // true quando il manifest è caricato con clip
    this.voice = null; // voce inglese scelta per il fallback
    this.token = 0; // per annullare sequenze superate
    this._current = null; // elemento <audio> in riproduzione
    this._stop = null; // interrompe la clip corrente (audio o voce)
    this._initVoices();
  }

  /* Carica il manifest degli MP3. Silenzioso se assente. */
  async load() {
    try {
      const res = await fetch(`${AUDIO_BASE}manifest.json`, { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const m of data) {
          if (m && m.file && m.text) this.map.set(normalize(m.text), m.file);
        }
      }
      this.ready = this.map.size > 0;
    } catch (e) {
      /* niente cartella audio: si resta sulla voce sintetica */
    }
  }

  _initVoices() {
    const pick = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      this.voice =
        vs.find((v) => v.lang === "en-US" && /female|samantha|zira|aria|jenny/i.test(v.name)) ||
        vs.find((v) => v.lang === "en-US") ||
        vs.find((v) => v.lang?.startsWith("en")) ||
        null;
    };
    pick();
    window.speechSynthesis?.addEventListener?.("voiceschanged", pick);
  }

  /* Va chiamato DENTRO un tap dell'utente (il portale d'ingresso al Regno):
     sblocca sia l'elemento <audio> sia speechSynthesis sui browser mobile. */
  unlock() {
    try {
      const a = new Audio(SILENT_WAV);
      a.volume = 0;
      a.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
    try {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.resume();
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis?.speak(u);
    } catch (e) {
      /* ignore */
    }
  }

  /* Interrompe tutto quello che sta suonando ora. */
  cancel() {
    this.token++;
    try {
      window.speechSynthesis?.cancel();
    } catch (e) {
      /* ignore */
    }
    if (this._stop) {
      const stop = this._stop;
      this._stop = null;
      stop();
    }
  }

  _playFile(file) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        a.onended = null;
        a.onerror = null;
        if (this._current === a) this._current = null;
        resolve(ok);
      };
      const a = new Audio(`${AUDIO_BASE}${file}`);
      this._current = a;
      this._stop = () => {
        try {
          a.pause();
        } catch (e) {
          /* ignore */
        }
        finish(false);
      };
      a.onended = () => finish(true);
      a.onerror = () => finish(false);
      a.play().catch(() => finish(false));
    });
  }

  _speakSynth(text) {
    if (!window.speechSynthesis) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.85;
      u.pitch = 1.15;
      if (this.voice) u.voice = this.voice;
      u.onend = finish;
      u.onerror = finish;
      this._stop = finish;
      try {
        window.speechSynthesis.speak(u);
      } catch (e) {
        finish();
      }
    });
  }

  /* Riproduce una o più frasi in sequenza.
     Ogni frase: se ha un MP3 nel manifest → clip di ElevenLabs,
     altrimenti → voce sintetica. Le frasi vuote/null sono ignorate. */
  async speak(...phrases) {
    const parts = phrases
      .flat()
      .filter((p) => p != null && String(p).trim() !== "");
    if (parts.length === 0) return;

    this.cancel();
    const myToken = this.token;

    for (const phrase of parts) {
      if (myToken !== this.token) return; // una nuova speak() ci ha superato
      const file = this.ready ? this.map.get(normalize(phrase)) : null;
      if (file) {
        const ok = await this._playFile(file);
        if (myToken !== this.token) return;
        if (!ok) await this._speakSynth(phrase); // MP3 assente/rotto → voce
      } else {
        await this._speakSynth(phrase);
      }
      if (myToken !== this.token) return;
    }
  }
}

export const audio = new AudioEngine();

/* Funzione stabile usata in tutto il gioco (import diretto). */
export const speak = (...args) => audio.speak(...args);
