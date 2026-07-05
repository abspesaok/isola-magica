/* ═══════════════════════════════════════════════════════════
   MICROFONO — riconoscimento vocale in inglese (Web Speech API)
   Supportato da Chrome/Edge/Android e Safari iOS 14.5+.
   Dove non c'è, il gioco usa una modalità "ripeti" auto-valutata.
   ═══════════════════════════════════════════════════════════ */

export function micSupported() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* Ascolta una frase e restituisce le alternative riconosciute (array) o null.
   onState riceve: "listening" | "done" | "error" | "idle" | "unsupported".
   Ritorna una funzione per interrompere l'ascolto. */
export function listenOnce({ onResult, onState, lang = "en-US" } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onState && onState("unsupported");
    onResult && onResult(null);
    return () => {};
  }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 4;
  rec.continuous = false;

  let finished = false;
  const finish = (val) => {
    if (finished) return;
    finished = true;
    onResult && onResult(val);
  };

  rec.onstart = () => onState && onState("listening");
  rec.onresult = (e) => {
    const alts = [];
    for (let i = 0; i < e.results.length; i++) {
      for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
    }
    onState && onState("done");
    finish(alts);
  };
  rec.onerror = () => {
    onState && onState("error");
    finish(null);
  };
  rec.onend = () => {
    onState && onState("idle");
    if (!finished) finish(null); // nessun risultato
  };

  try {
    rec.start();
  } catch (e) {
    onState && onState("error");
    finish(null);
  }
  return () => {
    try {
      rec.stop();
    } catch (e) {
      /* ignore */
    }
  };
}

/* True se una delle alternative riconosciute combacia col target.
   Tollerante: uguaglianza, inclusione, o tutte le parole target presenti. */
export function matchesSpoken(alternatives, target) {
  if (!alternatives || !alternatives.length) return false;
  const t = norm(target);
  if (!t) return false;
  const tWords = t.split(" ").filter(Boolean);
  return alternatives.some((alt) => {
    const a = norm(alt);
    if (!a) return false;
    if (a === t) return true;
    if (a.includes(t) || t.includes(a)) return true;
    const aWords = a.split(" ");
    return tWords.every((w) => aWords.includes(w));
  });
}
