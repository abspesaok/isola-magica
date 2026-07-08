/* ─── Forma dei progressi di un profilo ───
   Struttura: { gems, xp, stars:{islandId:{gameKey:0..3}}, weak:{word:n},
                streak, bestStreak, lastPlayed, owned:{id:true},
                equipped:{ me, pet, sky },
                daily:{ date, done }, review:{ en:{ box, seen } } }
   `daily`  = Sfida Giornaliera (Faro della Memoria): un solo bonus al giorno.
   `review` = ripasso dilazionato (Leitner): per ogni parola, scatola 0..5 e
              giorno dell'ultimo ripasso (indice giorno intero).
   La persistenza (multi-profilo) vive in profiles.js. */

export const DEFAULT_EQUIP = { me: "f1", pet: null, sky: "sky_night" };

export const DEFAULT_PROGRESS = {
  gems: 0, // valuta spendibile nel negozio
  xp: 0, // esperienza permanente → livello/titolo
  stars: {},
  weak: {},
  streak: 0, // Fiamma Magica: giorni consecutivi
  bestStreak: 0,
  lastPlayed: null, // "YYYY-MM-DD" dell'ultimo giorno giocato
  owned: {}, // { itemId: true } acquisti del negozio
  equipped: { ...DEFAULT_EQUIP },
  daily: { date: null, done: false }, // Sfida di oggi (bonus una volta al giorno)
  review: {}, // { en: { box:0..5, seen:<indice giorno> } } — ripasso dilazionato
};

/* Progressi vergini per un nuovo profilo, con l'avatar scelto in creazione. */
export function freshProgress(avatarId = "f1") {
  return {
    gems: 0,
    xp: 0,
    stars: {},
    weak: {},
    streak: 0,
    bestStreak: 0,
    lastPlayed: null,
    owned: {},
    equipped: { me: avatarId, pet: null, sky: "sky_night" },
    daily: { date: null, done: false },
    review: {},
  };
}

/* Normalizza/migra i progressi salvati (riempie i campi mancanti dei save vecchi). */
export function normalizeProgress(saved = {}) {
  const merged = { ...DEFAULT_PROGRESS, ...saved };
  if (saved.xp === undefined) merged.xp = saved.gems || 0; // vecchi save senza XP
  merged.stars = saved.stars || {};
  merged.weak = saved.weak || {};
  merged.owned = saved.owned || {};
  merged.equipped = { ...DEFAULT_EQUIP, ...(saved.equipped || {}) };
  merged.daily = { date: null, done: false, ...(saved.daily || {}) };
  merged.review = saved.review || {};
  return merged;
}
