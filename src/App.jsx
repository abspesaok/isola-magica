import { useState, useEffect, useRef, useCallback } from "react";
import { speak, audio } from "./audio";
import { loadStore, saveStore, createProfile, avatarById, avatarsByGender } from "./profiles";
import {
  levelInfo, dailyVisit, skyGradient, shopItem,
  SHOP, SHOP_CATS, isOwned, XP_PER_CORRECT, XP_PER_STAR,
} from "./progression";

/* ═══════════════════════════════════════════════════════════
   SILVANA E IL REGNO INCANTATO — PWA
   Motore a isole · Progressi salvati (localStorage) · Gemme Perdute
   Audio: MP3 ElevenLabs dal manifest, con speechSynthesis di riserva
   ═══════════════════════════════════════════════════════════ */

const COLORS = [
  { en: "red", hex: "#E8455A" },
  { en: "blue", hex: "#3E7BD6" },
  { en: "green", hex: "#3DBE6B" },
  { en: "yellow", hex: "#F5C64F" },
  { en: "purple", hex: "#8E5FD9" },
  { en: "pink", hex: "#F27EB6" },
  { en: "orange", hex: "#F28C38" },
  { en: "brown", hex: "#9C6B44" },
  { en: "white", hex: "#F3EFFA" },
  { en: "black", hex: "#33304A" },
];

const ANIMALS = [
  { en: "cat", emoji: "🐱" },
  { en: "dog", emoji: "🐶" },
  { en: "horse", emoji: "🐴" },
  { en: "fish", emoji: "🐟" },
  { en: "bird", emoji: "🐦" },
  { en: "elephant", emoji: "🐘" },
  { en: "lion", emoji: "🦁" },
  { en: "monkey", emoji: "🐵" },
  { en: "mouse", emoji: "🐭" },
  { en: "sheep", emoji: "🐑" },
  { en: "cow", emoji: "🐮" },
  { en: "duck", emoji: "🦆" },
  { en: "frog", emoji: "🐸" },
  { en: "bee", emoji: "🐝" },
];

const FAMILY = [
  { en: "mother", emoji: "👩" },
  { en: "father", emoji: "👨" },
  { en: "sister", emoji: "👧" },
  { en: "brother", emoji: "👦" },
  { en: "baby", emoji: "👶" },
  { en: "grandmother", emoji: "👵" },
  { en: "grandfather", emoji: "👴" },
];

const BODY = [
  { en: "eyes", emoji: "👀" },
  { en: "ear", emoji: "👂" },
  { en: "nose", emoji: "👃" },
  { en: "mouth", emoji: "👄" },
  { en: "hand", emoji: "✋" },
  { en: "foot", emoji: "🦶" },
  { en: "arm", emoji: "💪" },
  { en: "leg", emoji: "🦵" },
  { en: "face", emoji: "🙂" },
];

const FOOD = [
  { en: "apple", emoji: "🍎" },
  { en: "banana", emoji: "🍌" },
  { en: "orange", emoji: "🍊" },
  { en: "egg", emoji: "🥚" },
  { en: "bread", emoji: "🍞" },
  { en: "milk", emoji: "🥛" },
  { en: "water", emoji: "💧" },
  { en: "cake", emoji: "🍰" },
  { en: "ice cream", emoji: "🍦" },
  { en: "pizza", emoji: "🍕" },
  { en: "chicken", emoji: "🍗" },
  { en: "rice", emoji: "🍚" },
  { en: "carrot", emoji: "🥕" },
  { en: "grapes", emoji: "🍇" },
];

const HOUSE = [
  { en: "bed", emoji: "🛏️" },
  { en: "chair", emoji: "🪑" },
  { en: "door", emoji: "🚪" },
  { en: "window", emoji: "🪟" },
  { en: "lamp", emoji: "💡" },
  { en: "clock", emoji: "🕐" },
  { en: "key", emoji: "🗝️" },
  { en: "sofa", emoji: "🛋️" },
  { en: "television", emoji: "📺" },
  { en: "cup", emoji: "🍵" },
];

const SCHOOL = [
  { en: "book", emoji: "📚" },
  { en: "pen", emoji: "🖊️" },
  { en: "pencil", emoji: "✏️" },
  { en: "bag", emoji: "🎒" },
  { en: "ruler", emoji: "📏" },
  { en: "scissors", emoji: "✂️" },
  { en: "crayon", emoji: "🖍️" },
  { en: "notebook", emoji: "📓" },
];

/* Isola 7 — Verbi di azione (Ballo Incantato · Simon Says) */
const VERBS = [
  { en: "run", emoji: "🏃" },
  { en: "jump", emoji: "🤸" },
  { en: "swim", emoji: "🏊" },
  { en: "walk", emoji: "🚶" },
  { en: "dance", emoji: "💃" },
  { en: "sing", emoji: "🎤" },
  { en: "clap", emoji: "👏" },
  { en: "sleep", emoji: "😴" },
  { en: "eat", emoji: "😋" },
  { en: "drink", emoji: "🥤" },
  { en: "read", emoji: "📖" },
  { en: "draw", emoji: "🎨" },
];

/* Isola 8 — Meteo e natura (Giardino Reale) */
const WEATHER = [
  { en: "sunny", emoji: "☀️" },
  { en: "rainy", emoji: "🌧️" },
  { en: "cloudy", emoji: "☁️" },
  { en: "windy", emoji: "🌬️" },
  { en: "snowy", emoji: "🌨️" },
  { en: "stormy", emoji: "⛈️" },
];

const NATURE = [
  { en: "sun", emoji: "☀️" },
  { en: "moon", emoji: "🌙" },
  { en: "star", emoji: "⭐" },
  { en: "tree", emoji: "🌳" },
  { en: "flower", emoji: "🌷" },
  { en: "rainbow", emoji: "🌈" },
  { en: "cloud", emoji: "☁️" },
  { en: "leaf", emoji: "🍃" },
];

/* Isola 9 — Vestiti (Guardaroba della Regina) */
const CLOTHES = [
  { en: "shirt", emoji: "👕" },
  { en: "trousers", emoji: "👖" },
  { en: "dress", emoji: "👗" },
  { en: "shoes", emoji: "👟" },
  { en: "socks", emoji: "🧦" },
  { en: "hat", emoji: "👒" },
  { en: "coat", emoji: "🧥" },
  { en: "shorts", emoji: "🩳" },
  { en: "boots", emoji: "👢" },
  { en: "gloves", emoji: "🧤" },
  { en: "scarf", emoji: "🧣" },
  { en: "cap", emoji: "🧢" },
];

/* Prepositions pool: subject × object × in/on/under (Isola 5) */
const PREP_SUBJECTS = [
  { en: "cat", emoji: "🐱" },
  { en: "dog", emoji: "🐶" },
  { en: "ball", emoji: "⚽" },
  { en: "mouse", emoji: "🐭" },
];
const PREP_OBJECTS = [
  { en: "box", emoji: "📦" },
  { en: "chair", emoji: "🪑" },
  { en: "bed", emoji: "🛏️" },
];
const PREP_POOL = PREP_SUBJECTS.flatMap((s) =>
  PREP_OBJECTS.flatMap((o) =>
    ["in", "on", "under"].map((prep) => ({ key: `${prep}-${s.en}-${o.en}`, prep, subj: s, obj: o }))
  )
);

function PrepScene({ x }) {
  if (x.prep === "on")
    return (
      <span className="flex flex-col items-center leading-none">
        <span style={{ fontSize: 34 }}>{x.subj.emoji}</span>
        <span style={{ fontSize: 48, marginTop: -6 }}>{x.obj.emoji}</span>
      </span>
    );
  if (x.prep === "under")
    return (
      <span className="flex flex-col items-center leading-none">
        <span style={{ fontSize: 48 }}>{x.obj.emoji}</span>
        <span style={{ fontSize: 34, marginTop: -4 }}>{x.subj.emoji}</span>
      </span>
    );
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 74, height: 74 }}>
      <span style={{ fontSize: 54 }}>{x.obj.emoji}</span>
      <span style={{ fontSize: 24, position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>{x.subj.emoji}</span>
    </span>
  );
}

const NUMBER_WORDS = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

const ROUNDS = 8;
const PRAISE = ["Great job!", "Wonderful!", "Perfect!", "Amazing!", "Well done!", "Fantastic!"];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const rand = (n) => Math.floor(Math.random() * n);

/* ─── Weak-word helper: pick target favouring words the player misses ─── */
function pickTarget(pool, weak, keyFn) {
  const weakOnes = pool.filter((it) => (weak[keyFn(it)] || 0) > 0);
  if (weakOnes.length && Math.random() < 0.45) return weakOnes[rand(weakOnes.length)];
  return pool[rand(pool.length)];
}

/* ─── UI atoms ─── */
function SparkleBurst({ trigger }) {
  if (!trigger) return null;
  return (
    <div key={trigger} className="pointer-events-none fixed inset-0 flex items-center justify-center z-50">
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="sparkle-fly absolute text-4xl"
          style={{ "--dx": `${Math.cos((i / 14) * Math.PI * 2) * (90 + rand(70))}px`, "--dy": `${Math.sin((i / 14) * Math.PI * 2) * (90 + rand(70))}px`, animationDelay: `${rand(120)}ms` }}>
          {["✨", "⭐", "💜", "🌟", "💎"][i % 5]}
        </span>
      ))}
    </div>
  );
}

function Crown({ filled = 0, caption }) {
  const slots = 12; // una gemma della corona per ogni isola liberata
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: 190, height: 74 }}>
        <svg viewBox="0 0 190 74" width="190" height="74">
          <path d="M12 62 L8 24 L44 42 L70 12 L95 40 L120 12 L146 42 L182 24 L178 62 Z"
            fill="url(#goldGrad)" stroke="#B8892E" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="10" y="58" width="170" height="10" rx="5" fill="#D9A63F" stroke="#B8892E" strokeWidth="2" />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8D978" /><stop offset="100%" stopColor="#E0AC3C" />
            </linearGradient>
          </defs>
        </svg>
        {Array.from({ length: slots }).map((_, i) => {
          const positions = [[26,44],[48,38],[70,32],[95,46],[120,32],[142,38],[164,44],[37,52],[66,50],[95,58],[124,50],[153,52]];
          const [x, y] = positions[i];
          const c = COLORS[i % 7].hex;
          const on = i < filled;
          return (
            <span key={i} className={on ? "gem-pop" : ""}
              style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: "50%",
                background: on ? `radial-gradient(circle at 35% 30%, #fff9, ${c})` : "#00000022",
                border: on ? "1.5px solid #fff8" : "1.5px solid #00000030",
                boxShadow: on ? `0 0 10px ${c}` : "none", transition: "all .3s" }} />
          );
        })}
      </div>
      <div className="text-xs font-bold tracking-wide" style={{ color: "#F0D98C" }}>{caption}</div>
    </div>
  );
}

function Stars({ n }) {
  return (
    <span className="text-lg tracking-wider">
      {[1, 2, 3].map((i) => (<span key={i} style={{ opacity: i <= n ? 1 : 0.22 }}>⭐</span>))}
    </span>
  );
}

function ProgressPips({ total, done }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 12, height: 12, borderRadius: "50%",
          background: i < done ? "#F5C64F" : "#ffffff26",
          boxShadow: i < done ? "0 0 8px #F5C64F" : "none", transition: "all .3s" }} />
      ))}
    </div>
  );
}

/* ═══════════ GENERIC GAME ENGINES ═══════════ */

/* Listen & Tap: hear a word/phrase, tap the right option */
function ListenTapGame({ speak, cfg, weak, onGem, onMiss, onDone }) {
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [burst, setBurst] = useState(0);
  const mistakes = useRef(0);

  const newRound = useCallback(() => {
    const t = pickTarget(cfg.pool, weak, cfg.keyOf);
    const distractors = shuffle(cfg.pool.filter((it) => cfg.keyOf(it) !== cfg.keyOf(t))).slice(0, 3);
    setOptions(shuffle([t, ...distractors]));
    setTarget(t);
    setLocked(false); setWrongIdx(null);
    // Aspetta che la lode del turno precedente finisca, poi annuncia il prompt
    setTimeout(() => audio.whenIdle().then(() => speak(cfg.prompt(t))), 450);
  }, [speak, cfg, weak]);

  useEffect(() => { newRound(); }, []); // eslint-disable-line

  const pick = (it, i) => {
    if (locked || !target) return;
    if (cfg.keyOf(it) === cfg.keyOf(target)) {
      setLocked(true); setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
      speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
        else { setRound((r) => r + 1); newRound(); }
      }, 1600);
    } else {
      mistakes.current += 1; setWrongIdx(i);
      onMiss(cfg.wordsOf(target));
      speak(`That's ${cfg.sayOf(it)}.`, cfg.prompt(target));
      setTimeout(() => setWrongIdx(null), 700);
    }
  };

  if (!target) return null;
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS} done={round} />
      <p className="text-lg font-semibold" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      <button onClick={() => speak(cfg.prompt(target))} className="listen-btn">🔊 Riascolta</button>
      <div className="grid grid-cols-2 gap-6 mt-2">
        {options.map((it, i) => (
          <button key={cfg.keyOf(it)} onClick={() => pick(it, i)}
            className={`opt-btn ${wrongIdx === i ? "shake" : ""}`}
            style={cfg.style ? cfg.style(it) : undefined}>
            {cfg.render(it)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Counting game (numbers) */
function CountGame({ speak, weak, onGem, onMiss, onDone }) {
  const [round, setRound] = useState(0);
  const [n, setN] = useState(null);
  const [opts, setOpts] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [burst, setBurst] = useState(0);
  const mistakes = useRef(0);

  const newRound = useCallback((r) => {
    const max = r < 3 ? 10 : 20;
    let target = 1 + rand(max);
    const weakNums = Object.keys(weak).map(Number).filter((x) => x >= 1 && x <= max && weak[NUMBER_WORDS[x]] > 0);
    if (weakNums.length && Math.random() < 0.45) target = weakNums[rand(weakNums.length)];
    const set = new Set([target]);
    while (set.size < 3) set.add(1 + rand(max));
    setN(target); setOpts(shuffle([...set]));
    setLocked(false); setWrongIdx(null);
    // Aspetta la fine della lode precedente prima di chiedere il turno nuovo
    setTimeout(() => audio.whenIdle().then(() => speak("How many stars?")), 450);
  }, [speak, weak]);

  useEffect(() => { newRound(0); }, []); // eslint-disable-line

  const pick = (v, i) => {
    if (locked) return;
    speak(NUMBER_WORDS[v]);
    if (v === n) {
      setLocked(true); setBurst((b) => b + 1); onGem([NUMBER_WORDS[n]]);
      setTimeout(() => speak(`Yes! ${NUMBER_WORDS[n]} stars.`, PRAISE[rand(PRAISE.length)]), 700);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
        else { const r = round + 1; setRound(r); newRound(r); }
      }, 2400);
    } else {
      mistakes.current += 1; setWrongIdx(i); onMiss([NUMBER_WORDS[n]]);
      setTimeout(() => { speak("Try again! How many stars?"); setWrongIdx(null); }, 800);
    }
  };

  if (n === null) return null;
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS} done={round} />
      <p className="text-lg font-semibold" style={{ color: "#CDBBF2" }}>Conta le stelle e scegli la parola</p>
      <button onClick={() => speak("How many stars?")} className="listen-btn">🔊 Riascolta</button>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl p-5"
        style={{ background: "#ffffff10", border: "2px solid #ffffff22", maxWidth: 420, minHeight: 120 }}>
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className="text-3xl star-twinkle" style={{ animationDelay: `${(i % 5) * 250}ms` }}>⭐</span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {opts.map((v, i) => (
          <button key={v} onClick={() => pick(v, i)} className={`word-btn ${wrongIdx === i ? "shake" : ""}`}>
            {NUMBER_WORDS[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Memory: match written word ↔ picture */
function MemoryGame({ speak, cfg, onGem, onDone }) {
  const PAIRS = 6;
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [burst, setBurst] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    const chosen = shuffle(cfg.pool).slice(0, PAIRS);
    const deck = shuffle(chosen.flatMap((c) => [
      { id: cfg.keyOf(c) + "-pic", item: c, kind: "pic" },
      { id: cfg.keyOf(c) + "-word", item: c, kind: "word" },
    ]));
    setCards(deck);
    setTimeout(() => speak("Find the pairs! Match the word and the picture."), 500);
  }, []); // eslint-disable-line

  const flip = (i) => {
    if (lock.current || open.includes(i) || matched.includes(i)) return;
    const card = cards[i];
    speak(cfg.sayOf(card.item));
    const nowOpen = [...open, i];
    setOpen(nowOpen);
    if (nowOpen.length === 2) {
      lock.current = true; setMoves((m) => m + 1);
      const [a, b] = nowOpen.map((idx) => cards[idx]);
      if (cfg.keyOf(a.item) === cfg.keyOf(b.item) && a.kind !== b.kind) {
        setTimeout(() => {
          setMatched((m) => {
            const nm = [...m, ...nowOpen];
            if (nm.length === PAIRS * 2) {
              setTimeout(() => {
                // Non tagliare la lode dell'ultima coppia: parla quando l'audio è libero
                audio.whenIdle().then(() => speak("You found all the pairs!", PRAISE[rand(PRAISE.length)]));
                onDone(moves + 1 <= 9 ? 3 : moves + 1 <= 13 ? 2 : 1);
              }, 900);
            }
            return nm;
          });
          setOpen([]); setBurst((x) => x + 1); onGem([cfg.sayOf(a.item)]);
          speak(cfg.sayOf(a.item), PRAISE[rand(PRAISE.length)]);
          lock.current = false;
        }, 650);
      } else {
        setTimeout(() => { setOpen([]); lock.current = false; }, 1100);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <p className="text-lg font-semibold" style={{ color: "#CDBBF2" }}>Trova le coppie: parola + figura</p>
      <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 400 }}>
        {cards.map((c, i) => {
          const up = open.includes(i) || matched.includes(i);
          const done = matched.includes(i);
          return (
            <button key={c.id} onClick={() => flip(i)} className="memory-card"
              style={{
                background: up ? (c.kind === "pic" ? (cfg.picBg ? cfg.picBg(c.item) : "#F6F1FF") : "#F6F1FF")
                  : "linear-gradient(160deg, #6A4BB8, #4A2F8E)",
                border: done ? "3px solid #F5C64F" : "3px solid #ffffff2e",
                opacity: done ? 0.92 : 1, transform: up ? "scale(1)" : "scale(.97)",
              }}>
              {up ? (c.kind === "word"
                ? <span className="font-extrabold text-lg" style={{ color: "#4A2F8E" }}>{cfg.sayOf(c.item)}</span>
                : cfg.renderPic(c.item))
                : <span className="text-2xl" style={{ color: "#E7DBFF" }}>✦</span>}
            </button>
          );
        })}
      </div>
      <div className="text-sm" style={{ color: "#9F8CC9" }}>Mosse: {moves}</div>
    </div>
  );
}

/* ═══════════ ISLAND CONTENT (data, not code) ═══════════ */
const COMBO_POOL = (() => {
  // colored creatures: cross-sample of Island 1 colors × Island 2 animals
  const usable = COLORS.filter((c) => !["white", "black", "brown"].includes(c.en));
  const combos = [];
  ANIMALS.slice(0, 10).forEach((a, i) => {
    const c = usable[i % usable.length];
    combos.push({ key: `${c.en}-${a.en}`, color: c, animal: a });
    const c2 = usable[(i + 3) % usable.length];
    combos.push({ key: `${c2.en}-${a.en}`, color: c2, animal: a });
  });
  return combos;
})();

/* Isola 9 — vestiti colorati (colore × capo) */
const CLOTHES_COMBO = (() => {
  const usable = COLORS.filter((c) => !["white", "black", "brown"].includes(c.en));
  const combos = [];
  CLOTHES.slice(0, 8).forEach((o, i) => {
    const c = usable[i % usable.length];
    combos.push({ key: `${c.en}-${o.en}`, color: c, item: o });
    const c2 = usable[(i + 2) % usable.length];
    combos.push({ key: `${c2.en}-${o.en}`, color: c2, item: o });
  });
  return combos;
})();

/* Isola 10 — ripasso misto per il BOSS (parole con emoji dalle isole 2–9) */
const BOSS_POOL = [
  ...ANIMALS.slice(0, 5),
  ...FOOD.slice(0, 4),
  ...HOUSE.slice(0, 3),
  ...SCHOOL.slice(0, 3),
  ...CLOTHES.slice(0, 4),
  ...NATURE.slice(0, 3),
  ...VERBS.slice(0, 4),
];

const ISLANDS = [
  {
    id: "gems",
    name: "Il Regno delle Gemme",
    emoji: "💎",
    sub: "Colori e numeri",
    games: [
      {
        key: "colors", emoji: "💎", title: "Gemme Magiche", type: "listentap",
        cfg: {
          pool: COLORS,
          keyOf: (c) => c.en,
          sayOf: (c) => c.en,
          wordsOf: (c) => [c.en],
          prompt: (c) => `Find the ${c.en} gem!`,
          hintIt: "Ascolta e tocca la gemma giusta",
          render: () => "",
          style: (c) => ({
            width: 128, height: 128, borderRadius: "42% 58% 55% 45% / 48% 44% 56% 52%",
            border: "3px solid #ffffff55",
            background: `radial-gradient(circle at 32% 26%, #ffffffb0, ${c.hex} 62%)`,
            boxShadow: `0 8px 26px ${c.hex}77, inset 0 -6px 14px #00000033`,
          }),
        },
      },
      { key: "numbers", emoji: "⭐", title: "Conta le Stelle", type: "count" },
      {
        key: "memory", emoji: "👑", title: "Memory Reale", type: "memory",
        cfg: {
          pool: COLORS.slice(0, 8),
          keyOf: (c) => c.en, sayOf: (c) => c.en,
          renderPic: () => <span className="text-3xl">💎</span>,
          picBg: (c) => `radial-gradient(circle at 32% 26%, #ffffffb0, ${c.hex} 62%)`,
        },
      },
    ],
  },
  {
    id: "forest",
    name: "Il Bosco delle Creature Magiche",
    emoji: "🦄",
    sub: "Gli animali",
    games: [
      {
        key: "safari", emoji: "🔊", title: "Safari Sonoro", type: "listentap",
        cfg: {
          pool: ANIMALS,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Ascolta e tocca l'animale giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "combo", emoji: "🎨", title: "Creature Colorate", type: "listentap",
        cfg: {
          pool: COMBO_POOL,
          keyOf: (x) => x.key,
          sayOf: (x) => `the ${x.color.en} ${x.animal.en}`,
          wordsOf: (x) => [x.color.en, x.animal.en],
          prompt: (x) => `Find the ${x.color.en} ${x.animal.en}!`,
          hintIt: "Colore + animale insieme: tocca la creatura giusta",
          render: (x) => <span style={{ fontSize: 56 }}>{x.animal.emoji}</span>,
          style: (x) => ({
            width: 128, height: 128, borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, #ffffff90, ${x.color.hex} 68%)`,
            border: "3px solid #ffffff55",
            boxShadow: `0 8px 24px ${x.color.hex}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryForest", emoji: "🌲", title: "Memory del Bosco", type: "memory",
        cfg: {
          pool: ANIMALS,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "mirror",
    name: "Lo Specchio della Principessa",
    emoji: "🪞",
    sub: "Famiglia e corpo",
    games: [
      {
        key: "family", emoji: "👨‍👩‍👧", title: "La Famiglia Reale", type: "listentap",
        cfg: {
          pool: FAMILY,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Ascolta e tocca la persona giusta",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "body", emoji: "✋", title: "Il Corpo Magico", type: "listentap",
        cfg: {
          pool: BODY,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Touch the ${a.en}!`,
          hintIt: "Touch! Tocca la parte del corpo giusta",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryMirror", emoji: "🪞", title: "Memory dello Specchio", type: "memory",
        cfg: {
          pool: [...FAMILY, ...BODY.slice(0, 5)],
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "banquet",
    name: "Il Banchetto Reale",
    emoji: "🍰",
    sub: "Cibi e bevande",
    games: [
      {
        key: "banquet", emoji: "🍽️", title: "Prepara il Banchetto", type: "listentap",
        cfg: {
          pool: FOOD,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `I like ${a.en}! Give me the ${a.en}, please!`,
          hintIt: "La principessa ha fame: portale il cibo giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryBanquet", emoji: "🧁", title: "Memory del Banchetto", type: "memory",
        cfg: {
          pool: FOOD,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "castle",
    name: "Il Castello Segreto",
    emoji: "🗝️",
    sub: "La casa · in, on, under",
    games: [
      {
        key: "house", emoji: "🛋️", title: "Le Stanze Segrete", type: "listentap",
        cfg: {
          pool: HOUSE,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Ascolta e tocca l'oggetto giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "hideseek", emoji: "🙈", title: "Nascondino Magico", type: "listentap",
        cfg: {
          pool: PREP_POOL,
          keyOf: (x) => x.key,
          sayOf: (x) => `${x.prep} the ${x.obj.en}`,
          wordsOf: (x) => [x.prep, x.subj.en, x.obj.en],
          prompt: (x) => `The ${x.subj.en} is ${x.prep} the ${x.obj.en}!`,
          hintIt: "In, on, under: dove si nasconde? Tocca la scena giusta",
          render: (x) => <PrepScene x={x} />,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryCastle", emoji: "🗝️", title: "Memory del Castello", type: "memory",
        cfg: {
          pool: HOUSE,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "school",
    name: "La Scuola di Magia",
    emoji: "📚",
    sub: "Oggetti di scuola · colore + oggetto",
    games: [
      {
        key: "backpack", emoji: "🎒", title: "Lo Zaino Incantato", type: "listentap",
        cfg: {
          pool: SCHOOL,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Put the ${a.en} in the bag!`,
          hintIt: "Metti nello zaino l'oggetto giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "coloredObjects", emoji: "🖍️", title: "Oggetti Colorati", type: "listentap",
        cfg: {
          pool: SCHOOL.slice(0, 6).flatMap((o, i) => {
            const usable = COLORS.filter((c) => !["white", "black", "brown"].includes(c.en));
            return [usable[i % usable.length], usable[(i + 3) % usable.length]].map((c) => ({
              key: `${c.en}-${o.en}`, color: c, obj: o,
            }));
          }),
          keyOf: (x) => x.key,
          sayOf: (x) => `the ${x.color.en} ${x.obj.en}`,
          wordsOf: (x) => [x.color.en, x.obj.en],
          prompt: (x) => `Find the ${x.color.en} ${x.obj.en}!`,
          hintIt: "Colore + oggetto: tocca quello giusto",
          render: (x) => <span style={{ fontSize: 54 }}>{x.obj.emoji}</span>,
          style: (x) => ({
            width: 128, height: 128, borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, #ffffff90, ${x.color.hex} 68%)`,
            border: "3px solid #ffffff55",
            boxShadow: `0 8px 24px ${x.color.hex}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memorySchool", emoji: "📚", title: "Memory della Scuola", type: "memory",
        cfg: {
          pool: SCHOOL,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "ball",
    name: "Il Ballo Incantato",
    emoji: "💃",
    sub: "I verbi di azione",
    games: [
      {
        key: "simon", emoji: "🕺", title: "Simon Says", type: "listentap",
        cfg: {
          pool: VERBS,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Simon says: ${a.en}!`,
          hintIt: "Simon dice: tocca l'azione giusta!",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryBall", emoji: "💃", title: "Memory del Ballo", type: "memory",
        cfg: {
          pool: VERBS,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "garden",
    name: "Il Giardino Reale",
    emoji: "🌦️",
    sub: "Il meteo e la natura",
    games: [
      {
        key: "weather", emoji: "🌈", title: "Che Tempo Fa?", type: "listentap",
        cfg: {
          pool: WEATHER,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `It's ${a.en}!`,
          hintIt: "Che tempo fa nel regno? Tocca il cielo giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "nature", emoji: "🌳", title: "Il Giardino Magico", type: "listentap",
        cfg: {
          pool: NATURE,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Ascolta e tocca la cosa giusta della natura",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryGarden", emoji: "🌷", title: "Memory del Giardino", type: "memory",
        cfg: {
          pool: NATURE,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "wardrobe",
    name: "Il Guardaroba della Regina",
    emoji: "👗",
    sub: "I vestiti · colore + capo",
    games: [
      {
        key: "dressup", emoji: "👗", title: "Vesti la Principessa", type: "listentap",
        cfg: {
          pool: CLOTHES,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Put on the ${a.en}!`,
          hintIt: "Vesti la principessa: tocca il capo giusto",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "fashion", emoji: "🌈", title: "Sfilata Colorata", type: "listentap",
        cfg: {
          pool: CLOTHES_COMBO,
          keyOf: (x) => x.key,
          sayOf: (x) => `the ${x.color.en} ${x.item.en}`,
          wordsOf: (x) => [x.color.en, x.item.en],
          prompt: (x) => `She's wearing a ${x.color.en} ${x.item.en}!`,
          hintIt: "Colore + capo: tocca il vestito giusto",
          render: (x) => <span style={{ fontSize: 54 }}>{x.item.emoji}</span>,
          style: (x) => ({
            width: 128, height: 128, borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, #ffffff90, ${x.color.hex} 68%)`,
            border: "3px solid #ffffff55",
            boxShadow: `0 8px 24px ${x.color.hex}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryWardrobe", emoji: "🧥", title: "Memory del Guardaroba", type: "memory",
        cfg: {
          pool: CLOTHES,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
  {
    id: "dragon",
    name: "BOSS: Il Drago Parlante",
    emoji: "🐉",
    sub: "La grande sfida di ripasso",
    games: [
      {
        key: "dragonChallenge", emoji: "🔥", title: "La Sfida del Drago", type: "listentap",
        cfg: {
          pool: BOSS_POOL,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Il Drago mette alla prova tutto! Tocca la parola giusta",
          render: (a) => <span style={{ fontSize: 58 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      { key: "dragonNumbers", emoji: "🔢", title: "Il Tesoro dei Numeri", type: "count" },
      {
        key: "memoryDragon", emoji: "🐲", title: "Memory del Drago", type: "memory",
        cfg: {
          pool: BOSS_POOL,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          renderPic: (a) => <span className="text-4xl">{a.emoji}</span>,
        },
      },
    ],
  },
];

/* ═══════════ LEVEL-UP: header, XP, fiamma, negozio ═══════════ */

function XpBar({ lvl }) {
  return (
    <div style={{ width: 200 }}>
      <div style={{ height: 10, borderRadius: 999, background: "#ffffff1e", overflow: "hidden", marginTop: 4 }}>
        <div style={{ height: "100%", width: `${Math.round(lvl.progress * 100)}%`, background: "linear-gradient(90deg,#F5C64F,#F27EB6)", transition: "width .5s" }} />
      </div>
      <div className="text-xs" style={{ color: "#9F8CC9", marginTop: 3 }}>
        {lvl.isMax
          ? `${lvl.xpIntoLevel} XP · titolo massimo!`
          : `${lvl.xpIntoLevel}/${lvl.xpForLevel} XP → ${lvl.next.emoji} ${lvl.next.name}`}
      </div>
    </div>
  );
}

function FlameBadge({ streak }) {
  const lit = streak > 0;
  return (
    <span className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"
      style={{ background: "#ffffff12", border: "1.5px solid #ffffff22", color: lit ? "#FFB86B" : "#9F8CC9" }}>
      <span className={lit ? "flame-flicker inline-block" : "inline-block"} style={{ opacity: lit ? 1 : 0.5 }}>🔥</span>
      {streak}
    </span>
  );
}

function RoyalHeader({ progress, gender, name, crownFilled, onShop, onSwitch }) {
  const lvl = levelInfo(progress.xp, gender);
  const me = avatarById(progress.equipped.me) || { emoji: gender === "m" ? "👦" : "👧" };
  const pet = progress.equipped.pet ? shopItem(progress.equipped.pet) : null;
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <Crown filled={crownFilled} caption={`👑 ${crownFilled} ${crownFilled === 1 ? "isola liberata" : "isole liberate"}`} />
      <div className="flex items-center gap-4">
        <div className="relative" style={{ width: 60, height: 60 }}>
          <span style={{ fontSize: 52, lineHeight: "60px" }}>{me.emoji}</span>
          {pet && <span className="float" style={{ fontSize: 28, position: "absolute", right: -16, bottom: -6 }}>{pet.emoji}</span>}
        </div>
        <div className="flex flex-col">
          <span className="display" style={{ color: "#F6F1FF", fontSize: 20, lineHeight: 1.1 }}>{name}</span>
          <span className="text-xs" style={{ color: "#CDBBF2" }}>{lvl.emoji} {lvl.title} · Liv. {lvl.level}</span>
          <XpBar lvl={lvl} />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <FlameBadge streak={progress.streak} />
        <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "#ffffff12", border: "1.5px solid #ffffff22", color: "#F0D98C" }}>💎 {progress.gems}</span>
        <button onClick={onShop} className="px-3 py-1 rounded-full text-sm font-extrabold"
          style={{ background: "linear-gradient(180deg,#F8D978,#E0AC3C)", color: "#2D1B4E", border: "none", boxShadow: "0 3px 0 #B8892E" }}>
          🛍️ Negozio
        </button>
        <button onClick={onSwitch} className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: "#ffffff12", border: "1.5px solid #ffffff22", color: "#E7DBFF" }}>
          👥 Cambia
        </button>
      </div>
    </div>
  );
}

function LevelUpOverlay({ lvl, gender, onClose }) {
  const cheer = gender === "m" ? "piccolo re" : "piccola regina";
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-8 text-center"
      style={{ background: "#1E1440ee" }}>
      <SparkleBurst trigger={1} />
      <span className="text-7xl gem-pop">{lvl.emoji}</span>
      <h2 className="display" style={{ fontSize: "1.8rem", color: "#F5C64F" }}>Hai un nuovo titolo!</h2>
      <p className="display" style={{ fontSize: "1.35rem", color: "#F6F1FF" }}>Ora sei<br /><b>{lvl.title}</b></p>
      <p className="text-sm" style={{ color: "#CDBBF2" }}>Livello {lvl.level} · continua così, {cheer}! ✨</p>
      <button onClick={onClose} className="listen-btn" style={{ fontSize: "1.15rem", padding: "14px 30px" }}>Evviva! 🎉</button>
    </div>
  );
}

function DailyToast({ info }) {
  return (
    <div className="fixed left-1/2 z-40" style={{ top: 14, transform: "translateX(-50%)", width: "min(340px, 90vw)" }}>
      <div className="toast-in rounded-2xl px-5 py-3 text-center"
        style={{ background: "linear-gradient(180deg,#3A2470,#241650)", border: "2px solid #F5C64F55", color: "#F6F1FF", boxShadow: "0 10px 30px #00000055" }}>
        <div className="font-bold"><span className="flame-flicker inline-block">🔥</span> Fiamma Magica: {info.streak} {info.streak === 1 ? "giorno" : "giorni"}!</div>
        <div className="text-sm" style={{ color: "#F0D98C" }}>Bonus di oggi: +{info.bonus} 💎</div>
      </div>
    </div>
  );
}

function ShopScreen({ progress, gender, onBack, onBuyEquip, burst, denyId }) {
  const sections = [
    { label: "👤 Avatar", slot: "me", items: avatarsByGender(gender) },
    ...SHOP_CATS.map((c) => ({ label: c.label, slot: c.slot, items: SHOP.filter((s) => s.cat === c.cat) })),
  ];
  return (
    <div className="flex flex-col items-center gap-5 px-5 py-8 w-full max-w-md relative z-10">
      <SparkleBurst trigger={burst} />
      <div className="w-full flex items-center justify-between">
        <button onClick={onBack} className="font-bold text-base rounded-full px-5 py-2"
          style={{ background: "#ffffff18", color: "#E7DBFF", border: "2px solid #ffffff28" }}>← Mappa</button>
        <span className="font-bold" style={{ color: "#F0D98C" }}>💎 {progress.gems}</span>
      </div>
      <h2 className="display text-2xl" style={{ color: "#F6F1FF" }}>🛍️ Negozio delle Gemme</h2>
      <p className="text-sm text-center" style={{ color: "#9F8CC9" }}>
        Guadagni gemme giocando e con la Fiamma Magica. Spendile per il tuo regno!
      </p>
      {sections.map(({ label, slot, items }) => (
        <div key={slot} className="w-full">
          <div className="display text-lg mb-2" style={{ color: "#CDBBF2" }}>{label}</div>
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => {
              const owned = isOwned(item, progress.owned);
              const equipped = progress.equipped[slot] === item.id;
              const afford = progress.gems >= item.cost;
              return (
                <button key={item.id} onClick={() => onBuyEquip(item)}
                  className={`shop-card ${denyId === item.id ? "shake" : ""}`}
                  style={{
                    border: equipped ? "3px solid #F5C64F" : "2px solid #ffffff24",
                    background: equipped ? "#F5C64F22" : "#ffffff10",
                    opacity: !owned && !afford ? 0.5 : 1,
                  }}>
                  <span style={{ fontSize: 38 }}>{item.emoji}</span>
                  <span className="text-xs font-bold text-center" style={{ color: "#F6F1FF" }}>{item.name}</span>
                  <span className="text-xs font-bold" style={{ color: equipped ? "#F5C64F" : owned ? "#8FE3A6" : afford ? "#F0D98C" : "#E8455A" }}>
                    {equipped ? "In uso" : owned ? "Usa" : `💎 ${item.cost}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-xs text-center" style={{ color: "#7A68A8" }}>
        Tocca un compagno che hai già per toglierlo. Avatar e cielo si possono sempre cambiare.
      </p>
    </div>
  );
}

/* ─── Selezione profilo & creazione nuovo giocatore ─── */
function ProfilesScreen({ store, onSelect, onNew }) {
  return (
    <div className="flex flex-col items-center gap-6 px-5 py-10 w-full max-w-md relative z-10">
      <span className="text-6xl float">🏝️</span>
      <h1 className="display text-center leading-tight" style={{ fontSize: "2.2rem", color: "#F6F1FF", textShadow: "0 3px 16px #8E5FD980" }}>Isola Magica</h1>
      <p className="display text-lg" style={{ color: "#CDBBF2" }}>Chi sta giocando?</p>
      <div className="flex flex-col gap-3 w-full items-center">
        {store.profiles.map((p) => {
          const av = avatarById(p.progress.equipped.me);
          const lvl = levelInfo(p.progress.xp, p.gender);
          return (
            <button key={p.id} className="game-tile" onClick={() => onSelect(p.id)}>
              <span className="text-4xl">{av ? av.emoji : p.gender === "m" ? "👦" : "👧"}</span>
              <span className="flex-1">
                <span className="display block text-xl" style={{ color: "#F6F1FF" }}>{p.name}</span>
                <span className="block text-sm" style={{ color: "#9F8CC9" }}>{lvl.emoji} {lvl.title} · Liv. {lvl.level}</span>
              </span>
              <span className="text-sm font-bold" style={{ color: "#FFB86B" }}>🔥 {p.progress.streak}</span>
            </button>
          );
        })}
        <button onClick={onNew} className="game-tile" style={{ justifyContent: "center", borderStyle: "dashed" }}>
          <span className="text-3xl">➕</span>
          <span className="display text-lg" style={{ color: "#F6F1FF" }}>Nuovo giocatore</span>
        </button>
      </div>
      <p className="text-xs text-center" style={{ color: "#7A68A8" }}>Ogni giocatore ha i suoi progressi, le sue gemme e la sua avventura. ✨</p>
    </div>
  );
}

function CreateProfile({ onCreate, onCancel, canCancel }) {
  const [step, setStep] = useState(0); // 0: genere · 1: nome · 2: avatar
  const [gender, setGender] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const avatars = gender ? avatarsByGender(gender) : [];

  const back = (to) => (to < 0 ? onCancel() : setStep(to));
  const BackBtn = ({ to }) => (
    <button onClick={() => back(to)} className="font-bold text-base rounded-full px-5 py-2 self-start"
      style={{ background: "#ffffff18", color: "#E7DBFF", border: "2px solid #ffffff28" }}>←</button>
  );

  return (
    <div className="flex flex-col items-center gap-6 px-5 py-10 w-full max-w-md relative z-10">
      <h2 className="display text-2xl text-center" style={{ color: "#F6F1FF" }}>Nuovo giocatore</h2>

      {step === 0 && (
        <div className="flex flex-col items-center gap-6 w-full">
          {canCancel && <BackBtn to={-1} />}
          <p className="display text-lg" style={{ color: "#CDBBF2" }}>Sei una bambina o un bambino?</p>
          <div className="flex gap-4">
            <button onClick={() => { setGender("f"); setAvatar(null); setStep(1); }} className="game-tile"
              style={{ flexDirection: "column", width: 140, alignItems: "center", gap: 8 }}>
              <span className="text-5xl">👧</span><span className="display" style={{ color: "#F6F1FF" }}>Bambina</span>
            </button>
            <button onClick={() => { setGender("m"); setAvatar(null); setStep(1); }} className="game-tile"
              style={{ flexDirection: "column", width: 140, alignItems: "center", gap: 8 }}>
              <span className="text-5xl">👦</span><span className="display" style={{ color: "#F6F1FF" }}>Bambino</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center gap-6 w-full">
          <BackBtn to={0} />
          <p className="display text-lg" style={{ color: "#CDBBF2" }}>Come ti chiami?</p>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={16} placeholder="Il tuo nome"
            className="text-center display" style={{ width: "100%", maxWidth: 300, padding: "14px 16px", borderRadius: 16, border: "2px solid #ffffff30", background: "#ffffff12", color: "#F6F1FF", fontSize: 24, outline: "none" }} />
          <button disabled={!name.trim()} onClick={() => setStep(2)} className="listen-btn"
            style={{ opacity: name.trim() ? 1 : 0.5, fontSize: "1.15rem", padding: "14px 34px" }}>Avanti →</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center gap-6 w-full">
          <BackBtn to={1} />
          <p className="display text-lg text-center" style={{ color: "#CDBBF2" }}>Scegli il tuo avatar, {name}!</p>
          <div className="grid grid-cols-4 gap-3">
            {avatars.map((a) => (
              <button key={a.id} onClick={() => setAvatar(a.id)} className="shop-card"
                style={{ border: avatar === a.id ? "3px solid #F5C64F" : "2px solid #ffffff24", background: avatar === a.id ? "#F5C64F22" : "#ffffff10" }}>
                <span style={{ fontSize: 34 }}>{a.emoji}</span>
              </button>
            ))}
          </div>
          <button disabled={!avatar} onClick={() => onCreate({ name, gender, avatar })} className="listen-btn"
            style={{ opacity: avatar ? 1 : 0.5, fontSize: "1.2rem", padding: "16px 36px" }}>✨ Inizia l'avventura!</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════ APP ═══════════ */
export default function App() {
  const [store, setStore] = useState(null); // { activeId, profiles: [...] }
  const [view, setView] = useState({ screen: "profiles" }); // profiles|create|map|island|game|shop
  const [celebrate, setCelebrate] = useState(false);
  const [dailyToast, setDailyToast] = useState(null); // bonus Fiamma Magica di oggi
  const [leveledUp, setLeveledUp] = useState(null); // overlay salita di livello
  const [shopBurst, setShopBurst] = useState(0);
  const [denyId, setDenyId] = useState(null); // carta negozio "non puoi permettertelo"
  const saveTimer = useRef(null);
  const prevLevelRef = useRef(null);
  const didInit = useRef(false);

  // Avvio: carica i profili; primo utente → creazione, altrimenti → selezione
  useEffect(() => {
    if (didInit.current) return; // evita il doppio-mount di StrictMode in dev
    didInit.current = true;
    const s = loadStore();
    setStore(s);
    setView({ screen: s.profiles.length ? "profiles" : "create" });
  }, []);

  // Profilo attivo e suoi progressi
  const activeProfile = store ? store.profiles.find((p) => p.id === store.activeId) || null : null;
  const progress = activeProfile ? activeProfile.progress : null;
  const gender = activeProfile ? activeProfile.gender : "f";
  const playerName = activeProfile ? activeProfile.name : "";

  // Aggiorna i progressi del profilo attivo (stessa firma del vecchio setProgress)
  const setProgress = useCallback((updater) => {
    setStore((s) => {
      if (!s || !s.activeId) return s;
      return {
        ...s,
        profiles: s.profiles.map((pf) =>
          pf.id === s.activeId
            ? { ...pf, progress: typeof updater === "function" ? updater(pf.progress) : updater }
            : pf
        ),
      };
    });
  }, []);

  // Salvataggio (debounced) di tutto lo store
  useEffect(() => {
    if (!store) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveStore(store), 500);
    return () => clearTimeout(saveTimer.current);
  }, [store]);

  // Rileva la salita di livello quando l'XP cambia
  useEffect(() => {
    if (!progress) return;
    const lvl = levelInfo(progress.xp, gender).level;
    if (prevLevelRef.current === null) {
      prevLevelRef.current = lvl; // prima misura o cambio utente: nessun festeggiamento
      return;
    }
    if (lvl > prevLevelRef.current) {
      setLeveledUp(levelInfo(progress.xp, gender));
      speak("Level up!");
    }
    prevLevelRef.current = lvl;
  }, [progress?.xp]); // eslint-disable-line

  // Applica la visita di oggi (Fiamma Magica + bonus) e mostra il toast (una volta)
  const applyDailyVisit = (pr) => {
    const visit = dailyVisit(pr);
    if (!visit.changed) return pr;
    setDailyToast({ bonus: visit.bonusGems, streak: visit.streak });
    setTimeout(() => setDailyToast(null), 4200);
    return {
      ...pr,
      gems: pr.gems + visit.bonusGems,
      streak: visit.streak,
      bestStreak: Math.max(pr.bestStreak || 0, visit.streak),
      lastPlayed: visit.today,
    };
  };

  const selectProfile = (id) => {
    const pf = store?.profiles.find((p) => p.id === id);
    if (!pf) return;
    audio.unlock(); // sblocca l'audio sui browser mobile (dentro il tap)
    prevLevelRef.current = null; // reindicizza: niente falso level-up al cambio utente
    const newProgress = applyDailyVisit(pf.progress);
    setStore((s) => ({
      ...s,
      activeId: id,
      profiles: s.profiles.map((p) => (p.id === id ? { ...p, progress: newProgress } : p)),
    }));
    speak(`Welcome to the Magic Kingdom, ${pf.name}!`);
    setView({ screen: "map" });
  };

  const addProfile = ({ name, gender: g, avatar }) => {
    const pf = createProfile({ name, gender: g, avatar });
    pf.progress = applyDailyVisit(pf.progress); // accende subito la fiamma del primo giorno
    audio.unlock();
    prevLevelRef.current = null;
    setStore((s) => ({ ...s, activeId: pf.id, profiles: [...s.profiles, pf] }));
    speak(`Welcome to the Magic Kingdom, ${pf.name}!`);
    setView({ screen: "map" });
  };

  const switchUser = () => {
    prevLevelRef.current = null;
    setStore((s) => ({ ...s, activeId: null }));
    setView({ screen: "profiles" });
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#2D1B4E" }}>
        <span className="text-3xl star-twinkle">✨</span>
      </div>
    );
  }

  const starsOf = (islandId, gameKey) => progress?.stars?.[islandId]?.[gameKey] || 0;
  const islandDone = (isl) => isl.games?.every((g) => starsOf(isl.id, g.key) > 0);
  const isUnlocked = (idx) => {
    const isl = ISLANDS[idx];
    if (isl.locked) return false; // content not built yet
    if (idx === 0) return true;
    return islandDone(ISLANDS[idx - 1]);
  };

  const onGem = (words = []) => setProgress((p) => {
    const weak = { ...p.weak };
    words.forEach((w) => { if (weak[w] > 0) weak[w] = weak[w] - 1; });
    return { ...p, gems: p.gems + 1, xp: p.xp + XP_PER_CORRECT, weak };
  });
  const onMiss = (words = []) => setProgress((p) => {
    const weak = { ...p.weak };
    words.forEach((w) => { weak[w] = (weak[w] || 0) + 2; });
    return { ...p, weak };
  });
  const finishGame = (islandId, gameKey) => (starCount) => {
    setProgress((p) => {
      const prev = p.stars?.[islandId]?.[gameKey] || 0;
      const stars = Math.max(prev, starCount);
      const gained = Math.max(0, stars - prev); // XP bonus solo per le stelle NUOVE
      return {
        ...p,
        xp: p.xp + gained * XP_PER_STAR,
        stars: { ...p.stars, [islandId]: { ...(p.stars[islandId] || {}), [gameKey]: stars } },
      };
    });
    setView({ screen: "island", islandId });
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2600);
  };

  // Negozio: compra (se serve e puoi) oppure equipaggia; i compagni si tolgono
  const buyEquip = (item) => {
    if (!progress) return;
    const owned = isOwned(item, progress.owned);
    if (!owned && progress.gems < item.cost) {
      setDenyId(item.id);
      setTimeout(() => setDenyId(null), 450);
      return;
    }
    if (!owned) setShopBurst((b) => b + 1);
    setProgress((p) => {
      const slot = item.cat; // "me" | "pet" | "sky"
      if (!isOwned(item, p.owned)) {
        return {
          ...p,
          gems: p.gems - item.cost,
          owned: { ...p.owned, [item.id]: true },
          equipped: { ...p.equipped, [slot]: item.id },
        };
      }
      if (slot === "pet" && p.equipped.pet === item.id) {
        return { ...p, equipped: { ...p.equipped, pet: null } }; // togli il compagno
      }
      return { ...p, equipped: { ...p.equipped, [slot]: item.id } };
    });
  };

  const currentIsland = ISLANDS.find((i) => i.id === view.islandId);
  const currentGame = currentIsland?.games?.find((g) => g.key === view.gameKey);
  const weakCount = progress ? Object.values(progress.weak).filter((v) => v > 0).length : 0;
  const islandsFreed = ISLANDS.filter((isl) => isl.games && islandDone(isl)).length;
  const sky = skyGradient(progress ? progress.equipped.sky : "sky_night");

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-hidden relative"
      style={{ background: sky, fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;700;800&display=swap');
        .display { font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif; }
        .opt-btn { transition: transform .12s; }
        .opt-btn:active { transform: scale(.92); }
        .word-btn { font-family:'Baloo 2',sans-serif; font-size: 1.5rem; font-weight: 800; color: #4A2F8E; background: #F6F1FF; border: none; border-radius: 22px; padding: 16px 30px; box-shadow: 0 6px 0 #C9B6EE; transition: transform .1s; }
        .word-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #C9B6EE; }
        .listen-btn { font-weight: 800; font-size: 1.05rem; color: #2D1B4E; background: linear-gradient(180deg,#F8D978,#E0AC3C); border:none; border-radius: 999px; padding: 12px 26px; box-shadow: 0 5px 0 #B8892E; }
        .listen-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 #B8892E; }
        .memory-card { width: 108px; height: 108px; border-radius: 20px; display:flex; align-items:center; justify-content:center; transition: all .25s; }
        .game-tile { width: 100%; max-width: 380px; display:flex; align-items:center; gap:18px; background: #ffffff12; border: 2px solid #ffffff24; border-radius: 26px; padding: 18px 22px; transition: transform .12s, background .2s; text-align:left; }
        .game-tile:active { transform: scale(.97); background:#ffffff20; }
        @keyframes flyOut { from { transform: translate(0,0) scale(.4); opacity:1; } to { transform: translate(var(--dx), var(--dy)) scale(1.15); opacity:0; } }
        .sparkle-fly { animation: flyOut .95s ease-out forwards; }
        @keyframes twinkle { 0%,100% { transform: scale(1); filter:brightness(1);} 50% { transform: scale(1.18); filter:brightness(1.5);} }
        .star-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
        @keyframes popIn { 0% { transform: scale(0);} 70% { transform: scale(1.5);} 100% { transform: scale(1);} }
        .gem-pop { animation: popIn .5s ease-out; }
        @keyframes shakeX { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-8px);} 75% { transform: translateX(8px);} }
        .shake { animation: shakeX .35s ease-in-out; }
        @keyframes floatY { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-9px);} }
        .float { animation: floatY 4.5s ease-in-out infinite; }
        @keyframes flick { 0%,100% { transform: scale(1) rotate(-3deg); filter: brightness(1);} 50% { transform: scale(1.15) rotate(3deg); filter: brightness(1.4);} }
        .flame-flicker { animation: flick 1.6s ease-in-out infinite; }
        .shop-card { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 6px; border-radius:18px; transition: transform .12s; }
        .shop-card:active { transform: scale(.95); }
        @keyframes toastIn { from { opacity:0; transform: translateY(-12px);} to { opacity:1; transform: translateY(0);} }
        .toast-in { animation: toastIn .4s ease-out; }
        @media (prefers-reduced-motion: reduce) { .sparkle-fly,.star-twinkle,.gem-pop,.shake,.float,.flame-flicker { animation: none !important; } }
      `}</style>

      {Array.from({ length: 22 }).map((_, i) => (
        <span key={i} className="star-twinkle absolute select-none pointer-events-none"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, fontSize: i % 3 ? 10 : 15, opacity: 0.5, animationDelay: `${i * 300}ms` }}>✦</span>
      ))}

      {/* ── Bonus giornaliero (Fiamma Magica) & salita di livello ── */}
      {dailyToast && <DailyToast info={dailyToast} />}
      {leveledUp && <LevelUpOverlay lvl={leveledUp} gender={gender} onClose={() => setLeveledUp(null)} />}

      {/* ── SELEZIONE PROFILO (il tocco qui sblocca anche l'audio) ── */}
      {view.screen === "profiles" && (
        <ProfilesScreen store={store} onSelect={selectProfile} onNew={() => setView({ screen: "create" })} />
      )}

      {/* ── NUOVO GIOCATORE ── */}
      {view.screen === "create" && (
        <CreateProfile canCancel={store.profiles.length > 0} onCancel={() => setView({ screen: "profiles" })} onCreate={addProfile} />
      )}

      {/* ── MAP ── */}
      {view.screen === "map" && progress && (
        <div className="flex flex-col items-center gap-5 px-5 py-8 w-full max-w-md relative z-10">
          <h1 className="display text-center leading-tight" style={{ fontSize: "2rem", color: "#F6F1FF", textShadow: "0 3px 16px #8E5FD980" }}>
            Isola Magica
          </h1>
          <RoyalHeader progress={progress} gender={gender} name={playerName} crownFilled={islandsFreed} onShop={() => setView({ screen: "shop" })} onSwitch={switchUser} />
          {weakCount > 0 && (
            <div className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>
              🌟 {weakCount} gemme perdute da ritrovare — torneranno nei giochi!
            </div>
          )}
          <div className="flex flex-col gap-4 w-full items-center mt-1">
            {ISLANDS.map((isl, idx) => {
              const unlocked = isUnlocked(idx);
              const done = isl.games ? islandDone(isl) : false;
              const totalStars = isl.games ? isl.games.reduce((s, g) => s + starsOf(isl.id, g.key), 0) : 0;
              return (
                <button key={isl.id} className="game-tile" disabled={!unlocked}
                  style={{ opacity: unlocked ? 1 : 0.45 }}
                  onClick={() => unlocked && setView({ screen: "island", islandId: isl.id })}>
                  <span className="text-4xl">{unlocked ? isl.emoji : "🔒"}</span>
                  <span className="flex-1">
                    <span className="display block text-lg leading-snug" style={{ color: "#F6F1FF" }}>
                      Isola {idx + 1} · {isl.name} {done && "✅"}
                    </span>
                    <span className="block text-sm" style={{ color: "#9F8CC9" }}>
                      {unlocked ? isl.sub : isl.locked ? "In arrivo…" : "Completa l'isola precedente"}
                    </span>
                  </span>
                  {unlocked && isl.games && <span className="font-bold text-sm" style={{ color: "#F0D98C" }}>⭐ {totalStars}/{isl.games.length * 3}</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "#7A68A8" }}>
            🔊 Attiva l'audio del tablet — le voci parlano in inglese! I progressi si salvano da soli.
          </p>
        </div>
      )}

      {/* ── SHOP ── */}
      {view.screen === "shop" && progress && (
        <ShopScreen
          progress={progress}
          gender={gender}
          burst={shopBurst}
          denyId={denyId}
          onBuyEquip={buyEquip}
          onBack={() => setView({ screen: "map" })}
        />
      )}

      {/* ── ISLAND ── */}
      {view.screen === "island" && currentIsland && (
        <div className="flex flex-col items-center gap-5 px-5 py-8 w-full max-w-md relative z-10">
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setView({ screen: "map" })}
              className="font-bold text-base rounded-full px-5 py-2"
              style={{ background: "#ffffff18", color: "#E7DBFF", border: "2px solid #ffffff28" }}>← Mappa</button>
            <span className="font-bold" style={{ color: "#F0D98C" }}>💎 {progress.gems}</span>
          </div>
          <h2 className="display text-2xl text-center leading-snug" style={{ color: "#F6F1FF" }}>
            {currentIsland.emoji} {currentIsland.name}
          </h2>
          {celebrate && (
            <div className="display text-xl gem-pop text-center" style={{ color: "#F5C64F" }}>✨ Ottimo lavoro, {playerName}! ✨</div>
          )}
          <div className="flex flex-col gap-4 w-full items-center">
            {currentIsland.games.map((g) => (
              <button key={g.key} className="game-tile"
                onClick={() => { audio.unlock(); setView({ screen: "game", islandId: currentIsland.id, gameKey: g.key }); }}>
                <span className="text-4xl">{g.emoji}</span>
                <span className="flex-1">
                  <span className="display block text-xl" style={{ color: "#F6F1FF" }}>{g.title}</span>
                </span>
                <Stars n={starsOf(currentIsland.id, g.key)} />
              </button>
            ))}
          </div>
          {islandDone(currentIsland) && (
            <p className="text-center font-semibold" style={{ color: "#CDBBF2" }}>
              🎉 Isola liberata! La prossima isola è sbloccata sulla mappa.
            </p>
          )}
        </div>
      )}

      {/* ── GAME ── */}
      {view.screen === "game" && currentIsland && currentGame && (
        <div className="flex flex-col items-center gap-4 px-5 py-6 w-full max-w-md relative z-10">
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setView({ screen: "island", islandId: currentIsland.id })}
              className="font-bold text-base rounded-full px-5 py-2"
              style={{ background: "#ffffff18", color: "#E7DBFF", border: "2px solid #ffffff28" }}>← Isola</button>
            <span className="font-bold" style={{ color: "#F0D98C" }}>💎 {progress.gems}</span>
          </div>
          <h2 className="display text-2xl" style={{ color: "#F6F1FF" }}>{currentGame.emoji} {currentGame.title}</h2>
          {currentGame.type === "listentap" && (
            <ListenTapGame speak={speak} cfg={currentGame.cfg} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "count" && (
            <CountGame speak={speak} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "memory" && (
            <MemoryGame speak={speak} cfg={currentGame.cfg}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
        </div>
      )}
    </div>
  );
}
