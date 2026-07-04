/* ═══════════════════════════════════════════════════════════
   PROFILI GIOCATORE — più bambini, ognuno con nome, avatar e progressi
   Persistenza multi-profilo su localStorage (+ migrazione dal vecchio
   salvataggio singolo di "Silvana").
   ═══════════════════════════════════════════════════════════ */
import { freshProgress, normalizeProgress } from "./storage";

const STORE_KEY = "isola-magica-store-v1";
const OLD_KEY = "silvana-progress-v2"; // vecchio salvataggio a utente singolo

/* Catalogo avatar: ~10 femminili + ~10 maschili (gratis, cat "me"). */
export const AVATARS = [
  // Femminili
  { id: "f1", cat: "me", gender: "f", cost: 0, emoji: "👧", name: "Bimba" },
  { id: "f2", cat: "me", gender: "f", cost: 0, emoji: "👸", name: "Principessa" },
  { id: "f3", cat: "me", gender: "f", cost: 0, emoji: "🧚‍♀️", name: "Fatina" },
  { id: "f4", cat: "me", gender: "f", cost: 0, emoji: "🧝‍♀️", name: "Elfa" },
  { id: "f5", cat: "me", gender: "f", cost: 0, emoji: "🦸‍♀️", name: "Supereroina" },
  { id: "f6", cat: "me", gender: "f", cost: 0, emoji: "🧜‍♀️", name: "Sirena" },
  { id: "f7", cat: "me", gender: "f", cost: 0, emoji: "🧙‍♀️", name: "Maga" },
  { id: "f8", cat: "me", gender: "f", cost: 0, emoji: "👩‍🚀", name: "Astronauta" },
  { id: "f9", cat: "me", gender: "f", cost: 0, emoji: "👩‍🎤", name: "Popstar" },
  { id: "f10", cat: "me", gender: "f", cost: 0, emoji: "🧞‍♀️", name: "Genia" },
  // Maschili
  { id: "m1", cat: "me", gender: "m", cost: 0, emoji: "👦", name: "Bimbo" },
  { id: "m2", cat: "me", gender: "m", cost: 0, emoji: "🤴", name: "Principe" },
  { id: "m3", cat: "me", gender: "m", cost: 0, emoji: "🧝‍♂️", name: "Elfo" },
  { id: "m4", cat: "me", gender: "m", cost: 0, emoji: "🦸‍♂️", name: "Supereroe" },
  { id: "m5", cat: "me", gender: "m", cost: 0, emoji: "🧙‍♂️", name: "Mago" },
  { id: "m6", cat: "me", gender: "m", cost: 0, emoji: "🧜‍♂️", name: "Tritone" },
  { id: "m7", cat: "me", gender: "m", cost: 0, emoji: "👨‍🚀", name: "Astronauta" },
  { id: "m8", cat: "me", gender: "m", cost: 0, emoji: "🥷", name: "Ninja" },
  { id: "m9", cat: "me", gender: "m", cost: 0, emoji: "🤠", name: "Cowboy" },
  { id: "m10", cat: "me", gender: "m", cost: 0, emoji: "🧛‍♂️", name: "Vampiretto" },
];

export function avatarById(id) {
  return AVATARS.find((a) => a.id === id) || null;
}
export function avatarsByGender(gender) {
  return AVATARS.filter((a) => a.gender === (gender === "m" ? "m" : "f"));
}

const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function createProfile({ name, gender, avatar }) {
  const g = gender === "m" ? "m" : "f";
  return {
    id: uid(),
    name: (name || "").trim().slice(0, 16) || (g === "m" ? "Piccolo Mago" : "Piccola Maga"),
    gender: g,
    createdAt: Date.now(),
    progress: freshProgress(avatar || (g === "m" ? "m1" : "f1")),
  };
}

// I vecchi avatar del negozio (me_*) mappati ai nuovi id
const OLD_AVATAR_MAP = { me_girl: "f1", me_princess: "f2", me_fairy: "f3", me_mage: "f7" };

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.profiles)) {
        s.profiles.forEach((p) => { p.progress = normalizeProgress(p.progress); });
        return s;
      }
    }
    // Migrazione dal vecchio salvataggio singolo → profilo "Silvana"
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const prog = normalizeProgress(JSON.parse(old));
      if (OLD_AVATAR_MAP[prog.equipped.me]) prog.equipped.me = OLD_AVATAR_MAP[prog.equipped.me];
      else if (!avatarById(prog.equipped.me)) prog.equipped.me = "f1";
      const profile = { id: uid(), name: "Silvana", gender: "f", createdAt: Date.now(), progress: prog };
      const store = { activeId: null, profiles: [profile] };
      saveStore(store);
      return store;
    }
  } catch (e) {
    /* primo avvio o storage non disponibile */
  }
  return { activeId: null, profiles: [] };
}

export function saveStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Salvataggio profili fallito", e);
  }
}
