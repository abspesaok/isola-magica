/* ═══════════════════════════════════════════════════════════
   PROGRESSIONE DEL REGNO — livelli, titoli, Fiamma Magica, negozio
   Solo dati e funzioni pure: nessun React qui.
   ═══════════════════════════════════════════════════════════ */

/* ─── XP: quanto vale ogni cosa ─── */
export const XP_PER_CORRECT = 2; // ogni risposta giusta
export const XP_PER_STAR = 8; // bonus per ogni nuova stella conquistata in un gioco

/* ─── Titoli reali: due scale (femminile e maschile), stesse soglie ─── */
export const TITLES_F = [
  { at: 0, name: "Apprendista Fatina", emoji: "🌱" },
  { at: 40, name: "Damigella di Corte", emoji: "✨" },
  { at: 100, name: "Principessina", emoji: "🎀" },
  { at: 180, name: "Principessa del Regno", emoji: "👸" },
  { at: 300, name: "Maga Incantatrice", emoji: "🔮" },
  { at: 450, name: "Custode delle Creature", emoji: "🦄" },
  { at: 650, name: "Duchessa del Castello", emoji: "🏰" },
  { at: 900, name: "Arcimaga", emoji: "🌟" },
  { at: 1200, name: "Regina del Regno Incantato", emoji: "👑" },
];

export const TITLES_M = [
  { at: 0, name: "Apprendista Folletto", emoji: "🌱" },
  { at: 40, name: "Paggio di Corte", emoji: "✨" },
  { at: 100, name: "Principino", emoji: "⚔️" },
  { at: 180, name: "Principe del Regno", emoji: "🤴" },
  { at: 300, name: "Mago Incantatore", emoji: "🔮" },
  { at: 450, name: "Custode dei Draghi", emoji: "🐉" },
  { at: 650, name: "Duca del Castello", emoji: "🏰" },
  { at: 900, name: "Arcimago", emoji: "🌟" },
  { at: 1200, name: "Re del Regno Incantato", emoji: "👑" },
];

/* Dato l'XP totale e il genere, restituisce livello, titolo e progresso. */
export function levelInfo(xp = 0, gender = "f") {
  const ladder = gender === "m" ? TITLES_M : TITLES_F;
  let idx = 0;
  for (let i = 0; i < ladder.length; i++) if (xp >= ladder[i].at) idx = i;
  const cur = ladder[idx];
  const next = ladder[idx + 1] || null;
  const into = xp - cur.at;
  const span = next ? next.at - cur.at : 1;
  return {
    level: idx + 1,
    title: cur.name,
    emoji: cur.emoji,
    next,
    xpIntoLevel: into,
    xpForLevel: next ? span : into,
    progress: next ? Math.min(1, into / span) : 1,
    isMax: !next,
  };
}

/* ─── Fiamma Magica: streak giornaliera ─── */
export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayDiff(a, b) {
  // giorni interi tra due date "YYYY-MM-DD" (b - a), sul fuso locale
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / 86400000);
}

/* Calcola l'effetto della visita di oggi SENZA mutare il progress.
   Ritorna { changed, streak, bonusGems, today }.
   - stesso giorno            → changed:false (niente doppio bonus)
   - giorno consecutivo       → streak +1
   - buco di uno o più giorni → fiamma ripartita da 1 */
export function dailyVisit(progress) {
  const today = todayStr();
  if (progress.lastPlayed === today) {
    return { changed: false, streak: progress.streak || 1, bonusGems: 0, today };
  }
  let streak;
  if (progress.lastPlayed && dayDiff(progress.lastPlayed, today) === 1) {
    streak = (progress.streak || 0) + 1;
  } else {
    streak = 1;
  }
  const bonusGems = 5 + Math.min(10, streak); // il bonus cresce un po' con la fiamma
  return { changed: true, streak, bonusGems, today };
}

/* ─── Negozio delle Gemme ─── */
// cat: "pet" (compagno), "sky" (cielo del regno). Gli avatar ("me") vivono
// nei profili (profiles.js), scelti alla creazione e gratuiti.
export const SHOP = [
  // Compagni magici
  { id: "pet_cat", cat: "pet", emoji: "🐈", name: "Gattina Fatata", cost: 20 },
  { id: "pet_bunny", cat: "pet", emoji: "🐰", name: "Coniglietto", cost: 20 },
  { id: "pet_owl", cat: "pet", emoji: "🦉", name: "Gufo Saggio", cost: 25 },
  { id: "pet_unicorn", cat: "pet", emoji: "🦄", name: "Unicorno", cost: 35 },
  { id: "pet_dragon", cat: "pet", emoji: "🐉", name: "Draghetto", cost: 50 },
  // Cieli del regno
  { id: "sky_night", cat: "sky", emoji: "🌙", name: "Notte Stellata", cost: 0 },
  { id: "sky_dawn", cat: "sky", emoji: "🌅", name: "Alba Rosa", cost: 35 },
  { id: "sky_aurora", cat: "sky", emoji: "🌌", name: "Aurora Magica", cost: 40 },
  { id: "sky_candy", cat: "sky", emoji: "🍬", name: "Cielo di Zucchero", cost: 45 },
];

export const SHOP_CATS = [
  { cat: "pet", label: "🐾 Compagni", slot: "pet" },
  { cat: "sky", label: "🌈 Cieli", slot: "sky" },
];

// Gradienti dei cieli (top tenuto scuro per la leggibilità del testo)
export const SKY_GRADIENTS = {
  sky_night: "linear-gradient(180deg, #1E1440 0%, #2D1B4E 45%, #45307A 100%)",
  sky_dawn: "linear-gradient(180deg, #241436 0%, #5B2E57 45%, #B5567E 100%)",
  sky_aurora: "linear-gradient(180deg, #071B2E 0%, #12415F 45%, #1E7E7A 100%)",
  sky_candy: "linear-gradient(180deg, #2C1B44 0%, #6A3E86 45%, #C86BA6 100%)",
};

export function skyGradient(id) {
  return SKY_GRADIENTS[id] || SKY_GRADIENTS.sky_night;
}

export function shopItem(id) {
  return SHOP.find((s) => s.id === id) || null;
}

// Un item è "posseduto" se comprato oppure se è gratis (cost 0)
export function isOwned(item, owned) {
  return item.cost === 0 || !!owned[item.id];
}
