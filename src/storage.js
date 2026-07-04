/* ─── Progressi persistenti (localStorage) ───
   Sostituisce il vecchio window.storage dell'ambiente sandbox.
   Struttura: { gems, stars: {islandId: {gameKey: 0..3}}, weak: {word: n} } */

const STORAGE_KEY = "silvana-progress-v2";
const DEFAULT_PROGRESS = { gems: 0, stars: {}, weak: {} };

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    /* primo avvio o storage non disponibile */
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Salvataggio progressi fallito", e);
  }
}
