import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { speak, audio } from "./audio";
import { micSupported, listenOnce, matchesSpoken } from "./mic";
import { loadStore, createProfile, avatarById, avatarsByGender } from "./profiles";
import { subscribeProfiles, pushProfiles } from "./cloudStore";

// L'ID del profilo attivo (chi gioca su QUESTO dispositivo) resta locale:
// non si sincronizza, così ogni dispositivo può avere un bimbo diverso al lavoro.
const ACTIVE_KEY = "isola-magica-active-v1";
import {
  levelInfo, dailyVisit, todayStr, skyGradient, shopItem,
  SHOP, SHOP_CATS, isOwned, XP_PER_CORRECT, XP_PER_STAR,
} from "./progression";
import { ARC8_ISLANDS } from "./comprehension.js";
import { ARC9_ISLANDS } from "./exams.js";
import { ARC10_ISLANDS } from "./dialogues.js";
import {
  GRAM_QUESTIONS, GRAM_NEGATIVES, GRAM_PAST, GRAM_COMPARE, GRAM_CONDITIONAL,
  CLOZE_VERBFORMS, CLOZE_ARTICLES, CLOZE_TOBE, CLOZE_QUANTIFIERS,
  GRAM_BOSS_ORDER, GRAM_EXAM,
} from "./grammar.js";

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

// Verdure (Isola 5 "L'Orto Reale") — vocabolario Cambridge food/vegetables.
// "carrot" è anche in FOOD: piccolo ripasso voluto (la sua voce è già incisa).
const VEGETABLES = [
  { en: "carrot", emoji: "🥕" },
  { en: "tomato", emoji: "🍅" },
  { en: "potato", emoji: "🥔" },
  { en: "onion", emoji: "🧅" },
  { en: "peas", emoji: "🫛" },
  { en: "corn", emoji: "🌽" },
  { en: "pepper", emoji: "🫑" },
  { en: "cucumber", emoji: "🥒" },
  { en: "mushroom", emoji: "🍄" },
  { en: "broccoli", emoji: "🥦" },
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

/* ─── Render/style condivisi per i giochi (compattezza) ─── */
const tileStyle = () => ({
  width: 128, height: 128, borderRadius: 28,
  background: "#ffffff14", border: "3px solid #ffffff30",
  display: "flex", alignItems: "center", justifyContent: "center",
});
const wordTileStyle = () => ({
  minWidth: 120, padding: "18px 22px", borderRadius: 20,
  background: "#F6F1FF", border: "none", boxShadow: "0 5px 0 #C9B6EE",
});
const emojiRender = (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span>;
const textRender = (a) => <span className="display" style={{ fontSize: 22, fontWeight: 800, color: "#4A2F8E" }}>{a.en}</span>;

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
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      {cfg.showWord && (
        <div className="display text-3xl" style={{ color: "#F5C64F" }}>{cfg.sayOf(target)}</div>
      )}
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

/* Say it! — guarda, ascolta e ripeti al microfono (riconoscimento vocale) */
function SayGame({ speak, cfg, weak, onGem, onMiss, onDone }) {
  const ROUNDS_SAY = 6;
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [state, setState] = useState("idle"); // idle | listening | correct | retry
  const [heard, setHeard] = useState("");
  const [burst, setBurst] = useState(0);
  const mistakes = useRef(0);
  const stopRef = useRef(null);
  const supported = micSupported();

  const goalOf = (t) => (cfg.say ? cfg.say(t) : cfg.sayOf(t));

  const newRound = useCallback(() => {
    const t = pickTarget(cfg.pool, weak, cfg.keyOf);
    setTarget(t); setState("idle"); setHeard("");
    setTimeout(() => audio.whenIdle().then(() => speak(cfg.say ? cfg.say(t) : cfg.sayOf(t))), 450);
  }, [speak, cfg, weak]);

  useEffect(() => {
    newRound();
    return () => { if (stopRef.current) stopRef.current(); };
  }, []); // eslint-disable-line

  const advance = () => {
    if (round + 1 >= ROUNDS_SAY) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
    else { setRound((r) => r + 1); newRound(); }
  };

  const succeed = () => {
    setState("correct"); setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
    speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]);
    setTimeout(advance, 1600);
  };

  const listen = () => {
    if (state === "listening" || state === "correct") return;
    setState("listening"); setHeard("");
    const goal = goalOf(target);
    stopRef.current = listenOnce({
      onResult: (alts) => {
        if (!alts) { setState("retry"); return; }
        setHeard(alts[0] || "");
        if (matchesSpoken(alts, goal) || matchesSpoken(alts, cfg.keyOf(target))) {
          succeed();
        } else {
          mistakes.current += 1; onMiss(cfg.wordsOf(target)); setState("retry");
          setTimeout(() => audio.whenIdle().then(() => speak(goalOf(target))), 200);
        }
      },
    });
  };

  // Fallback senza riconoscimento vocale: si ripete e si auto-valuta
  const iSaidIt = () => {
    setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
    speak(PRAISE[rand(PRAISE.length)]);
    setTimeout(advance, 1200);
  };

  if (!target) return null;
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS_SAY} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      <div className="flex items-center justify-center" style={{ width: 150, height: 150, borderRadius: 32, background: "#ffffff12", border: "3px solid #ffffff28" }}>
        {cfg.render ? cfg.render(target) : null}
      </div>
      <div className="display text-2xl text-center" style={{ color: "#F6F1FF" }}>{goalOf(target)}</div>
      <button onClick={() => speak(goalOf(target))} className="listen-btn">🔊 Riascolta</button>

      {supported ? (
        <>
          <button onClick={listen} disabled={state === "listening" || state === "correct"}
            className={`mic-btn ${state === "listening" ? "mic-pulse" : ""}`}
            style={{ background: state === "listening" ? "#E8455A" : state === "correct" ? "linear-gradient(180deg,#3DBE6B,#2E9A54)" : "linear-gradient(180deg,#8E5FD9,#5A3AA0)" }}>
            {state === "listening" ? "🎙️ Ti ascolto…" : state === "correct" ? "✅ Bravissima!" : "🎤 Tocca e parla"}
          </button>
          {state === "retry" && (
            <p className="text-sm text-center" style={{ color: "#F5A9B8" }}>
              Riprova! {heard ? `(ho sentito: "${heard}")` : ""}
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-center" style={{ color: "#9F8CC9" }}>Ripeti ad alta voce, poi tocca ✅</p>
          <button onClick={iSaidIt} className="mic-btn" style={{ background: "linear-gradient(180deg,#3DBE6B,#2E9A54)" }}>✅ L'ho detto!</button>
        </div>
      )}
    </div>
  );
}

/* Spelling / Scrittura — guarda l'immagine, ascolta, tocca le lettere in ordine per
   comporre la parola inglese. Introduce la SCRITTURA (verso il B1). Le lettere sono
   già date (mescolate): riordina guidato dal suono → sfidante ma sempre completabile. */
function SpellGame({ speak, cfg, weak, onGem, onMiss, onDone }) {
  const ROUNDS_SP = 6;
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [tiles, setTiles] = useState([]);   // { ch, id } lettere mescolate
  const [built, setBuilt] = useState([]);    // id delle lettere già posate, in ordine
  const [wrongId, setWrongId] = useState(null);
  const [show, setShow] = useState(false);   // "vedi la parola" (aiuto)
  const [burst, setBurst] = useState(0);
  const [locked, setLocked] = useState(false);
  const mistakes = useRef(0);

  const lettersOf = (t) => cfg.keyOf(t).replace(/[^a-zA-Z]/g, "").toUpperCase().split("");

  const newRound = useCallback(() => {
    const t = pickTarget(cfg.pool, weak, cfg.keyOf);
    const ls = lettersOf(t);
    let sh = shuffle(ls.map((ch, i) => ({ ch, id: i })));
    if (ls.length > 2 && sh.map((x) => x.ch).join("") === ls.join("")) sh = shuffle(sh);
    setTarget(t); setTiles(sh); setBuilt([]); setWrongId(null); setShow(false); setLocked(false);
    setTimeout(() => audio.whenIdle().then(() => speak(cfg.sayOf(t))), 450);
  }, [speak, cfg, weak]);

  useEffect(() => { newRound(); }, []); // eslint-disable-line

  const advance = () => {
    if (round + 1 >= ROUNDS_SP) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
    else { setRound((r) => r + 1); newRound(); }
  };

  const tapTile = (tile) => {
    if (locked || built.includes(tile.id)) return;
    const goal = lettersOf(target);
    if (tile.ch === goal[built.length]) {
      const nb = [...built, tile.id];
      setBuilt(nb);
      if (nb.length === goal.length) {
        setLocked(true); setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
        setTimeout(() => speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]), 220);
        setTimeout(advance, 1700);
      }
    } else {
      mistakes.current += 1; onMiss(cfg.wordsOf(target)); setWrongId(tile.id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  if (!target) return null;
  const goal = lettersOf(target);
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS_SP} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      <div className="flex items-center justify-center" style={{ width: 128, height: 128, borderRadius: 28, background: "#ffffff12", border: "3px solid #ffffff28" }}>
        <span style={{ fontSize: 64 }}>{target.emoji}</span>
      </div>
      <button onClick={() => speak(cfg.sayOf(target))} className="listen-btn">🔊 Riascolta</button>
      {/* slot della parola */}
      <div className="flex flex-wrap justify-center gap-2">
        {goal.map((ch, i) => {
          const placed = i < built.length;
          return (
            <span key={i} style={{
              width: 42, height: 52, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 26,
              color: placed ? "#4A2F8E" : "#8E5FD9",
              background: placed ? "#F6F1FF" : "#ffffff10",
              border: placed ? "none" : "2px dashed #ffffff3a",
            }}>
              {placed ? ch : (show ? ch : "")}
            </span>
          );
        })}
      </div>
      {/* lettere mescolate da toccare */}
      <div className="flex flex-wrap justify-center gap-3 mt-1" style={{ maxWidth: 380 }}>
        {tiles.map((t) => {
          const used = built.includes(t.id);
          return (
            <button key={t.id} onClick={() => tapTile(t)} disabled={used || locked}
              className={`${wrongId === t.id ? "shake" : ""}`}
              style={{
                width: 52, height: 60, borderRadius: 14, fontWeight: 900, fontSize: 26,
                color: used ? "#ffffff40" : "#4A2F8E",
                background: used ? "#ffffff10" : "#F6F1FF",
                border: "none", boxShadow: used ? "none" : "0 4px 0 #C9B6EE",
                opacity: used ? 0.4 : 1, transition: "all .15s",
              }}>
              {t.ch}
            </button>
          );
        })}
      </div>
      <button onClick={() => setShow((s) => !s)} className="text-sm font-semibold px-4 py-2 rounded-full"
        style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>
        {show ? "🙈 Nascondi" : "👀 Vedi la parola"}
      </button>
    </div>
  );
}

/* Costruttore di frasi (tessere-parola) — ascolta la frase, poi rimettila in
   ordine toccando le PAROLE mescolate. Introduce la PRODUZIONE (verso A2/B1).
   Fork di SpellGame con le parole al posto delle lettere. Accetta più ordini
   validi via cfg.accepted(t) (permutazioni corrette). Tutto chiuso e corretto
   sul dispositivo: si confronta la sequenza costruita con gli ordini autorati. */
function OrderGame({ speak, cfg, weak, onGem, onMiss, onDone }) {
  const ROUNDS_OR = 6;
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [tiles, setTiles] = useState([]);   // { w, id } parole mescolate
  const [built, setBuilt] = useState([]);    // id delle parole già posate, in ordine
  const [wrongId, setWrongId] = useState(null);
  const [show, setShow] = useState(false);   // "vedi la frase" (aiuto)
  const [burst, setBurst] = useState(0);
  const [locked, setLocked] = useState(false);
  const mistakes = useRef(0);

  const wordsOf = (s) => String(s).trim().split(/\s+/);
  const norm = (w) => String(w).toLowerCase();
  // Tutte le sequenze accettate (canonica + alternative) come array di parole minuscole
  const seqsOf = (t) => [cfg.build(t), ...((cfg.accepted && cfg.accepted(t)) || [])]
    .map((s) => wordsOf(s).map(norm));

  const newRound = useCallback(() => {
    const t = pickTarget(cfg.pool, weak, cfg.keyOf);
    const words = wordsOf(cfg.build(t));
    let sh = shuffle(words.map((w, i) => ({ w, id: i })));
    if (words.length > 2 && sh.map((x) => x.w).join(" ") === words.join(" ")) sh = shuffle(sh);
    setTarget(t); setTiles(sh); setBuilt([]); setWrongId(null); setShow(false); setLocked(false);
    setTimeout(() => audio.whenIdle().then(() => speak(cfg.sayOf(t))), 450);
  }, [speak, cfg, weak]);

  useEffect(() => { newRound(); }, []); // eslint-disable-line

  const advance = () => {
    if (round + 1 >= ROUNDS_OR) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
    else { setRound((r) => r + 1); newRound(); }
  };

  const builtWords = built.map((id) => { const t = tiles.find((x) => x.id === id); return t ? norm(t.w) : ""; });
  const totalWords = target ? wordsOf(cfg.build(target)).length : 0;

  const tapTile = (tile) => {
    if (locked || built.includes(tile.id)) return;
    const candidate = [...builtWords, norm(tile.w)];
    const seqs = seqsOf(target);
    // valido se è prefisso di almeno una sequenza accettata
    const ok = seqs.some((seq) => seq.length >= candidate.length && candidate.every((w, i) => seq[i] === w));
    if (!ok) {
      mistakes.current += 1; onMiss(cfg.wordsOf(target)); setWrongId(tile.id);
      setTimeout(() => setWrongId(null), 500);
      return;
    }
    const nb = [...built, tile.id];
    setBuilt(nb);
    if (nb.length === totalWords) {
      setLocked(true); setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
      setTimeout(() => speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]), 220);
      setTimeout(advance, 1900);
    }
  };

  if (!target) return null;
  const words = wordsOf(cfg.build(target));
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS_OR} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      {cfg.it && <p className="text-base font-semibold text-center" style={{ color: "#F5C64F" }}>{cfg.it(target)}</p>}
      <button onClick={() => speak(cfg.sayOf(target))} className="listen-btn">🔊 Ascolta la frase</button>
      {/* slot della frase */}
      <div className="flex flex-wrap justify-center gap-2" style={{ maxWidth: 420 }}>
        {words.map((w, i) => {
          const placedId = built[i];
          const placed = placedId != null;
          const label = placed ? (tiles.find((t) => t.id === placedId) || {}).w : (show ? w : "");
          return (
            <span key={i} style={{
              minWidth: 52, height: 46, padding: "0 12px", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 18,
              color: placed ? "#4A2F8E" : "#8E5FD9",
              background: placed ? "#F6F1FF" : "#ffffff10",
              border: placed ? "none" : "2px dashed #ffffff3a",
            }}>{label}</span>
          );
        })}
      </div>
      {/* tessere-parola mescolate da toccare */}
      <div className="flex flex-wrap justify-center gap-3 mt-1" style={{ maxWidth: 420 }}>
        {tiles.map((t) => {
          const used = built.includes(t.id);
          return (
            <button key={t.id} onClick={() => tapTile(t)} disabled={used || locked}
              className={`${wrongId === t.id ? "shake" : ""}`}
              style={{
                minWidth: 52, padding: "12px 16px", borderRadius: 14, fontWeight: 800, fontSize: 18,
                color: used ? "#ffffff40" : "#4A2F8E",
                background: used ? "#ffffff10" : "#F6F1FF",
                border: "none", boxShadow: used ? "none" : "0 4px 0 #C9B6EE",
                opacity: used ? 0.4 : 1, transition: "all .15s",
              }}>
              {t.w}
            </button>
          );
        })}
      </div>
      <button onClick={() => setShow((s) => !s)} className="text-sm font-semibold px-4 py-2 rounded-full"
        style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>
        {show ? "🙈 Nascondi" : "👀 Vedi la frase"}
      </button>
    </div>
  );
}

/* Riempi-il-buco (banco di tessere) — leggi la frase con lo spazio, tocca la
   parola giusta dal banco. Correzione per confronto normalizzato con la risposta
   autorata: solo le tessere fornite sono valutabili → tutto chiuso e sul dispositivo. */
function ClozeGame({ speak, cfg, weak, onGem, onMiss, onDone }) {
  const ROUNDS_CL = 6;
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [bank, setBank] = useState([]);
  const [filled, setFilled] = useState(null); // parola giusta posata
  const [wrongW, setWrongW] = useState(null);
  const [burst, setBurst] = useState(0);
  const [locked, setLocked] = useState(false);
  const mistakes = useRef(0);
  const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const newRound = useCallback(() => {
    const t = pickTarget(cfg.pool, weak, cfg.keyOf);
    setBank(shuffle(cfg.bankOf(t))); setTarget(t); setFilled(null); setWrongW(null); setLocked(false);
  }, [cfg, weak]);

  useEffect(() => { newRound(); }, []); // eslint-disable-line

  const advance = () => {
    if (round + 1 >= ROUNDS_CL) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
    else { setRound((r) => r + 1); newRound(); }
  };

  const pick = (w) => {
    if (locked) return;
    if (norm(w) === norm(cfg.answerOf(target))) {
      setFilled(w); setLocked(true); setBurst((b) => b + 1); onGem(cfg.wordsOf(target));
      setTimeout(() => speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]), 220);
      setTimeout(advance, 1800);
    } else {
      mistakes.current += 1; onMiss(cfg.wordsOf(target)); setWrongW(w);
      setTimeout(() => setWrongW(null), 500);
    }
  };

  if (!target) return null;
  const parts = String(cfg.textOf(target)).split("___");
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS_CL} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      {cfg.it && <p className="text-sm text-center" style={{ color: "#9F8CC9" }}>{cfg.it(target)}</p>}
      {/* la frase col buco */}
      <div className="display text-center" style={{ fontSize: 24, color: "#F6F1FF", maxWidth: 440, lineHeight: 1.6 }}>
        {parts[0]}
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: 70, padding: "2px 12px", margin: "0 4px", borderRadius: 10,
          color: filled ? "#4A2F8E" : "#8E5FD9",
          background: filled ? "#F6F1FF" : "#ffffff10",
          border: filled ? "none" : "2px dashed #ffffff3a", fontWeight: 900,
        }}>{filled || "?"}</span>
        {parts[1]}
      </div>
      {/* banco di tessere */}
      <div className="flex flex-wrap justify-center gap-3 mt-1" style={{ maxWidth: 420 }}>
        {bank.map((w, i) => {
          const done = locked && norm(w) !== norm(cfg.answerOf(target));
          return (
            <button key={i} onClick={() => pick(w)} disabled={locked}
              className={`${wrongW === w ? "shake" : ""}`}
              style={{
                minWidth: 64, padding: "14px 18px", borderRadius: 14, fontWeight: 800, fontSize: 20,
                color: "#4A2F8E", background: "#F6F1FF", border: "none",
                boxShadow: "0 4px 0 #C9B6EE", opacity: done ? 0.4 : 1, transition: "all .15s",
              }}>
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Comprensione (Arcipelago 8 · Lettura e Ascolto): uno STIMOLO condiviso che
   resta a schermo — un testo da rileggere ("read") o un audio da riascoltare
   ("listen") — con più DOMANDE collegate a scelta multipla e distrattori
   autorati. Stile Cambridge A2 Key (Reading Parti 1-3 / Listening Parti 1&4).
   Tutto CHIUSO e corretto sul dispositivo: zero AI, zero costi. Se cfg.diploma
   è impostato, alla fine mostra la pagella-diploma come il BOSS-esame. */
function ReadSceneGame({ speak, cfg, name, onGem, onMiss, onDone }) {
  const scenes = cfg.pool;
  // lista piatta delle domande, mantenendo il legame con la scena di origine
  const flat = scenes.flatMap((s, si) => s.questions.map((q, qi) => ({ s, si, q, qi })));
  const total = flat.length;
  const [pos, setPos] = useState(0);
  const [opts, setOpts] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongI, setWrongI] = useState(null);
  const [burst, setBurst] = useState(0);
  const [show, setShow] = useState(false);     // "vedi il testo" (aiuto per l'ascolto)
  const [finished, setFinished] = useState(false);
  const mistakes = useRef(0);

  const cur = flat[pos];

  // A ogni domanda: rimescola le opzioni e, se è la prima domanda di una scena
  // "listen", fa partire l'audio dello stimolo (le scene "read" non parlano da sole).
  useEffect(() => {
    if (!cur) return;
    setOpts(shuffle(cur.q.options.slice()));
    setLocked(false); setWrongI(null); setShow(false);
    if (cur.s.mode === "listen" && cur.qi === 0) {
      const t = setTimeout(() => audio.whenIdle().then(() => speak(cur.s.text)), 500);
      return () => clearTimeout(t);
    }
  }, [pos]); // eslint-disable-line

  const pick = (opt, i) => {
    if (locked || !cur) return;
    if (opt === cur.q.answer) {
      // comprensione: assegna gemma+XP ma NON tocca le "gemme perdute" (le
      // frasi-risposta non sono vocaboli e questo motore non le ripesca) → []
      setLocked(true); setBurst((b) => b + 1); onGem([]);
      setTimeout(() => speak(PRAISE[rand(PRAISE.length)]), 200);
      setTimeout(() => {
        if (pos + 1 >= total) {
          if (cfg.diploma) setFinished(true);
          else onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
        } else setPos((p) => p + 1);
      }, 1300);
    } else {
      mistakes.current += 1; setWrongI(i); onMiss([]);
      setTimeout(() => setWrongI(null), 600);
    }
  };

  if (finished) {
    const stars = mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1;
    const diploma = cfg.diploma;
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <SparkleBurst trigger={1} />
        <div className="text-6xl gem-pop">🎓</div>
        <h3 className="display text-2xl" style={{ color: "#F5C64F" }}>Diploma di {diploma}</h3>
        <div className="rounded-2xl px-6 py-5" style={{ background: "#ffffff10", border: "2px solid #F5C64F55" }}>
          <p className="display text-xl" style={{ color: "#F6F1FF" }}>{name}</p>
          <p className="text-sm" style={{ color: "#CDBBF2" }}>ha superato la grande prova di comprensione!</p>
          <div className="text-2xl mt-2">{[1, 2, 3].map((i) => <span key={i} style={{ opacity: i <= stars ? 1 : 0.25 }}>⭐</span>)}</div>
          <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{total - mistakes.current > 0 ? total - Math.min(mistakes.current, total) : 0}/{total} al primo colpo</p>
        </div>
        <button onClick={() => onDone(stars)} className="listen-btn" style={{ fontSize: "1.15rem", padding: "14px 32px" }}>🎉 Evviva!</button>
      </div>
    );
  }

  if (!cur) return null;
  const scene = cur.s;
  const isListen = scene.mode === "listen";
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={total} done={pos} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      {/* ── stimolo condiviso: resta a schermo per tutte le domande della scena ── */}
      <div className="rounded-3xl px-5 py-4 w-full" style={{ background: "#ffffff10", border: "2px solid #ffffff22", maxWidth: 440 }}>
        <p className="text-sm mb-2" style={{ color: "#9F8CC9" }}>{scene.it}</p>
        {isListen ? (
          <div className="flex flex-col items-center gap-3">
            <button onClick={() => speak(scene.text)} className="listen-btn">🎧 Ascolta di nuovo</button>
            {show && <p className="display text-base text-center" style={{ color: "#F6F1FF", lineHeight: 1.5, whiteSpace: "pre-line" }}>{scene.text}</p>}
            <button onClick={() => setShow((s) => !s)} className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>
              {show ? "🙈 Nascondi il testo" : "👀 Vedi il testo"}
            </button>
          </div>
        ) : (
          <>
            <p className="display text-base" style={{ color: "#F6F1FF", lineHeight: 1.55, whiteSpace: "pre-line" }}>{scene.text}</p>
            <button onClick={() => speak(scene.text)} className="text-xs font-semibold px-3 py-1 rounded-full mt-2"
              style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>🔊 Ascolta</button>
          </>
        )}
      </div>
      {/* ── la domanda ── */}
      <div className="text-center">
        <p className="display text-lg" style={{ color: "#F5C64F" }}>{cur.q.q}</p>
        {cur.q.qit && <p className="text-sm" style={{ color: "#9F8CC9" }}>{cur.q.qit}</p>}
      </div>
      {/* ── opzioni (lista verticale: sono frasi, non emoji) ── */}
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: 440 }}>
        {opts.map((opt, i) => {
          const right = locked && opt === cur.q.answer;
          return (
            <button key={i} onClick={() => pick(opt, i)} disabled={locked}
              className={`${wrongI === i ? "shake" : ""}`}
              style={{
                padding: "14px 18px", borderRadius: 16, fontWeight: 700, fontSize: 17,
                color: right ? "#1E5C34" : "#4A2F8E",
                background: right ? "#D8F5DF" : "#F6F1FF",
                border: "none", boxShadow: right ? "0 4px 0 #A9DDB8" : "0 4px 0 #C9B6EE",
                textAlign: "left", transition: "all .15s",
              }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Abbinamenti (Arcipelago 9 · L'Accademia degli Esami): a schermo una colonna di
   INDIZI a sinistra e una di FIGURE/RISPOSTE a destra (mescolate, con eventuali
   distrattori). Il bambino tocca un indizio (lo sente) e poi la figura giusta.
   Stile Cambridge A2 Key (Listening Part 5 / abbinamenti di lettura). Ogni round
   ha 3-4 coppie con UNA sola corrispondenza corretta. Tutto CHIUSO e corretto sul
   dispositivo — zero AI, zero costi. Con cfg.diploma mostra la pagella finale. */
function MatchGame({ speak, cfg, name, onGem, onMiss, onDone }) {
  const rounds = cfg.pool;
  const [ri, setRi] = useState(0);
  const [sel, setSel] = useState(null);      // indice dell'indizio scelto a sinistra
  const [doneL, setDoneL] = useState([]);    // indizi già abbinati
  const [doneR, setDoneR] = useState([]);    // figure già abbinate (indici nell'array mescolato)
  const [rights, setRights] = useState([]);  // [{r, emoji}] mescolate + distrattori
  const [wrongR, setWrongR] = useState(null);
  const [burst, setBurst] = useState(0);
  const [finished, setFinished] = useState(false);
  const mistakes = useRef(0);

  const round = rounds[ri];
  const listen = !!(round && round.listen);

  useEffect(() => {
    if (!round) return;
    const base = round.pairs.map((p) => ({ r: p.r, emoji: p.emoji }));
    const ex = (round.extra || []).map((e) => ({ r: e.r, emoji: e.emoji }));
    setRights(shuffle([...base, ...ex]));
    setDoneL([]); setDoneR([]); setWrongR(null);
    if (round.listen) {
      // ascolto: il primo indizio è già "attivo" e parte da solo → si tocca la figura
      setSel(0);
      const t = setTimeout(() => audio.whenIdle().then(() => speak(round.pairs[0].say)), 500);
      return () => clearTimeout(t);
    }
    setSel(null);
  }, [ri]); // eslint-disable-line

  const selectLeft = (li) => {
    if (doneL.includes(li)) return;
    setSel(li); speak(round.pairs[li].say);
  };

  const pickRight = (rIdx) => {
    if (sel === null || doneR.includes(rIdx) || !round) return;
    if (rights[rIdx].r === round.pairs[sel].r) {
      const nL = [...doneL, sel];
      setDoneL(nL); setDoneR([...doneR, rIdx]); setBurst((b) => b + 1); onGem([]);
      setTimeout(() => speak(PRAISE[rand(PRAISE.length)]), 150);
      if (nL.length === round.pairs.length) {
        setSel(null);
        setTimeout(() => {
          if (ri + 1 >= rounds.length) {
            if (cfg.diploma) setFinished(true);
            else onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
          } else setRi((x) => x + 1);
        }, 1100);
      } else if (round.listen) {
        // ascolto guidato: passa al prossimo indizio e fallo partire
        const nextLi = round.pairs.findIndex((_, i) => !nL.includes(i));
        setSel(nextLi);
        if (nextLi >= 0) setTimeout(() => audio.whenIdle().then(() => speak(round.pairs[nextLi].say)), 800);
      } else {
        setSel(null);
      }
    } else {
      mistakes.current += 1; onMiss([]); setWrongR(rIdx);
      setTimeout(() => setWrongR(null), 550);
    }
  };

  if (finished) {
    const stars = mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1;
    const totalPairs = rounds.reduce((s, r) => s + r.pairs.length, 0);
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <SparkleBurst trigger={1} />
        <div className="text-6xl gem-pop">🎓</div>
        <h3 className="display text-2xl" style={{ color: "#F5C64F" }}>Diploma di {cfg.diploma}</h3>
        <div className="rounded-2xl px-6 py-5" style={{ background: "#ffffff10", border: "2px solid #F5C64F55" }}>
          <p className="display text-xl" style={{ color: "#F6F1FF" }}>{name}</p>
          <p className="text-sm" style={{ color: "#CDBBF2" }}>ha superato l'esame dell'Accademia!</p>
          <div className="text-2xl mt-2">{[1, 2, 3].map((i) => <span key={i} style={{ opacity: i <= stars ? 1 : 0.25 }}>⭐</span>)}</div>
          <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{Math.max(0, totalPairs - mistakes.current)}/{totalPairs} al primo colpo</p>
        </div>
        <button onClick={() => onDone(stars)} className="listen-btn" style={{ fontSize: "1.15rem", padding: "14px 32px" }}>🎉 Evviva!</button>
      </div>
    );
  }

  if (!round) return null;
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SparkleBurst trigger={burst} />
      {rounds.length > 1 && <ProgressPips total={rounds.length} done={ri} />}
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt}</p>
      <p className="text-sm text-center" style={{ color: "#9F8CC9" }}>{round.it}</p>
      <div className="flex gap-4 w-full justify-center" style={{ maxWidth: 480 }}>
        {/* ── colonna INDIZI (sinistra) ── */}
        <div className="flex flex-col gap-3 flex-1">
          {round.pairs.map((p, li) => {
            const isDone = doneL.includes(li);
            const isSel = sel === li;
            return (
              <button key={li} onClick={() => selectLeft(li)} disabled={isDone}
                style={{
                  padding: "12px 12px", borderRadius: 14, fontWeight: 700, fontSize: listen ? 16 : 15,
                  textAlign: "left", transition: "all .15s",
                  color: isDone ? "#1E5C34" : "#4A2F8E",
                  background: isDone ? "#D8F5DF" : "#F6F1FF",
                  border: isSel ? "3px solid #F5C64F" : "3px solid transparent",
                  boxShadow: isDone ? "0 3px 0 #A9DDB8" : "0 3px 0 #C9B6EE",
                  opacity: isDone ? 0.92 : 1,
                }}>
                {isDone ? "✅ " : ""}{listen ? `🎧 Indizio ${li + 1}` : p.l}
              </button>
            );
          })}
        </div>
        {/* ── colonna FIGURE/RISPOSTE (destra) ── */}
        <div className="flex flex-col gap-3 flex-1">
          {rights.map((rt, rIdx) => {
            const isDone = doneR.includes(rIdx);
            const hasEmoji = !!rt.emoji;
            return (
              <button key={rIdx} onClick={() => pickRight(rIdx)} disabled={isDone || sel === null}
                className={wrongR === rIdx ? "shake" : ""}
                style={{
                  padding: hasEmoji ? "8px 8px" : "12px 10px", borderRadius: 14, transition: "all .15s",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                  background: isDone ? "#D8F5DF" : "#F6F1FF",
                  border: isDone ? "3px solid #7FE0A3" : "3px solid transparent",
                  boxShadow: isDone ? "0 3px 0 #A9DDB8" : "0 3px 0 #C9B6EE",
                  opacity: isDone ? 0.92 : sel === null ? 0.72 : 1,
                }}>
                {hasEmoji && <span style={{ fontSize: 40, lineHeight: 1 }}>{rt.emoji}</span>}
                {rt.r && <span className="font-extrabold" style={{ color: isDone ? "#1E5C34" : "#4A2F8E", fontSize: hasEmoji ? 14 : 16, textAlign: "center" }}>{rt.r}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-center" style={{ color: "#7A68A8" }}>
        {sel === null ? "1) Tocca un indizio a sinistra 👈" : "2) Ora tocca la risposta giusta a destra 👉"}
      </p>
    </div>
  );
}

/* Storia interattiva a bivi (BOSS): ogni scelta porta avanti, tutti vincono */
function StoryGame({ speak, story, name, onGem, onDone }) {
  const [nodeId, setNodeId] = useState(story.start);
  const [burst, setBurst] = useState(0);
  const node = story.nodes[nodeId];
  const fill = (s) => String(s).replace(/\{name\}/g, name || "hero");

  useEffect(() => {
    const n = story.nodes[nodeId];
    const t = setTimeout(() => audio.whenIdle().then(() => speak(fill(n.en))), 450);
    return () => clearTimeout(t);
  }, [nodeId]); // eslint-disable-line

  const choose = (c) => {
    setBurst((b) => b + 1);
    onGem(c.words || []);
    speak(c.say || c.label);
    setTimeout(() => setNodeId(c.next), 1100);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <div className="text-7xl float">{node.emoji}</div>
      <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "#ffffff10", border: "2px solid #ffffff22", maxWidth: 420 }}>
        <p className="display text-lg" style={{ color: "#F6F1FF" }}>{fill(node.en)}</p>
        <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(node.it)}</p>
      </div>
      {node.end ? (
        <button onClick={() => onDone(3)} className="listen-btn" style={{ fontSize: "1.2rem", padding: "16px 36px" }}>🎉 Evviva!</button>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {node.choices.map((c, i) => (
            <button key={i} onClick={() => choose(c)} className="opt-btn flex flex-col items-center gap-1"
              style={{ width: 112, padding: "14px 8px", borderRadius: 24, background: "#ffffff12", border: "2px solid #ffffff28" }}>
              <span style={{ fontSize: 46 }}>{c.emoji}</span>
              <span className="text-sm font-bold" style={{ color: "#E7DBFF" }}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Mini-esame stile Starters (BOSS): quiz a punti che termina con un diploma */
function ExamGame({ speak, cfg, name, onGem, onDone }) {
  const N = 8;
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [burst, setBurst] = useState(0);
  const [finished, setFinished] = useState(false);
  const score = useRef(0);

  const newQ = useCallback(() => {
    const t = cfg.pool[rand(cfg.pool.length)];
    const distractors = shuffle(cfg.pool.filter((x) => cfg.keyOf(x) !== cfg.keyOf(t))).slice(0, 3);
    setOptions(shuffle([t, ...distractors])); setTarget(t); setLocked(false); setWrongIdx(null);
    setTimeout(() => audio.whenIdle().then(() => speak(cfg.prompt(t))), 400);
  }, [speak, cfg]);

  useEffect(() => { newQ(); }, []); // eslint-disable-line

  const nextOrEnd = () => {
    if (round + 1 >= N) setFinished(true);
    else { setRound((r) => r + 1); newQ(); }
  };

  const pick = (it, i) => {
    if (locked) return;
    setLocked(true);
    if (cfg.keyOf(it) === cfg.keyOf(target)) {
      setBurst((b) => b + 1); score.current += 1; onGem([cfg.sayOf(target)]);
      speak(cfg.sayOf(target), PRAISE[rand(PRAISE.length)]);
      setTimeout(nextOrEnd, 1400);
    } else {
      setWrongIdx(i); speak(`That's ${cfg.sayOf(it)}.`);
      setTimeout(nextOrEnd, 1300);
    }
  };

  const diploma = cfg.diploma || "Starters";
  const examEmoji = cfg.examEmoji || "🐉";

  if (finished) {
    const s = score.current;
    const stars = s >= 7 ? 3 : s >= 5 ? 2 : 1;
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <SparkleBurst trigger={1} />
        <div className="text-6xl gem-pop">🎓</div>
        <h3 className="display text-2xl" style={{ color: "#F5C64F" }}>Diploma di {diploma}</h3>
        <div className="rounded-2xl px-6 py-5" style={{ background: "#ffffff10", border: "2px solid #F5C64F55" }}>
          <p className="display text-xl" style={{ color: "#F6F1FF" }}>{name}</p>
          <p className="text-sm" style={{ color: "#CDBBF2" }}>ha superato l'esame di {diploma}!</p>
          <div className="text-2xl mt-2">{[1, 2, 3].map((i) => <span key={i} style={{ opacity: i <= stars ? 1 : 0.25 }}>⭐</span>)}</div>
          <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{s}/{N} risposte giuste</p>
        </div>
        <button onClick={() => onDone(stars)} className="listen-btn" style={{ fontSize: "1.15rem", padding: "14px 32px" }}>🎉 Evviva!</button>
      </div>
    );
  }
  if (!target) return null;
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={N} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>{examEmoji} L'Esame Magico — domanda {round + 1}/{N}</p>
      <button onClick={() => speak(cfg.prompt(target))} className="listen-btn">🔊 Riascolta</button>
      <div className="grid grid-cols-2 gap-6 mt-2">
        {options.map((it, i) => (
          <button key={cfg.keyOf(it)} onClick={() => pick(it, i)} className={`opt-btn ${wrongIdx === i ? "shake" : ""}`} style={cfg.style ? cfg.style(it) : undefined}>
            {cfg.render(it)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Confronti (Isola 14): tocca il più grande / il più piccolo */
function CompareGame({ speak, cfg, onGem, onDone }) {
  const ROUNDS_C = 6;
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState(null);
  const [adj, setAdj] = useState("bigger");
  const [order, setOrder] = useState(["big", "small"]);
  const [locked, setLocked] = useState(false);
  const [wrong, setWrong] = useState(null);
  const [burst, setBurst] = useState(0);
  const mistakes = useRef(0);

  const newRound = useCallback(() => {
    const p = cfg.pool[rand(cfg.pool.length)];
    const a = Math.random() < 0.5 ? "bigger" : "smaller";
    setPair(p); setAdj(a); setOrder(shuffle(["big", "small"])); setLocked(false); setWrong(null);
    setTimeout(() => audio.whenIdle().then(() => speak(`Which one is ${a}?`)), 450);
  }, [speak, cfg]);

  useEffect(() => { newRound(); }, []); // eslint-disable-line

  const pick = (which, idx) => {
    if (locked) return;
    const correct = adj === "bigger" ? "big" : "small";
    if (which === correct) {
      setLocked(true); setBurst((b) => b + 1); onGem([]);
      speak(`Yes! ${PRAISE[rand(PRAISE.length)]}`);
      setTimeout(() => {
        if (round + 1 >= ROUNDS_C) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
        else { setRound((r) => r + 1); newRound(); }
      }, 1400);
    } else {
      mistakes.current += 1; setWrong(idx);
      speak(`Try again! Which one is ${adj}?`);
      setTimeout(() => setWrong(null), 700);
    }
  };

  if (!pair) return null;
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={ROUNDS_C} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>
        Tocca quello {adj === "bigger" ? "più grande" : "più piccolo"} — Which one is {adj}?
      </p>
      <button onClick={() => speak(`Which one is ${adj}?`)} className="listen-btn">🔊 Riascolta</button>
      <div className="flex items-center justify-center gap-8">
        {order.map((which, i) => (
          <button key={i} onClick={() => pick(which, i)} className={`opt-btn ${wrong === i ? "shake" : ""}`}
            style={{ width: 140, height: 140, borderRadius: 28, background: "#ffffff12", border: "3px solid #ffffff28", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: which === "big" ? 92 : 44 }}>{which === "big" ? pair.big : pair.small}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Chat — conversazione GUIDATA a più turni con un compagno. Il compagno dice una
   battuta (voce); il bambino risponde toccando OPPURE dicendo al microfono una delle
   risposte suggerite; il dialogo va avanti. Lineare (ogni risposta prosegue), niente
   stress: si arriva sempre a un finale caloroso. Introduce la conversazione parlata (B1).
   NB: NON è una chat AI libera — sono dialoghi scritti, testati e sicuri. */
function ChatGame({ speak, cfg, name, onGem, onDone }) {
  const script = cfg.script;
  const [turn, setTurn] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [burst, setBurst] = useState(0);
  const stopRef = useRef(null);
  const supported = micSupported();
  const fill = (s) => String(s || "").replace(/\{name\}/g, name || "friend");

  useEffect(() => {
    if (turn >= script.length) {
      const t = setTimeout(() => audio.whenIdle().then(() => speak(fill(cfg.end?.npc || "Great chat! See you soon!"))), 400);
      return () => clearTimeout(t);
    }
    setChosen(null); setHeard("");
    const t = setTimeout(() => audio.whenIdle().then(() => speak(fill(script[turn].npc))), 500);
    return () => clearTimeout(t);
  }, [turn]); // eslint-disable-line

  useEffect(() => () => { if (stopRef.current) stopRef.current(); }, []);

  const pickReply = (r) => {
    if (chosen) return;
    setChosen(r); setBurst((b) => b + 1); onGem([]);
    speak(r.en);
    setTimeout(() => setTurn((t) => t + 1), 1300);
  };

  const listen = () => {
    if (listening || chosen) return;
    setListening(true); setHeard("");
    stopRef.current = listenOnce({ onResult: (alts) => {
      setListening(false);
      if (!alts) return;
      setHeard(alts[0] || "");
      const m = script[turn].replies.find((r) => matchesSpoken(alts, r.en));
      if (m) pickReply(m);
    } });
  };

  // ── schermata finale ──
  if (turn >= script.length) {
    return (
      <div className="flex flex-col items-center gap-5 w-full">
        <SparkleBurst trigger={1} />
        <div className="text-7xl float">{cfg.companion?.emoji || "🙂"}</div>
        <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "#ffffff10", border: "2px solid #ffffff22", maxWidth: 440 }}>
          <p className="display text-lg" style={{ color: "#F6F1FF" }}>{fill(cfg.end?.npc || "Great chat! See you soon!")}</p>
          <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(cfg.end?.npcIt || "")}</p>
        </div>
        <button onClick={() => onDone(3)} className="listen-btn" style={{ fontSize: "1.2rem", padding: "16px 36px" }}>🎉 Evviva!</button>
      </div>
    );
  }

  const cur = script[turn];
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={script.length} done={turn} />
      <div className="flex items-center gap-2">
        <span className="text-4xl">{cfg.companion?.emoji || "🙂"}</span>
        <span className="display" style={{ color: "#CDBBF2" }}>{cfg.companion?.name || "Friend"}</span>
      </div>
      <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "#ffffff12", border: "2px solid #ffffff26", maxWidth: 440 }}>
        <p className="display text-lg" style={{ color: "#F6F1FF" }}>{fill(cur.npc)}</p>
        <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(cur.npcIt)}</p>
      </div>
      <button onClick={() => speak(fill(cur.npc))} className="listen-btn">🔊 Riascolta</button>
      <p className="text-sm font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt || "Rispondi: tocca o di' la tua risposta 🎤"}</p>
      <div className="flex flex-col gap-3 w-full items-center">
        {cur.replies.map((r, i) => (
          <button key={i} onClick={() => pickReply(r)} disabled={!!chosen}
            style={{ width: "100%", maxWidth: 420, padding: "14px 16px", borderRadius: 20, border: "none",
              background: chosen === r ? "linear-gradient(180deg,#3DBE6B,#2E9A54)" : "#F6F1FF",
              boxShadow: chosen === r ? "none" : "0 4px 0 #C9B6EE", transition: "all .15s" }}>
            <span className="font-extrabold" style={{ color: chosen === r ? "#fff" : "#4A2F8E", fontSize: 16 }}>
              {r.emoji ? r.emoji + " " : ""}{r.en}
            </span>
          </button>
        ))}
      </div>
      {supported && !chosen && (
        <button onClick={listen} disabled={listening} className={`mic-btn ${listening ? "mic-pulse" : ""}`}
          style={{ background: listening ? "#E8455A" : "linear-gradient(180deg,#8E5FD9,#5A3AA0)" }}>
          {listening ? "🎙️ Ti ascolto…" : "🎤 Dillo tu"}
        </button>
      )}
      {heard && !chosen && <p className="text-sm text-center" style={{ color: "#F5A9B8" }}>ho sentito: "{heard}" — o tocca una risposta</p>}
    </div>
  );
}

/* Dialogo RAMIFICATO (Arcipelago 10 · Il Grande Palco): una conversazione a
   scelte multiple che si DIRAMA — la risposta scelta decide la battuta successiva
   del compagno. Come StoryGame ma in forma di chat con voce e microfono. Nessun
   fallimento: ogni ramo arriva a un finale caloroso. Scenari di vita reale
   (parco, negozio, scuola, dottore…). Introduce la conversazione libera guidata
   (verso B1). NON è una chat AI: sono grafi di dialogo scritti, testati e sicuri.
   Con cfg.diploma il finale mostra la pagella-diploma. */
function DialogueGame({ speak, cfg, name, onGem, onDone }) {
  const nodes = cfg.nodes;
  const [nodeId, setNodeId] = useState(cfg.start);
  const [chosen, setChosen] = useState(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [burst, setBurst] = useState(0);
  const stopRef = useRef(null);
  const supported = micSupported();
  const fill = (s) => String(s || "").replace(/\{name\}/g, name || "friend");
  const node = nodes[nodeId];

  useEffect(() => {
    if (!node) return;
    setChosen(null); setHeard("");
    const t = setTimeout(() => audio.whenIdle().then(() => speak(fill(node.npc))), 500);
    return () => clearTimeout(t);
  }, [nodeId]); // eslint-disable-line

  useEffect(() => () => { if (stopRef.current) stopRef.current(); }, []);

  const choose = (c) => {
    if (chosen) return;
    setChosen(c); setBurst((b) => b + 1); onGem([]);
    speak(fill(c.en));
    setTimeout(() => setNodeId(c.next), 1250);
  };

  const listen = () => {
    if (listening || chosen || !node.choices) return;
    setListening(true); setHeard("");
    stopRef.current = listenOnce({ onResult: (alts) => {
      setListening(false);
      if (!alts) return;
      setHeard(alts[0] || "");
      const m = node.choices.find((c) => matchesSpoken(alts, fill(c.en)));
      if (m) choose(m);
    } });
  };

  if (!node) return null;

  // ── finale (nodo end) ──
  if (node.end) {
    if (cfg.diploma) {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <SparkleBurst trigger={1} />
          <div className="text-6xl gem-pop">🎓</div>
          <h3 className="display text-2xl" style={{ color: "#F5C64F" }}>Diploma di {cfg.diploma}</h3>
          <div className="rounded-2xl px-6 py-5" style={{ background: "#ffffff10", border: "2px solid #F5C64F55" }}>
            <p className="display text-xl" style={{ color: "#F6F1FF" }}>{name}</p>
            <p className="display text-base mt-1" style={{ color: "#F6F1FF" }}>{fill(node.npc)}</p>
            <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(node.npcIt)}</p>
            <div className="text-2xl mt-2">⭐⭐⭐</div>
          </div>
          <button onClick={() => onDone(3)} className="listen-btn" style={{ fontSize: "1.15rem", padding: "14px 32px" }}>🎉 Evviva!</button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-5 w-full">
        <SparkleBurst trigger={1} />
        <div className="text-7xl float">{cfg.companion?.emoji || "🙂"}</div>
        <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "#ffffff10", border: "2px solid #ffffff22", maxWidth: 440 }}>
          <p className="display text-lg" style={{ color: "#F6F1FF" }}>{fill(node.npc)}</p>
          <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(node.npcIt)}</p>
        </div>
        <button onClick={() => onDone(3)} className="listen-btn" style={{ fontSize: "1.2rem", padding: "16px 36px" }}>🎉 Evviva!</button>
      </div>
    );
  }

  // ── turno di conversazione ──
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <SparkleBurst trigger={burst} />
      <div className="flex items-center gap-2">
        <span className="text-4xl">{cfg.companion?.emoji || "🙂"}</span>
        <span className="display" style={{ color: "#CDBBF2" }}>{cfg.companion?.name || "Friend"}</span>
      </div>
      <div className="rounded-3xl px-5 py-4 text-center" style={{ background: "#ffffff12", border: "2px solid #ffffff26", maxWidth: 440 }}>
        <p className="display text-lg" style={{ color: "#F6F1FF" }}>{fill(node.npc)}</p>
        <p className="text-sm mt-1" style={{ color: "#9F8CC9" }}>{fill(node.npcIt)}</p>
      </div>
      <button onClick={() => speak(fill(node.npc))} className="listen-btn">🔊 Riascolta</button>
      <p className="text-sm font-semibold text-center" style={{ color: "#CDBBF2" }}>{cfg.hintIt || "Rispondi: tocca o di' la tua risposta 🎤"}</p>
      <div className="flex flex-col gap-3 w-full items-center">
        {(node.choices || []).map((c, i) => (
          <button key={i} onClick={() => choose(c)} disabled={!!chosen}
            style={{ width: "100%", maxWidth: 420, padding: "14px 16px", borderRadius: 20, border: "none",
              background: chosen === c ? "linear-gradient(180deg,#3DBE6B,#2E9A54)" : "#F6F1FF",
              boxShadow: chosen === c ? "none" : "0 4px 0 #C9B6EE", transition: "all .15s" }}>
            <span className="font-extrabold" style={{ color: chosen === c ? "#fff" : "#4A2F8E", fontSize: 16 }}>
              {c.emoji ? c.emoji + " " : ""}{fill(c.en)}
            </span>
          </button>
        ))}
      </div>
      {supported && !chosen && (
        <button onClick={listen} disabled={listening} className={`mic-btn ${listening ? "mic-pulse" : ""}`}
          style={{ background: listening ? "#E8455A" : "linear-gradient(180deg,#8E5FD9,#5A3AA0)" }}>
          {listening ? "🎙️ Ti ascolto…" : "🎤 Dillo tu"}
        </button>
      )}
      {heard && !chosen && <p className="text-sm text-center" style={{ color: "#F5A9B8" }}>ho sentito: "{heard}" — o tocca una risposta</p>}
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

/* Isola 10 — storia interattiva a bivi del Drago (tutti i cammini vincono) */
const DRAGON_STORY = {
  start: "hungry",
  nodes: {
    hungry: {
      emoji: "🐉",
      en: "Hello! I am the dragon. I am very hungry! What can I eat?",
      it: "Ciao! Sono il drago. Ho tanta fame! Cosa posso mangiare?",
      choices: [
        { emoji: "🍎", label: "apple", say: "Yum! I like apples!", words: ["apple"], next: "weather" },
        { emoji: "🍕", label: "pizza", say: "Yum! I like pizza!", words: ["pizza"], next: "weather" },
        { emoji: "🍰", label: "cake", say: "Yum! I like cake!", words: ["cake"], next: "weather" },
      ],
    },
    weather: {
      emoji: "🌈",
      en: "Thank you! Now let's fly. How is the weather today?",
      it: "Grazie! Ora voliamo. Che tempo fa oggi?",
      choices: [
        { emoji: "☀️", label: "sunny", say: "It's sunny! Let's fly high!", words: ["sunny"], next: "friend" },
        { emoji: "🌧️", label: "rainy", say: "It's rainy! Take an umbrella!", words: ["rainy"], next: "friend" },
      ],
    },
    friend: {
      emoji: "🐲",
      en: "Who comes with us on the adventure?",
      it: "Chi viene con noi nell'avventura?",
      choices: [
        { emoji: "🦄", label: "unicorn", say: "The unicorn! Hello unicorn!", words: [], next: "treasure" },
        { emoji: "🦁", label: "lion", say: "The lion! Roar!", words: ["lion"], next: "treasure" },
        { emoji: "🐱", label: "cat", say: "The cat! Meow!", words: ["cat"], next: "treasure" },
      ],
    },
    treasure: {
      emoji: "💎",
      en: "We found the treasure! Which gem do you want?",
      it: "Abbiamo trovato il tesoro! Quale gemma vuoi?",
      choices: [
        { emoji: "🔴", label: "red gem", say: "The red gem! Beautiful!", words: ["red"], next: "win" },
        { emoji: "🔵", label: "blue gem", say: "The blue gem! Beautiful!", words: ["blue"], next: "win" },
        { emoji: "🟢", label: "green gem", say: "The green gem! Beautiful!", words: ["green"], next: "win" },
      ],
    },
    win: {
      emoji: "🏆",
      en: "You did it, {name}! You are the hero of the Magic Kingdom!",
      it: "Ce l'hai fatta, {name}! Sei l'eroe del Regno Incantato!",
      end: true,
    },
  },
};

/* ═══════════ ARCIPELAGO 2 · MOVERS (isole 11-20) ═══════════ */
const JOBS = [
  { en: "doctor", emoji: "👩‍⚕️" }, { en: "teacher", emoji: "👩‍🏫" }, { en: "farmer", emoji: "👨‍🌾" },
  { en: "cook", emoji: "👨‍🍳" }, { en: "pilot", emoji: "👨‍✈️" }, { en: "police officer", emoji: "👮" },
  { en: "firefighter", emoji: "🧑‍🚒" }, { en: "singer", emoji: "👩‍🎤" }, { en: "painter", emoji: "👨‍🎨" },
  { en: "astronaut", emoji: "👨‍🚀" },
];
const PLACES = [
  { en: "school", emoji: "🏫" }, { en: "hospital", emoji: "🏥" }, { en: "shop", emoji: "🏬" },
  { en: "park", emoji: "🎠" }, { en: "house", emoji: "🏠" }, { en: "station", emoji: "🚉" },
  { en: "farm", emoji: "🚜" }, { en: "beach", emoji: "🏖️" }, { en: "castle", emoji: "🏰" }, { en: "church", emoji: "⛪" },
];
const MARKET = [
  { en: "apple", emoji: "🍎" }, { en: "banana", emoji: "🍌" }, { en: "orange", emoji: "🍊" },
  { en: "grapes", emoji: "🍇" }, { en: "carrot", emoji: "🥕" }, { en: "tomato", emoji: "🍅" },
  { en: "potato", emoji: "🥔" }, { en: "cheese", emoji: "🧀" }, { en: "bread", emoji: "🍞" }, { en: "lemon", emoji: "🍋" },
];
const DAYS = [
  { en: "Monday" }, { en: "Tuesday" }, { en: "Wednesday" }, { en: "Thursday" },
  { en: "Friday" }, { en: "Saturday" }, { en: "Sunday" },
];
const ROUTINE = [
  { en: "get up", emoji: "🛏️" }, { en: "wash", emoji: "🚿" }, { en: "eat breakfast", emoji: "🥣" },
  { en: "go to school", emoji: "🎒" }, { en: "play", emoji: "⚽" }, { en: "go to bed", emoji: "😴" },
];
const PAST_VERBS = [
  { en: "played", emoji: "⚽" }, { en: "ate", emoji: "🍽️" }, { en: "ran", emoji: "🏃" },
  { en: "jumped", emoji: "🤸" }, { en: "slept", emoji: "😴" }, { en: "sang", emoji: "🎤" },
  { en: "danced", emoji: "💃" }, { en: "swam", emoji: "🏊" }, { en: "drew", emoji: "🎨" }, { en: "flew", emoji: "🪁" },
];
const SEASONS = [
  { en: "spring", emoji: "🌸" }, { en: "summer", emoji: "🌞" }, { en: "autumn", emoji: "🍂" }, { en: "winter", emoji: "⛄" },
];
const HEALTH = [
  { en: "headache", emoji: "🤕" }, { en: "tummy ache", emoji: "🤢" }, { en: "cold", emoji: "🤧" },
  { en: "cough", emoji: "😷" }, { en: "fever", emoji: "🤒" }, { en: "toothache", emoji: "🦷" },
  { en: "sore throat", emoji: "😣" }, { en: "earache", emoji: "👂" },
];
const SPORTS = [
  { en: "football", emoji: "⚽" }, { en: "basketball", emoji: "🏀" }, { en: "tennis", emoji: "🎾" },
  { en: "swimming", emoji: "🏊" }, { en: "running", emoji: "🏃" }, { en: "cycling", emoji: "🚴" },
  { en: "skiing", emoji: "⛷️" }, { en: "baseball", emoji: "⚾" }, { en: "volleyball", emoji: "🏐" }, { en: "dancing", emoji: "💃" },
];
const TRANSPORT = [
  { en: "car", emoji: "🚗" }, { en: "bus", emoji: "🚌" }, { en: "train", emoji: "🚆" },
  { en: "plane", emoji: "✈️" }, { en: "boat", emoji: "⛵" }, { en: "bike", emoji: "🚲" },
  { en: "taxi", emoji: "🚕" }, { en: "helicopter", emoji: "🚁" }, { en: "scooter", emoji: "🛵" }, { en: "truck", emoji: "🚚" },
];
const DIRECTIONS = [
  { en: "left", emoji: "⬅️" }, { en: "right", emoji: "➡️" }, { en: "straight on", emoji: "⬆️" },
  { en: "back", emoji: "⬇️" }, { en: "up", emoji: "🔼" }, { en: "down", emoji: "🔽" },
];

/* Confronti: coppie con un elemento chiaramente più grande e uno più piccolo */
const COMPARE_POOL = [
  { big: "🐘", small: "🐭" }, { big: "🦒", small: "🐈" }, { big: "🐋", small: "🐟" },
  { big: "🌳", small: "🌱" }, { big: "🏰", small: "🏠" }, { big: "🚌", small: "🚗" },
  { big: "🍉", small: "🍒" }, { big: "🐻", small: "🐝" },
];

/* Ripasso Movers per il BOSS (tutte le parole hanno emoji) */
const MOVERS_POOL = [
  ...JOBS.slice(0, 4), ...PLACES.slice(0, 3), ...SPORTS.slice(0, 4),
  ...TRANSPORT.slice(0, 4), ...SEASONS, ...HEALTH.slice(0, 3),
];

/* Isola 20 — la quest al passato della Strega */
const WITCH_STORY = {
  start: "meet",
  nodes: {
    meet: {
      emoji: "🧙",
      en: "I am the Witch of the Past. Yesterday I lost my magic! Where did you go yesterday?",
      it: "Sono la Strega del Passato. Ieri ho perso la mia magia! Dove sei andato ieri?",
      choices: [
        { emoji: "🏫", label: "school", say: "You went to school!", next: "did" },
        { emoji: "🏖️", label: "beach", say: "You went to the beach!", next: "did" },
        { emoji: "🎠", label: "park", say: "You went to the park!", next: "did" },
      ],
    },
    did: {
      emoji: "📜",
      en: "And what did you do there?",
      it: "E cosa hai fatto lì?",
      choices: [
        { emoji: "⚽", label: "played", say: "You played! Great!", words: ["played"], next: "weatherPast" },
        { emoji: "🏊", label: "swam", say: "You swam! Great!", words: ["swam"], next: "weatherPast" },
        { emoji: "🎤", label: "sang", say: "You sang! Great!", words: ["sang"], next: "weatherPast" },
      ],
    },
    weatherPast: {
      emoji: "🌦️",
      en: "What was the weather like?",
      it: "Che tempo faceva?",
      choices: [
        { emoji: "☀️", label: "sunny", say: "It was sunny!", words: ["sunny"], next: "win" },
        { emoji: "🌧️", label: "rainy", say: "It was rainy!", words: ["rainy"], next: "win" },
      ],
    },
    win: {
      emoji: "🏅",
      en: "You found my magic, {name}! You are a true Mover now!",
      it: "Hai ritrovato la mia magia, {name}! Ora sei un vero Mover!",
      end: true,
    },
  },
};

/* ═══════════ ARCIPELAGO 3 · FLYERS (isole 21-30) ═══════════ */
const WORLD = [
  { en: "Italy", emoji: "🇮🇹" }, { en: "France", emoji: "🇫🇷" }, { en: "Spain", emoji: "🇪🇸" },
  { en: "Germany", emoji: "🇩🇪" }, { en: "China", emoji: "🇨🇳" }, { en: "America", emoji: "🇺🇸" },
  { en: "Brazil", emoji: "🇧🇷" }, { en: "Egypt", emoji: "🇪🇬" }, { en: "Japan", emoji: "🇯🇵" }, { en: "Australia", emoji: "🇦🇺" },
];
const LANDSCAPE = [
  { en: "mountain", emoji: "🏔️" }, { en: "river", emoji: "🏞️" }, { en: "desert", emoji: "🏜️" },
  { en: "forest", emoji: "🌲" }, { en: "island", emoji: "🏝️" }, { en: "volcano", emoji: "🌋" },
  { en: "jungle", emoji: "🌴" }, { en: "cave", emoji: "🕳️" }, { en: "waterfall", emoji: "💦" }, { en: "sea", emoji: "🌊" },
];
const FEELINGS = [
  { en: "happy", emoji: "😄" }, { en: "sad", emoji: "😢" }, { en: "angry", emoji: "😠" },
  { en: "scared", emoji: "😱" }, { en: "tired", emoji: "😴" }, { en: "excited", emoji: "🤩" },
  { en: "surprised", emoji: "😲" }, { en: "bored", emoji: "😒" }, { en: "hungry", emoji: "😋" }, { en: "thirsty", emoji: "🥤" },
];
const MATERIALS = [
  { en: "wood", emoji: "🪵" }, { en: "glass", emoji: "🥛" }, { en: "metal", emoji: "🔩" },
  { en: "plastic", emoji: "🧴" }, { en: "gold", emoji: "🪙" }, { en: "paper", emoji: "📄" },
  { en: "stone", emoji: "🪨" }, { en: "wool", emoji: "🧶" }, { en: "ice", emoji: "🧊" }, { en: "cloth", emoji: "🧵" },
];
const TECH = [
  { en: "computer", emoji: "💻" }, { en: "phone", emoji: "📱" }, { en: "camera", emoji: "📷" },
  { en: "robot", emoji: "🤖" }, { en: "keyboard", emoji: "⌨️" }, { en: "television", emoji: "📺" },
  { en: "headphones", emoji: "🎧" }, { en: "game", emoji: "🎮" }, { en: "printer", emoji: "🖨️" }, { en: "mouse", emoji: "🖱️" },
];
const SEA = [
  { en: "dolphin", emoji: "🐬" }, { en: "whale", emoji: "🐋" }, { en: "shark", emoji: "🦈" },
  { en: "octopus", emoji: "🐙" }, { en: "crab", emoji: "🦀" }, { en: "jellyfish", emoji: "🪼" },
  { en: "seal", emoji: "🦭" }, { en: "turtle", emoji: "🐢" }, { en: "fish", emoji: "🐠" }, { en: "shell", emoji: "🐚" },
];
const SPACE = [
  { en: "star", emoji: "⭐" }, { en: "moon", emoji: "🌙" }, { en: "sun", emoji: "☀️" },
  { en: "planet", emoji: "🪐" }, { en: "rocket", emoji: "🚀" }, { en: "astronaut", emoji: "👨‍🚀" },
  { en: "alien", emoji: "👽" }, { en: "Earth", emoji: "🌍" }, { en: "comet", emoji: "☄️" }, { en: "telescope", emoji: "🔭" },
];
const FUTURE_ACTIONS = [
  { en: "travel", emoji: "✈️" }, { en: "fly", emoji: "🪁" }, { en: "swim", emoji: "🏊" },
  { en: "read", emoji: "📖" }, { en: "win", emoji: "🏆" }, { en: "paint", emoji: "🎨" },
  { en: "dance", emoji: "💃" }, { en: "sing", emoji: "🎤" }, { en: "cook", emoji: "🍳" }, { en: "explore", emoji: "🧭" },
];
const SEEN_THINGS = [
  { en: "dragon", emoji: "🐉" }, { en: "castle", emoji: "🏰" }, { en: "rainbow", emoji: "🌈" },
  { en: "dolphin", emoji: "🐬" }, { en: "mountain", emoji: "🏔️" }, { en: "star", emoji: "⭐" },
  { en: "robot", emoji: "🤖" }, { en: "snake", emoji: "🐍" }, { en: "whale", emoji: "🐋" }, { en: "lion", emoji: "🦁" },
];
const ADJECTIVES = [
  { en: "big", emoji: "🐘" }, { en: "small", emoji: "🐭" }, { en: "tall", emoji: "🦒" },
  { en: "fast", emoji: "🐆" }, { en: "slow", emoji: "🐌" }, { en: "strong", emoji: "💪" },
  { en: "hot", emoji: "🔥" }, { en: "cold", emoji: "🧊" }, { en: "happy", emoji: "😄" }, { en: "scary", emoji: "👻" },
];

/* Ripasso Flyers per il BOSS (tutte le parole hanno emoji chiara) */
const FLYERS_POOL = [
  ...LANDSCAPE.slice(0, 3), ...FEELINGS.slice(0, 3), ...SEA.slice(0, 3),
  ...SPACE.slice(0, 3), ...TECH.slice(0, 3), ...MATERIALS.slice(0, 2),
];

/* Isola 30 — il viaggio nei cieli del Gran Mago (tutti i cammini vincono) */
const WIZARD_STORY = {
  start: "greet",
  nodes: {
    greet: {
      emoji: "🧙‍♂️",
      en: "Welcome, brave flyer! I am the Sky Wizard. Where will you fly tomorrow?",
      it: "Benvenuto, coraggioso viaggiatore! Sono il Gran Mago dei Cieli. Dove volerai domani?",
      choices: [
        { emoji: "🌊", label: "the sea", say: "You will fly over the sea!", words: ["sea"], next: "saw" },
        { emoji: "🏔️", label: "the mountain", say: "You will fly over the mountain!", words: ["mountain"], next: "saw" },
        { emoji: "🌋", label: "the volcano", say: "You will fly over the volcano!", words: ["volcano"], next: "saw" },
      ],
    },
    saw: {
      emoji: "👀",
      en: "Amazing! And what have you seen on your journey?",
      it: "Fantastico! E cosa hai visto nel tuo viaggio?",
      choices: [
        { emoji: "🐬", label: "a dolphin", say: "You have seen a dolphin!", words: ["dolphin"], next: "feel" },
        { emoji: "🐉", label: "a dragon", say: "You have seen a dragon!", words: ["dragon"], next: "feel" },
        { emoji: "⭐", label: "a star", say: "You have seen a star!", words: ["star"], next: "feel" },
      ],
    },
    feel: {
      emoji: "💫",
      en: "Wonderful! How do you feel now?",
      it: "Meraviglioso! Come ti senti adesso?",
      choices: [
        { emoji: "😄", label: "happy", say: "You feel happy!", words: ["happy"], next: "win" },
        { emoji: "🤩", label: "excited", say: "You feel excited!", words: ["excited"], next: "win" },
      ],
    },
    win: {
      emoji: "🏆",
      en: "You did it, {name}! You have flown around the whole world. You are a true Flyer!",
      it: "Ce l'hai fatta, {name}! Hai volato intorno al mondo. Ora sei un vero Flyer!",
      end: true,
    },
  },
};

/* ═══════════ ARCIPELAGO 4 · EXPLORERS — il ponte verso il B1 (isole 31-40) ═══════════
   Tappa NOSTRA (non un livello Cambridge ufficiale): consolida A2 (Flyers/Key) e apre al B1
   Preliminary. Grammatica nuova: should, would like, first conditional, be+aggettivo (lei/lui),
   present perfect nel ripasso. Abilità nuova: SCRITTURA (gioco "spelling"). */
const ENVIRONMENT = [
  { en: "bottle", emoji: "🍾" }, { en: "can", emoji: "🥫" }, { en: "paper", emoji: "📄" },
  { en: "box", emoji: "📦" }, { en: "jar", emoji: "🫙" }, { en: "battery", emoji: "🔋" },
  { en: "plastic", emoji: "🧴" }, { en: "bag", emoji: "🛍️" }, { en: "newspaper", emoji: "📰" }, { en: "carton", emoji: "🧃" },
];
const SCHOOL_SUBJECTS = [
  { en: "maths", emoji: "🔢" }, { en: "science", emoji: "🔬" }, { en: "history", emoji: "🏛️" },
  { en: "geography", emoji: "🌍" }, { en: "art", emoji: "🎨" }, { en: "music", emoji: "🎵" },
  { en: "English", emoji: "🔤" }, { en: "sport", emoji: "⚽" }, { en: "drama", emoji: "🎭" }, { en: "computers", emoji: "💻" },
];
const HABITS = [
  { en: "drink water", emoji: "💧" }, { en: "eat fruit", emoji: "🍎" }, { en: "eat vegetables", emoji: "🥦" },
  { en: "do exercise", emoji: "🏃" }, { en: "sleep well", emoji: "😴" }, { en: "wash your hands", emoji: "🧼" },
  { en: "brush your teeth", emoji: "🪥" }, { en: "go outside", emoji: "🌳" }, { en: "eat salad", emoji: "🥗" }, { en: "rest", emoji: "🛌" },
];
const TRAVEL_HOLIDAY = [
  { en: "airport", emoji: "🛫" }, { en: "hotel", emoji: "🏨" }, { en: "ticket", emoji: "🎫" },
  { en: "map", emoji: "🗺️" }, { en: "beach", emoji: "🏖️" }, { en: "camera", emoji: "📷" },
  { en: "gift", emoji: "🎁" }, { en: "passport", emoji: "🛂" }, { en: "suitcase", emoji: "🧳" }, { en: "tent", emoji: "⛺" },
];
// Solo nomi "mass/plural": così "I would like some ${en}" resta sempre grammaticale
const RESTAURANT_FOOD = [
  { en: "rice", emoji: "🍚" }, { en: "noodles", emoji: "🍜" }, { en: "steak", emoji: "🥩" },
  { en: "soup", emoji: "🍲" }, { en: "salad", emoji: "🥗" }, { en: "pasta", emoji: "🍝" },
  { en: "juice", emoji: "🧃" }, { en: "curry", emoji: "🍛" }, { en: "sushi", emoji: "🍣" }, { en: "chips", emoji: "🍟" },
];
const ENTERTAINMENT = [
  { en: "movie", emoji: "🎬" }, { en: "popcorn", emoji: "🍿" }, { en: "guitar", emoji: "🎸" },
  { en: "drum", emoji: "🥁" }, { en: "song", emoji: "🎵" }, { en: "circus", emoji: "🎪" },
  { en: "magic", emoji: "🎩" }, { en: "clown", emoji: "🤡" }, { en: "balloon", emoji: "🎈" }, { en: "cartoon", emoji: "📺" },
];
const DIGITAL = [
  { en: "email", emoji: "📧" }, { en: "photo", emoji: "📸" }, { en: "video", emoji: "📹" },
  { en: "chat", emoji: "💬" }, { en: "wifi", emoji: "📶" }, { en: "app", emoji: "📲" },
  { en: "screen", emoji: "🖥️" }, { en: "link", emoji: "🔗" }, { en: "website", emoji: "🌐" }, { en: "download", emoji: "⬇️" },
];
const PERSONALITY = [
  { en: "friendly", emoji: "😊" }, { en: "funny", emoji: "😄" }, { en: "clever", emoji: "🤓" },
  { en: "kind", emoji: "🤗" }, { en: "shy", emoji: "😳" }, { en: "brave", emoji: "🦸" },
  { en: "quiet", emoji: "🤫" }, { en: "polite", emoji: "🙇" }, { en: "calm", emoji: "😌" }, { en: "tidy", emoji: "🧹" },
];
const AMBITIONS = [
  { en: "vet", emoji: "🐾" }, { en: "scientist", emoji: "🔬" }, { en: "dancer", emoji: "💃" },
  { en: "chef", emoji: "🍳" }, { en: "writer", emoji: "✍️" }, { en: "nurse", emoji: "🩺" },
  { en: "sailor", emoji: "⚓" }, { en: "builder", emoji: "👷" }, { en: "gardener", emoji: "🌱" }, { en: "waiter", emoji: "🍽️" },
];
/* Prime frasi al FIRST CONDITIONAL (say: si ripetono) */
const CONDITIONAL = [
  { en: "If I study, I will learn", emoji: "📚" }, { en: "If I run, I will be fast", emoji: "🏃" },
  { en: "If I try, I will win", emoji: "🏆" }, { en: "If I practise, I will play well", emoji: "🎹" },
  { en: "If I read, I will be clever", emoji: "📖" }, { en: "If I help, I will be kind", emoji: "💗" },
  { en: "If I train, I will be strong", emoji: "💪" }, { en: "If I dream, I will fly", emoji: "🌈" },
];
/* Solo parole concrete con emoji chiara per il BOSS (niente parole astratte) */
const EXPLORERS_POOL = [
  { en: "bottle", emoji: "🍾" }, { en: "paper", emoji: "📄" }, { en: "hotel", emoji: "🏨" },
  { en: "airport", emoji: "🛫" }, { en: "beach", emoji: "🏖️" }, { en: "juice", emoji: "🧃" },
  { en: "salad", emoji: "🥗" }, { en: "movie", emoji: "🎬" }, { en: "guitar", emoji: "🎸" },
  { en: "email", emoji: "📧" }, { en: "photo", emoji: "📸" }, { en: "map", emoji: "🗺️" },
];
const spellable = (pool) => pool.filter((w) => w.en.length <= 7 && !w.en.includes(" "));

/* Isola 38 — la galleria dei ritratti (descrivere le persone, be + aggettivo) */
const DESCRIBE_STORY = {
  start: "gallery",
  nodes: {
    gallery: {
      emoji: "🖼️",
      en: "Welcome to the portrait gallery! Look at this girl. What is she like?",
      it: "Benvenuto nella galleria dei ritratti! Guarda questa bambina. Com'è?",
      choices: [
        { emoji: "😊", label: "friendly", say: "She is friendly!", words: ["friendly"], next: "boy" },
        { emoji: "🤓", label: "clever", say: "She is clever!", words: ["clever"], next: "boy" },
        { emoji: "😄", label: "funny", say: "She is funny!", words: ["funny"], next: "boy" },
      ],
    },
    boy: {
      emoji: "🧑",
      en: "Wonderful! And this boy — what is he like?",
      it: "Meraviglioso! E questo bambino, com'è?",
      choices: [
        { emoji: "🦸", label: "brave", say: "He is brave!", words: ["brave"], next: "you" },
        { emoji: "🤗", label: "kind", say: "He is kind!", words: ["kind"], next: "you" },
        { emoji: "🤫", label: "quiet", say: "He is quiet!", words: ["quiet"], next: "you" },
      ],
    },
    you: {
      emoji: "🪞",
      en: "Great! And you — what are you like?",
      it: "Bravo! E tu, come sei?",
      choices: [
        { emoji: "😊", label: "friendly", say: "You are friendly!", next: "win" },
        { emoji: "🤓", label: "clever", say: "You are clever!", next: "win" },
      ],
    },
    win: {
      emoji: "🌟",
      en: "What a wonderful gallery, {name}! You can describe people now. You are a real Explorer!",
      it: "Che galleria meravigliosa, {name}! Ora sai descrivere le persone. Sei un vero Esploratore!",
      end: true,
    },
  },
};

/* Isola 39 — il bivio dei sogni (first conditional + "I want to be a...") */
const DREAM_STORY = {
  start: "dream",
  nodes: {
    dream: {
      emoji: "🌠",
      en: "Welcome, dreamer! If you work hard, what will you be?",
      it: "Benvenuto, sognatore! Se ti impegni, cosa diventerai?",
      choices: [
        { emoji: "🐾", label: "a vet", say: "You will be a vet!", words: ["vet"], next: "prize" },
        { emoji: "💃", label: "a dancer", say: "You will be a dancer!", words: ["dancer"], next: "prize" },
        { emoji: "✍️", label: "a writer", say: "You will be a writer!", words: ["writer"], next: "prize" },
      ],
    },
    prize: {
      emoji: "🏆",
      en: "Wonderful! And if you try your best, what will you win?",
      it: "Meraviglioso! E se fai del tuo meglio, cosa vincerai?",
      choices: [
        { emoji: "🏆", label: "a cup", say: "You will win a cup!", next: "feel" },
        { emoji: "🥇", label: "a medal", say: "You will win a medal!", next: "feel" },
        { emoji: "🎁", label: "a prize", say: "You will win a prize!", next: "feel" },
      ],
    },
    feel: {
      emoji: "💫",
      en: "Amazing! How do you feel about your dream?",
      it: "Fantastico! Come ti senti riguardo al tuo sogno?",
      choices: [
        { emoji: "😄", label: "happy", say: "You feel happy!", words: ["happy"], next: "win" },
        { emoji: "🤩", label: "excited", say: "You feel excited!", words: ["excited"], next: "win" },
      ],
    },
    win: {
      emoji: "🌈",
      en: "If you follow your dreams, {name}, you will do wonderful things! You are a real Explorer!",
      it: "Se segui i tuoi sogni, {name}, farai cose meravigliose! Sei un vero Esploratore!",
      end: true,
    },
  },
};

/* Isola 40 — il viaggio del Sommo Esploratore (present perfect nel ripasso; tutti vincono) */
const EXPLORER_STORY = {
  start: "arrive",
  nodes: {
    arrive: {
      emoji: "🧭",
      en: "Congratulations, {name}! You have travelled the whole world. Where have you been?",
      it: "Congratulazioni, {name}! Hai viaggiato per tutto il mondo. Dove sei stato?",
      choices: [
        { emoji: "🌊", label: "the sea", say: "You have been to the sea!", words: ["sea"], next: "seen" },
        { emoji: "🏔️", label: "the mountains", say: "You have been to the mountains!", words: ["mountain"], next: "seen" },
        { emoji: "🏙️", label: "the city", say: "You have been to the city!", next: "seen" },
      ],
    },
    seen: {
      emoji: "👀",
      en: "Wonderful! And what have you seen on the way?",
      it: "Meraviglioso! E cosa hai visto lungo la strada?",
      choices: [
        { emoji: "🐬", label: "a dolphin", say: "You have seen a dolphin!", words: ["dolphin"], next: "nextq" },
        { emoji: "🏰", label: "a castle", say: "You have seen a castle!", words: ["castle"], next: "nextq" },
        { emoji: "🌈", label: "a rainbow", say: "You have seen a rainbow!", words: ["rainbow"], next: "nextq" },
      ],
    },
    nextq: {
      emoji: "✨",
      en: "Amazing! What will you explore next?",
      it: "Fantastico! Cosa esplorerai adesso?",
      choices: [
        { emoji: "⭐", label: "the stars", say: "You will explore the stars!", next: "win" },
        { emoji: "🌊", label: "the ocean", say: "You will explore the ocean!", next: "win" },
      ],
    },
    win: {
      emoji: "🏆",
      en: "You did it, {name}! You have explored the whole world. You are a true Explorer!",
      it: "Ce l'hai fatta, {name}! Hai esplorato il mondo intero. Ora sei un vero Esploratore!",
      end: true,
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 5 · LA VOCE (isole 41-50) — la CONVERSAZIONE parlata
   Funzioni comunicative A2→B1: salutare, opinioni, inviti, piani,
   comprare, chiedere aiuto, sentimenti/consigli, scuse/grazie, raccontare.
   Introduce il NUOVO motore "chat" (dialogo guidato a più turni).
   NB "La Voce" è una nostra tappa interna, un ponte verso il vero
   B1 Preliminary for Schools — NON è un livello ufficiale Cambridge.
   ═══════════════════════════════════════════════════════════ */

// ── pool di frasi/parole (say = ripeti · listentap-testo = leggi e tocca) ──
const GREET_SAY = [
  { en: "Nice to meet you", emoji: "🤝" }, { en: "How's it going?", emoji: "🙂" },
  { en: "Where are you from?", emoji: "🌍" }, { en: "How old are you?", emoji: "🎂" },
  { en: "What is your name?", emoji: "🙋" }, { en: "This is my friend", emoji: "👭" },
  { en: "See you soon", emoji: "👋" }, { en: "Have a nice day", emoji: "😀" },
  { en: "Welcome", emoji: "🚪" }, { en: "Glad to meet you", emoji: "😊" },
];
const GREET_PHRASES = [
  { en: "Nice to meet you" }, { en: "How are you?" }, { en: "Where are you from?" },
  { en: "How old are you?" }, { en: "See you later" }, { en: "What is your name?" },
];
const OPINION_SAY = [
  { en: "I think so", emoji: "💭" }, { en: "In my opinion", emoji: "🗣️" },
  { en: "I agree", emoji: "👍" }, { en: "I don't agree", emoji: "👎" },
  { en: "I prefer this", emoji: "☝️" }, { en: "I'd rather not", emoji: "🙅" },
  { en: "That is true", emoji: "✔️" }, { en: "I love it", emoji: "❤️" },
  { en: "I can't stand it", emoji: "😖" }, { en: "You are right", emoji: "💡" },
];
const OPINION_PHRASES = [
  { en: "I think so" }, { en: "I agree" }, { en: "I don't agree" }, { en: "In my opinion" },
  { en: "I prefer tea" }, { en: "I'd rather stay" }, { en: "You are right" }, { en: "I like it" },
];
const INVITE_SAY = [
  { en: "Would you like to come?", emoji: "✉️" }, { en: "Shall we go?", emoji: "🚶" },
  { en: "Let's play", emoji: "🎲" }, { en: "How about pizza?", emoji: "🍕" },
  { en: "Come to my party", emoji: "🎉" }, { en: "I'd love to", emoji: "😍" },
  { en: "Yes, please", emoji: "🙌" }, { en: "I'm afraid I can't", emoji: "😔" },
  { en: "Maybe later", emoji: "⏰" }, { en: "Sounds great", emoji: "👍" },
];
const INVITE_PHRASES = [
  { en: "I'd love to" }, { en: "Yes, please" }, { en: "No, thanks" },
  { en: "I'm afraid I can't" }, { en: "Good idea" }, { en: "Why not" },
];
const PLANS_SAY = [
  { en: "Are you free today?", emoji: "📆" }, { en: "When shall we meet?", emoji: "🕒" },
  { en: "Let's meet at six", emoji: "🕕" }, { en: "See you at the park", emoji: "🌳" },
  { en: "See you tomorrow", emoji: "🌅" }, { en: "What time is it?", emoji: "⏰" },
  { en: "I am busy", emoji: "📚" }, { en: "I am free", emoji: "🆓" },
  { en: "That's settled", emoji: "✅" }, { en: "See you later", emoji: "👋" },
];
const PLANS_PHRASES = [
  { en: "on Friday" }, { en: "at six" }, { en: "this afternoon" },
  { en: "tomorrow" }, { en: "next week" }, { en: "at the park" },
];
const SHOP_NOUNS = [
  { en: "money", emoji: "💵" }, { en: "coin", emoji: "🪙" }, { en: "wallet", emoji: "👛" },
  { en: "price tag", emoji: "🏷️" }, { en: "basket", emoji: "🧺" }, { en: "trolley", emoji: "🛒" },
  { en: "card", emoji: "💳" }, { en: "receipt", emoji: "🧾" }, { en: "sale", emoji: "🔖" },
  { en: "cash", emoji: "💰" },
];
const HELP_SAY = [
  { en: "Excuse me", emoji: "🙋" }, { en: "Can you help me?", emoji: "🤲" },
  { en: "How do I get there?", emoji: "🧭" }, { en: "Where is the station?", emoji: "🚉" },
  { en: "Go straight on", emoji: "⬆️" }, { en: "Turn left", emoji: "⬅️" },
  { en: "Turn right", emoji: "➡️" }, { en: "Is it far?", emoji: "📏" },
  { en: "It's near", emoji: "📍" }, { en: "Thank you for your help", emoji: "🙏" },
];
const HELP_PHRASES = [
  { en: "Excuse me" }, { en: "Can you help me?" }, { en: "Go straight on" },
  { en: "Turn left" }, { en: "Turn right" }, { en: "Is it far?" },
];
const FEELINGS_ADV = [
  { en: "nervous", emoji: "😰" }, { en: "worried", emoji: "😟" }, { en: "relieved", emoji: "😅" },
  { en: "proud", emoji: "😤" }, { en: "confused", emoji: "😕" }, { en: "sleepy", emoji: "😪" },
  { en: "sick", emoji: "🤒" }, { en: "lonely", emoji: "🥲" }, { en: "curious", emoji: "🤨" },
];
const ADVICE_SAY = [
  { en: "You should rest", emoji: "🛌" }, { en: "You should relax", emoji: "😌" },
  { en: "Don't worry", emoji: "🤗" }, { en: "Cheer up", emoji: "🌈" },
  { en: "Take it easy", emoji: "🍃" }, { en: "You can do it", emoji: "💪" },
  { en: "If I were you", emoji: "🤔" }, { en: "Get some sleep", emoji: "😴" },
  { en: "Everything's fine", emoji: "👌" }, { en: "Good luck", emoji: "🍀" },
];
const MANNERS_SAY = [
  { en: "I'm sorry", emoji: "😞" }, { en: "It's my fault", emoji: "🙇" },
  { en: "I apologise", emoji: "🙏" }, { en: "Don't worry about it", emoji: "🤗" },
  { en: "Thank you so much", emoji: "💐" }, { en: "You're welcome", emoji: "😊" },
  { en: "Excuse me", emoji: "🙋" }, { en: "After you", emoji: "🚪" },
  { en: "Please", emoji: "🥺" }, { en: "No problem", emoji: "👌" },
];
const MANNERS_PHRASES = [
  { en: "I'm sorry" }, { en: "Thank you" }, { en: "You're welcome" },
  { en: "Excuse me" }, { en: "Don't worry" }, { en: "No problem" },
];
const RECOUNT_PHRASES = [
  { en: "Guess what" }, { en: "Yesterday" }, { en: "first" }, { en: "then" },
  { en: "after that" }, { en: "finally" }, { en: "in the end" }, { en: "suddenly" },
];
const RECOUNT_SAY = [
  { en: "Guess what!", emoji: "😲" }, { en: "Yesterday I played", emoji: "⚽" },
  { en: "First we ate", emoji: "🍽️" }, { en: "Then we ran", emoji: "🏃" },
  { en: "After that we swam", emoji: "🏊" }, { en: "We saw a dog", emoji: "🐶" },
  { en: "It was fun", emoji: "😄" }, { en: "Suddenly it rained", emoji: "🌧️" },
  { en: "In the end", emoji: "🏁" }, { en: "What a day", emoji: "🌟" },
];
const VOICE_POOL = [
  { en: "money", emoji: "💵" }, { en: "coin", emoji: "🪙" }, { en: "wallet", emoji: "👛" },
  { en: "card", emoji: "💳" }, { en: "basket", emoji: "🧺" }, { en: "receipt", emoji: "🧾" },
  { en: "sale", emoji: "🔖" }, { en: "cash", emoji: "💰" }, { en: "party", emoji: "🎉" },
  { en: "trolley", emoji: "🛒" },
];

// ── dialoghi "chat" (companion parla, il bimbo tocca/dice una risposta) ──
const HINT_CHAT = "Rispondi: tocca o di' la tua risposta 🎤";
const CHAT_MEET = {
  companion: { name: "Mia", emoji: "👧" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hi! I'm Mia. Nice to meet you!", npcIt: "Ciao! Sono Mia. Piacere di conoscerti!",
      replies: [{ en: "Nice to meet you too!", emoji: "🤝" }, { en: "Hi Mia, I'm happy to meet you.", emoji: "😊" }, { en: "Hello! I'm glad to meet you.", emoji: "🙂" }] },
    { npc: "How's it going today?", npcIt: "Come va oggi?",
      replies: [{ en: "I'm great, thanks!", emoji: "😄" }, { en: "Not bad, and you?", emoji: "🙂" }, { en: "Pretty good, thank you.", emoji: "👍" }] },
    { npc: "Cool! Where are you from?", npcIt: "Bello! Di dove sei?",
      replies: [{ en: "I'm from Italy.", emoji: "🌍" }, { en: "I come from Rome.", emoji: "🏛️" }, { en: "I'm Italian, from Italy.", emoji: "🗺️" }] },
    { npc: "Nice! How old are you?", npcIt: "Che bello! Quanti anni hai?",
      replies: [{ en: "I'm nine years old.", emoji: "🎂" }, { en: "I'm ten.", emoji: "🎈" }, { en: "I'm eight, and you?", emoji: "🙂" }] },
    { npc: "Let me introduce you to my friend Leo!", npcIt: "Ti presento il mio amico Leo!",
      replies: [{ en: "Nice to meet you, Leo!", emoji: "🤝" }, { en: "Hi Leo, nice to meet you!", emoji: "👋" }, { en: "Hello Leo!", emoji: "😊" }] },
  ],
  end: { npc: "Great! Now we are all friends. See you soon, {name}!", npcIt: "Bene! Ora siamo tutti amici. A presto, {name}!" },
};
const CHAT_OPINIONS = {
  companion: { name: "Leo", emoji: "👦" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hi {name}! What do you think about films?", npcIt: "Ciao {name}! Cosa pensi dei film?",
      replies: [{ en: "I think they're great!", emoji: "😍" }, { en: "In my opinion, films are fun.", emoji: "💭" }, { en: "I love films!", emoji: "🎬" }] },
    { npc: "Me too! Do you prefer films or books?", npcIt: "Anch'io! Preferisci i film o i libri?",
      replies: [{ en: "I prefer films to books.", emoji: "🎬" }, { en: "I'd rather read books.", emoji: "📚" }, { en: "I like both, actually.", emoji: "🤝" }] },
    { npc: "Interesting! What's your favourite kind of film?", npcIt: "Interessante! Qual è il tuo tipo di film preferito?",
      replies: [{ en: "I'm really into cartoons.", emoji: "🐭" }, { en: "I love adventure films.", emoji: "🗺️" }, { en: "I prefer funny films.", emoji: "😂" }] },
    { npc: "Nice. I think science-fiction is the best. Do you agree?", npcIt: "Bello. Secondo me la fantascienza è la migliore. Sei d'accordo?",
      replies: [{ en: "I totally agree!", emoji: "👍" }, { en: "I see your point, but I'm not sure.", emoji: "🤔" }, { en: "I don't really agree.", emoji: "👎" }] },
    { npc: "Ha! That's a good point. Shall we watch one together?", npcIt: "Ah! Bella osservazione. Ne guardiamo uno insieme?",
      replies: [{ en: "Good idea!", emoji: "💡" }, { en: "Yes, I'd love to!", emoji: "😍" }, { en: "Sure, why not!", emoji: "🙌" }] },
  ],
  end: { npc: "Perfect! It's more fun to watch with a friend. Thanks, {name}!", npcIt: "Perfetto! È più divertente guardare con un amico. Grazie, {name}!" },
};
const CHAT_INVITES = {
  companion: { name: "Mia", emoji: "👧" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hi {name}! Would you like to come to my party on Saturday?", npcIt: "Ciao {name}! Ti va di venire alla mia festa sabato?",
      replies: [{ en: "I'd love to, thanks!", emoji: "😍" }, { en: "Yes, that sounds great!", emoji: "🙌" }, { en: "Sorry, I'm afraid I can't.", emoji: "😔" }] },
    { npc: "Great! How about bringing a game to play?", npcIt: "Bene! Che ne dici di portare un gioco?",
      replies: [{ en: "Good idea!", emoji: "💡" }, { en: "Sure, I'll bring one.", emoji: "🎲" }, { en: "Why not!", emoji: "👍" }] },
    { npc: "Perfect. Why don't we make some pizza too?", npcIt: "Perfetto. Perché non facciamo anche la pizza?",
      replies: [{ en: "Yes, let's do it!", emoji: "🍕" }, { en: "I love pizza!", emoji: "😋" }, { en: "Great plan!", emoji: "🎉" }] },
    { npc: "Cool! Shall we invite Leo as well?", npcIt: "Bello! Invitiamo anche Leo?",
      replies: [{ en: "Yes, let's invite him!", emoji: "🙌" }, { en: "Good idea!", emoji: "💡" }, { en: "Sure, the more the better!", emoji: "😄" }] },
    { npc: "Awesome. How about starting at four o'clock?", npcIt: "Fantastico. Che ne dici di iniziare alle quattro?",
      replies: [{ en: "Four is perfect!", emoji: "🕓" }, { en: "That works for me.", emoji: "👌" }, { en: "Sounds good!", emoji: "👍" }] },
    { npc: "Can you help me decorate?", npcIt: "Mi aiuti a decorare?",
      replies: [{ en: "Of course!", emoji: "🎈" }, { en: "Yes, I'd love to help.", emoji: "🤗" }, { en: "No problem!", emoji: "👌" }] },
  ],
  end: { npc: "Yay! It's going to be the best party. Thank you, {name}!", npcIt: "Evviva! Sarà la festa più bella. Grazie, {name}!" },
};
const CHAT_PLANS = {
  companion: { name: "Leo", emoji: "👦" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hey {name}! Are you free on Friday afternoon?", npcIt: "Ehi {name}! Sei libero venerdì pomeriggio?",
      replies: [{ en: "Yes, I'm free!", emoji: "🆓" }, { en: "Sorry, I'm busy on Friday.", emoji: "😔" }, { en: "Let me check... yes!", emoji: "📆" }] },
    { npc: "Great! Shall we meet at the park?", npcIt: "Bene! Ci vediamo al parco?",
      replies: [{ en: "Yes, the park is perfect.", emoji: "🌳" }, { en: "Good idea!", emoji: "💡" }, { en: "Sure, let's meet there.", emoji: "👍" }] },
    { npc: "Cool. What time shall we meet?", npcIt: "Bello. A che ora ci vediamo?",
      replies: [{ en: "Let's meet at four.", emoji: "🕓" }, { en: "How about three o'clock?", emoji: "🕒" }, { en: "Any time is fine.", emoji: "👌" }] },
    { npc: "Four o'clock works for me. What shall we do?", npcIt: "Le quattro vanno bene. Cosa facciamo?",
      replies: [{ en: "Let's play football!", emoji: "⚽" }, { en: "How about a bike ride?", emoji: "🚲" }, { en: "We could have a picnic.", emoji: "🧺" }] },
    { npc: "Perfect plan! Shall I bring the ball?", npcIt: "Piano perfetto! Porto io il pallone?",
      replies: [{ en: "Yes, please!", emoji: "🙌" }, { en: "Good idea, thanks!", emoji: "😄" }, { en: "Sure, I'll bring drinks.", emoji: "🧃" }] },
  ],
  end: { npc: "So, that's settled! See you on Friday at four, {name}!", npcIt: "Allora è deciso! Ci vediamo venerdì alle quattro, {name}!" },
};
const CHAT_SHOP = {
  companion: { name: "Shopkeeper", emoji: "🧑" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hello! Welcome to my shop. Can I help you?", npcIt: "Salve! Benvenuto nel mio negozio. Posso aiutarti?",
      replies: [{ en: "Yes, please.", emoji: "🙂" }, { en: "I'm just looking, thanks.", emoji: "👀" }, { en: "Hello! Yes, I'd like a jacket.", emoji: "🧥" }] },
    { npc: "Of course! How about this blue jacket?", npcIt: "Certo! Che ne dici di questa giacca blu?",
      replies: [{ en: "How much is it?", emoji: "💰" }, { en: "Can I try it on?", emoji: "🪞" }, { en: "I like it! What's the price?", emoji: "🏷️" }] },
    { npc: "It's twenty euros. Would you like to try it on?", npcIt: "Costa venti euro. Vuoi provarla?",
      replies: [{ en: "Yes, please!", emoji: "🙌" }, { en: "Can I try it on?", emoji: "🪞" }, { en: "Sure, thank you.", emoji: "😊" }] },
    { npc: "It looks great on you! Do you want it?", npcIt: "Ti sta benissimo! La vuoi?",
      replies: [{ en: "Yes, I'll take it!", emoji: "🛍️" }, { en: "Do you have a bigger size?", emoji: "📏" }, { en: "Yes, please, I love it.", emoji: "❤️" }] },
    { npc: "Wonderful. That's twenty euros, please.", npcIt: "Meraviglioso. Sono venti euro, prego.",
      replies: [{ en: "Here you are.", emoji: "💵" }, { en: "Here's the money.", emoji: "🪙" }, { en: "Can I pay with a card?", emoji: "💳" }] },
    { npc: "Thank you! Here's your change and your bag.", npcIt: "Grazie! Ecco il resto e la borsa.",
      replies: [{ en: "Thank you so much!", emoji: "💐" }, { en: "Thanks a lot!", emoji: "🙏" }, { en: "Great, thank you!", emoji: "😄" }] },
  ],
  end: { npc: "You're welcome, {name}! Have a lovely day!", npcIt: "Prego, {name}! Buona giornata!" },
};
const CHAT_HELP = {
  companion: { name: "Passer-by", emoji: "🧑" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hi there! You look a bit lost. Can I help you?", npcIt: "Ciao! Sembri un po' perso. Posso aiutarti?",
      replies: [{ en: "Yes, please!", emoji: "🙋" }, { en: "Excuse me, could you help me?", emoji: "🤲" }, { en: "Thank you, yes.", emoji: "😊" }] },
    { npc: "Of course! Where do you want to go?", npcIt: "Certo! Dove vuoi andare?",
      replies: [{ en: "How do I get to the station?", emoji: "🚉" }, { en: "I'm looking for the park.", emoji: "🌳" }, { en: "Where is the library, please?", emoji: "📚" }] },
    { npc: "No problem. Go straight on, then turn left.", npcIt: "Nessun problema. Vai dritto, poi gira a sinistra.",
      replies: [{ en: "Straight on, then left. Got it!", emoji: "⬅️" }, { en: "Thank you!", emoji: "🙏" }, { en: "Is it far?", emoji: "📏" }] },
    { npc: "It's not far, just five minutes. You can't miss it!", npcIt: "Non è lontano, solo cinque minuti. Non puoi sbagliare!",
      replies: [{ en: "Great, thank you!", emoji: "😄" }, { en: "Perfect!", emoji: "👌" }, { en: "That's close, thanks.", emoji: "📍" }] },
    { npc: "Do you need anything else?", npcIt: "Ti serve altro?",
      replies: [{ en: "No, thank you.", emoji: "🙂" }, { en: "That's all, thanks!", emoji: "👍" }, { en: "No, you've helped a lot.", emoji: "🤗" }] },
  ],
  end: { npc: "You're welcome, {name}! Have a safe trip!", npcIt: "Prego, {name}! Buon viaggio!" },
};
const CHAT_FEELINGS = {
  companion: { name: "Mia", emoji: "👧" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Hi {name}... I'm a bit worried about my test tomorrow.", npcIt: "Ciao {name}... sono un po' preoccupata per la verifica di domani.",
      replies: [{ en: "What's the matter?", emoji: "🤔" }, { en: "Don't worry!", emoji: "🤗" }, { en: "Oh no, why are you worried?", emoji: "😟" }] },
    { npc: "I'm nervous because I haven't studied enough.", npcIt: "Sono nervosa perché non ho studiato abbastanza.",
      replies: [{ en: "You should study tonight.", emoji: "📖" }, { en: "If I were you, I'd read your notes.", emoji: "📝" }, { en: "You'd better start now.", emoji: "⏰" }] },
    { npc: "That's a good idea. But I'm also very tired.", npcIt: "Buona idea. Ma sono anche molto stanca.",
      replies: [{ en: "You should get some rest.", emoji: "🛌" }, { en: "Why don't you take a break?", emoji: "🍃" }, { en: "You'd better sleep early.", emoji: "😴" }] },
    { npc: "You're right. Maybe I should relax a little.", npcIt: "Hai ragione. Forse dovrei rilassarmi un po'.",
      replies: [{ en: "Yes, don't worry!", emoji: "🤗" }, { en: "Everything will be fine.", emoji: "🌈" }, { en: "You can do it!", emoji: "💪" }] },
    { npc: "Thank you. I feel much better now.", npcIt: "Grazie. Ora mi sento molto meglio.",
      replies: [{ en: "I'm glad!", emoji: "😊" }, { en: "That's great!", emoji: "🎉" }, { en: "You'll be great tomorrow.", emoji: "⭐" }] },
  ],
  end: { npc: "You're a really good friend, {name}. Thanks for the advice!", npcIt: "Sei un amico davvero speciale, {name}. Grazie per il consiglio!" },
};
const CHAT_SORRY = {
  companion: { name: "Leo", emoji: "👦" }, hintIt: HINT_CHAT,
  script: [
    { npc: "{name}, I'm really sorry I'm late. I missed the bus!", npcIt: "{name}, scusa tanto per il ritardo. Ho perso l'autobus!",
      replies: [{ en: "Don't worry about it!", emoji: "🤗" }, { en: "It doesn't matter.", emoji: "🙂" }, { en: "It's okay, really.", emoji: "👌" }] },
    { npc: "Thanks. Oh no, I think I broke your pencil. It's my fault.", npcIt: "Grazie. Oh no, credo di aver rotto la tua matita. È colpa mia.",
      replies: [{ en: "It's fine, don't worry.", emoji: "😊" }, { en: "Accidents happen!", emoji: "🤷" }, { en: "No problem at all.", emoji: "👌" }] },
    { npc: "You're so kind. Thank you for being patient.", npcIt: "Sei molto gentile. Grazie per la pazienza.",
      replies: [{ en: "You're welcome!", emoji: "😊" }, { en: "No problem!", emoji: "👍" }, { en: "Anytime!", emoji: "🤗" }] },
    { npc: "Let me buy you a new pencil to say sorry.", npcIt: "Lascia che ti compri una matita nuova per scusarmi.",
      replies: [{ en: "Thank you so much!", emoji: "💐" }, { en: "That's very kind!", emoji: "🥰" }, { en: "You don't have to, but thanks!", emoji: "🙏" }] },
    { npc: "After you — please go first.", npcIt: "Prego, passa prima tu.",
      replies: [{ en: "Thank you!", emoji: "🙂" }, { en: "That's polite of you!", emoji: "🎩" }, { en: "How kind, thanks!", emoji: "😊" }] },
  ],
  end: { npc: "Good manners make good friends, {name}. Thank you!", npcIt: "I buoni modi fanno i buoni amici, {name}. Grazie!" },
};
const CHAT_RECOUNT = {
  companion: { name: "Mia", emoji: "👧" }, hintIt: HINT_CHAT,
  script: [
    { npc: "{name}! Guess what! I had an amazing weekend. What did you do?", npcIt: "{name}! Indovina! Ho passato un weekend fantastico. Tu cosa hai fatto?",
      replies: [{ en: "Yesterday I went to the beach!", emoji: "🏖️" }, { en: "I played football with friends.", emoji: "⚽" }, { en: "I visited my grandma.", emoji: "👵" }] },
    { npc: "Wow, sounds fun! And what happened next?", npcIt: "Wow, che bello! E poi cosa è successo?",
      replies: [{ en: "First we had lunch.", emoji: "🍽️" }, { en: "Then we went swimming.", emoji: "🏊" }, { en: "After that, we played games.", emoji: "🎲" }] },
    { npc: "Cool! Then what did you do?", npcIt: "Forte! Poi cosa hai fatto?",
      replies: [{ en: "Then we ate ice cream.", emoji: "🍦" }, { en: "After that, we walked home.", emoji: "🚶" }, { en: "We took lots of photos.", emoji: "📸" }] },
    { npc: "Amazing! Did anything funny happen?", npcIt: "Fantastico! È successo qualcosa di divertente?",
      replies: [{ en: "Yes! My dog jumped in the water!", emoji: "🐶" }, { en: "We all laughed a lot.", emoji: "😂" }, { en: "I fell over, but it was funny!", emoji: "🤣" }] },
    { npc: "Ha ha! And how did it end?", npcIt: "Ah ah! E come è finita?",
      replies: [{ en: "In the end, we were tired but happy.", emoji: "😌" }, { en: "Finally, we went home.", emoji: "🏡" }, { en: "At last, we said goodbye.", emoji: "👋" }] },
    { npc: "What a great story! I love hearing about your day.", npcIt: "Che bella storia! Adoro sentire com'è andata la tua giornata.",
      replies: [{ en: "Thanks for listening!", emoji: "😊" }, { en: "It was a good day!", emoji: "🌟" }, { en: "Tell me about yours!", emoji: "🗣️" }] },
  ],
  end: { npc: "Let's have an adventure together next time, {name}!", npcIt: "La prossima volta viviamo un'avventura insieme, {name}!" },
};
const CHAT_GRAND = {
  companion: { name: "Voice Keeper", emoji: "🧙" }, hintIt: HINT_CHAT,
  script: [
    { npc: "Welcome to the Great Dialogue, {name}! Nice to meet you. How are you?", npcIt: "Benvenuto al Grande Dialogo, {name}! Piacere. Come stai?",
      replies: [{ en: "Nice to meet you too!", emoji: "🤝" }, { en: "I'm great, thanks!", emoji: "😄" }, { en: "Very well, thank you!", emoji: "🙂" }] },
    { npc: "Wonderful! Tell me — what do you think about learning English?", npcIt: "Meraviglioso! Dimmi — cosa pensi di imparare l'inglese?",
      replies: [{ en: "I think it's fun!", emoji: "🎉" }, { en: "In my opinion, it's great.", emoji: "💭" }, { en: "I love it!", emoji: "❤️" }] },
    { npc: "I agree! Would you like to play a game with me?", npcIt: "Sono d'accordo! Ti va di giocare con me?",
      replies: [{ en: "I'd love to!", emoji: "😍" }, { en: "Yes, let's!", emoji: "🙌" }, { en: "Sure, why not!", emoji: "👍" }] },
    { npc: "Great! Shall we meet again on Saturday to play more?", npcIt: "Bene! Ci rivediamo sabato per giocare ancora?",
      replies: [{ en: "Yes, let's meet Saturday!", emoji: "📅" }, { en: "Good idea!", emoji: "💡" }, { en: "That's settled!", emoji: "✅" }] },
    { npc: "Perfect. Oh, I dropped my book. Could you help me?", npcIt: "Perfetto. Oh, mi è caduto il libro. Mi aiuti?",
      replies: [{ en: "Of course!", emoji: "🤲" }, { en: "Yes, here you are.", emoji: "📕" }, { en: "No problem!", emoji: "👌" }] },
    { npc: "Thank you so much! You are very kind.", npcIt: "Grazie mille! Sei molto gentile.",
      replies: [{ en: "You're welcome!", emoji: "😊" }, { en: "No problem!", emoji: "👍" }, { en: "Anytime!", emoji: "🤗" }] },
    { npc: "By the way — guess what! Yesterday I found a magic word. What did you do yesterday?", npcIt: "A proposito — indovina! Ieri ho trovato una parola magica. Tu cosa hai fatto ieri?",
      replies: [{ en: "Yesterday I played outside.", emoji: "⚽" }, { en: "I read a great book.", emoji: "📚" }, { en: "I helped my family.", emoji: "🏡" }] },
  ],
  end: { npc: "Amazing story! You can really speak English now, {name}. You are a true Voice Champion!", npcIt: "Che storia! Ora sai parlare inglese davvero, {name}. Sei un vero Campione della Voce!" },
};

// ── storia BOSS Arcipelago 5 ──
const VOICE_STORY = {
  start: "greet",
  nodes: {
    greet: {
      emoji: "🎙️",
      en: "Hello, {name}! Let's start our conversation quest. How shall we say hello?",
      it: "Ciao, {name}! Iniziamo la nostra avventura di conversazione. Come salutiamo?",
      choices: [
        { emoji: "👋", label: "wave hello", say: "Hello! Nice to meet you!", next: "invite" },
        { emoji: "🤝", label: "shake hands", say: "Nice to meet you!", next: "invite" },
      ],
    },
    invite: {
      emoji: "🎉",
      en: "Now, would you like to come to the word party?",
      it: "Ora, ti va di venire alla festa delle parole?",
      choices: [
        { emoji: "😍", label: "I'd love to", say: "I'd love to, thank you!", next: "help" },
        { emoji: "🙌", label: "yes please", say: "Yes, please!", next: "help" },
      ],
    },
    help: {
      emoji: "🧭",
      en: "Someone is lost! How do we help them?",
      it: "Qualcuno si è perso! Come lo aiutiamo?",
      choices: [
        { emoji: "⬅️", label: "turn left", say: "Turn left, then go straight on!", next: "win" },
        { emoji: "➡️", label: "turn right", say: "Turn right, it is not far!", next: "win" },
      ],
    },
    win: {
      emoji: "🏆",
      en: "Wonderful, {name}! You spoke English all the way. You are a Conversation Champion!",
      it: "Meraviglioso, {name}! Hai parlato inglese fino in fondo. Sei un Campione della Conversazione!",
      end: true,
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 6 · IL MONDO REALE (isole 51-60) — arricchimento B1→B1+
   Temi nuovi: scienza, natura/habitat, corpo/salute, culture e feste,
   lavori/futuro, soldi, storia ("used to"), libri/racconti, amicizia.
   Grammatica ricettiva: passivo, "used to", condizionali, comparativi,
   discorso indiretto — sempre come "pezzi" da ascoltare/toccare/raccontare.
   NB "Il Mondo Reale" e il diploma "B1 Master" sono nostre tappe interne,
   un ponte verso Cambridge B1 Preliminary / early B2 First for Schools —
   NON sono livelli o esami ufficiali Cambridge.
   ═══════════════════════════════════════════════════════════ */

const SCIENCE_TOOLS = [
  { en: "magnet", emoji: "🧲" }, { en: "thermometer", emoji: "🌡️" }, { en: "microscope", emoji: "🔬" },
  { en: "magnifier", emoji: "🔍" }, { en: "compass", emoji: "🧭" }, { en: "gear", emoji: "⚙️" },
  { en: "lightbulb", emoji: "💡" }, { en: "test tube", emoji: "🧪" }, { en: "scale", emoji: "⚖️" },
];
const MADE_OF = [
  { en: "fork", emoji: "🍴" }, { en: "spoon", emoji: "🥄" }, { en: "ring", emoji: "💍" },
  { en: "brick", emoji: "🧱" }, { en: "mirror", emoji: "🪞" }, { en: "screw", emoji: "🔩" },
  { en: "rope", emoji: "🪢" }, { en: "diamond", emoji: "💎" },
];
const WILD_ANIMALS = [
  { en: "fox", emoji: "🦊" }, { en: "bear", emoji: "🐻" }, { en: "wolf", emoji: "🐺" },
  { en: "deer", emoji: "🦌" }, { en: "owl", emoji: "🦉" }, { en: "panda", emoji: "🐼" },
  { en: "tiger", emoji: "🐯" }, { en: "penguin", emoji: "🐧" }, { en: "koala", emoji: "🐨" },
  { en: "hedgehog", emoji: "🦔" },
];
const HABITATS = [
  { en: "nest", emoji: "🪹" }, { en: "web", emoji: "🕸️" }, { en: "pond", emoji: "🏞️" },
  { en: "meadow", emoji: "🌾" }, { en: "reef", emoji: "🪸" }, { en: "iceberg", emoji: "🧊" },
  { en: "burrow", emoji: "🕳️" }, { en: "branch", emoji: "🌿" },
];
const BODY_ADV = [
  { en: "heart", emoji: "🫀" }, { en: "brain", emoji: "🧠" }, { en: "bone", emoji: "🦴" },
  { en: "lungs", emoji: "🫁" }, { en: "tooth", emoji: "🦷" }, { en: "muscle", emoji: "💪" },
  { en: "blood", emoji: "🩸" }, { en: "tongue", emoji: "👅" },
];
const HEALTH_ACTIONS = [
  { en: "stretch", emoji: "🤸" }, { en: "jog", emoji: "🏃" }, { en: "relax", emoji: "😌" },
  { en: "drink milk", emoji: "🥛" }, { en: "eat fish", emoji: "🐟" }, { en: "wear a hat", emoji: "🧢" },
  { en: "see a doctor", emoji: "🩺" }, { en: "stay warm", emoji: "🧣" }, { en: "take a bath", emoji: "🛁" },
  { en: "drink tea", emoji: "🍵" },
];
const FESTIVALS = [
  { en: "Christmas", emoji: "🎄" }, { en: "Halloween", emoji: "🎃" }, { en: "Diwali", emoji: "🪔" },
  { en: "Carnival", emoji: "🎭" }, { en: "Easter", emoji: "🐣" }, { en: "birthday", emoji: "🎂" },
  { en: "wedding", emoji: "💒" }, { en: "fireworks", emoji: "🎆" }, { en: "New Year", emoji: "🎊" },
  { en: "parade", emoji: "🎏" },
];
const SYMBOLS = [
  { en: "flag", emoji: "🚩" }, { en: "ribbon", emoji: "🎀" }, { en: "lantern", emoji: "🏮" },
  { en: "mask", emoji: "🎭" }, { en: "crown", emoji: "👑" }, { en: "candle", emoji: "🕯️" },
  { en: "trophy", emoji: "🏆" }, { en: "feast", emoji: "🍗" }, { en: "firework", emoji: "🎇" },
];
const FUTURE_JOBS = [
  { en: "engineer", emoji: "🛠️" }, { en: "inventor", emoji: "💡" }, { en: "explorer", emoji: "🧭" },
  { en: "detective", emoji: "🕵️" }, { en: "photographer", emoji: "📷" }, { en: "judge", emoji: "⚖️" },
  { en: "reporter", emoji: "📰" }, { en: "coder", emoji: "💻" }, { en: "diver", emoji: "🤿" },
  { en: "baker", emoji: "🥖" },
];
const FUTURE_GOALS = [
  { en: "study", emoji: "📚" }, { en: "invent", emoji: "🔧" }, { en: "build", emoji: "🏗️" },
  { en: "discover", emoji: "🔭" }, { en: "explore space", emoji: "🚀" }, { en: "help people", emoji: "🤝" },
  { en: "lead", emoji: "🚩" }, { en: "create", emoji: "🎨" }, { en: "teach", emoji: "📖" },
  { en: "save the world", emoji: "🦸" },
];
const MONEY_NOUNS = [
  { en: "coin", emoji: "🪙" }, { en: "money", emoji: "💵" }, { en: "wallet", emoji: "👛" },
  { en: "piggy bank", emoji: "🐷" }, { en: "bank", emoji: "🏦" }, { en: "card", emoji: "💳" },
  { en: "receipt", emoji: "🧾" }, { en: "price tag", emoji: "🏷️" }, { en: "safe", emoji: "🔒" },
  { en: "diamond", emoji: "💎" },
];
const MONEY_SAY = [
  { en: "save my money", emoji: "🐷" }, { en: "buy a gift", emoji: "🎁" }, { en: "pay with a card", emoji: "💳" },
  { en: "count my coins", emoji: "🪙" }, { en: "check the price", emoji: "🏷️" }, { en: "get the receipt", emoji: "🧾" },
  { en: "open my wallet", emoji: "👛" }, { en: "spend a little", emoji: "💵" },
];
const HISTORY_NOUNS = [
  { en: "king", emoji: "🤴" }, { en: "queen", emoji: "👸" }, { en: "sword", emoji: "⚔️" },
  { en: "shield", emoji: "🛡️" }, { en: "dinosaur", emoji: "🦕" }, { en: "scroll", emoji: "📜" },
  { en: "torch", emoji: "🔥" }, { en: "temple", emoji: "⛩️" }, { en: "helmet", emoji: "⛑️" },
];
const PAST_HABITS = [
  { en: "ride a horse", emoji: "🐴" }, { en: "write letters", emoji: "✉️" }, { en: "light a fire", emoji: "🔥" },
  { en: "hunt", emoji: "🏹" }, { en: "sail", emoji: "⛵" }, { en: "farm the land", emoji: "🌾" },
  { en: "wear a crown", emoji: "👑" }, { en: "carry water", emoji: "🪣" }, { en: "tell stories", emoji: "📖" },
  { en: "live in caves", emoji: "🕳️" },
];
const STORY_POOL = [
  { en: "wizard", emoji: "🧙" }, { en: "witch", emoji: "🧹" }, { en: "fairy", emoji: "🧚" },
  { en: "crystal", emoji: "🔮" }, { en: "ghost", emoji: "👻" }, { en: "mermaid", emoji: "🧜" },
  { en: "potion", emoji: "🧪" }, { en: "wand", emoji: "🪄" }, { en: "unicorn", emoji: "🦄" },
  { en: "troll", emoji: "🧌" },
];
const DEEP_FEELINGS = [
  { en: "jealous", emoji: "😠" }, { en: "grateful", emoji: "🙏" }, { en: "hopeful", emoji: "🤞" },
  { en: "cheerful", emoji: "😁" }, { en: "anxious", emoji: "😨" }, { en: "frustrated", emoji: "😣" },
  { en: "embarrassed", emoji: "😳" }, { en: "amazed", emoji: "🤩" }, { en: "upset", emoji: "😢" },
];
const FRIEND_ACTIONS = [
  { en: "share", emoji: "🤝" }, { en: "listen", emoji: "👂" }, { en: "help", emoji: "💪" },
  { en: "forgive", emoji: "🕊️" }, { en: "smile", emoji: "😊" }, { en: "say sorry", emoji: "🙇" },
  { en: "cheer up", emoji: "🎉" }, { en: "be honest", emoji: "💯" }, { en: "wait", emoji: "⏳" },
  { en: "hug", emoji: "🫂" },
];
const COMFORT_SAY = [
  { en: "talk to a friend", emoji: "🫂" }, { en: "take a deep breath", emoji: "🌬️" }, { en: "ask for help", emoji: "🙋" },
  { en: "be kind", emoji: "💗" }, { en: "stay calm", emoji: "😌" }, { en: "try again", emoji: "🔁" },
  { en: "say sorry", emoji: "🙇" }, { en: "smile", emoji: "😊" },
];
const FINAL_REVIEW = [
  { en: "magnet", emoji: "🧲" }, { en: "microscope", emoji: "🔬" }, { en: "fox", emoji: "🦊" },
  { en: "panda", emoji: "🐼" }, { en: "heart", emoji: "🫀" }, { en: "brain", emoji: "🧠" },
  { en: "lantern", emoji: "🏮" }, { en: "crown", emoji: "👑" }, { en: "coin", emoji: "🪙" },
  { en: "ghost", emoji: "👻" }, { en: "wizard", emoji: "🧙" }, { en: "compass", emoji: "🧭" },
];

// ── storie Arcipelago 6 ──
const FESTIVAL_STORY = {
  start: "start",
  nodes: {
    start: {
      emoji: "🌍",
      en: "Welcome, {name}! Today we travel the world to see festivals. Which one shall we visit first?",
      it: "Benvenuto, {name}! Oggi giriamo il mondo per vedere le feste. Quale visitiamo per prima?",
      choices: [
        { emoji: "🎄", label: "Christmas", say: "At Christmas, presents are given!", words: ["Christmas"], next: "india" },
        { emoji: "🎃", label: "Halloween", say: "At Halloween, costumes are worn!", words: ["Halloween"], next: "india" },
        { emoji: "🎭", label: "Carnival", say: "At Carnival, masks are worn!", words: ["Carnival"], next: "india" },
      ],
    },
    india: {
      emoji: "🪔",
      en: "Wonderful! Now we are in India for Diwali. What do people light?",
      it: "Meraviglioso! Ora siamo in India per il Diwali. Cosa accendono le persone?",
      choices: [
        { emoji: "🪔", label: "lanterns", say: "Lanterns are lit everywhere!", words: ["lantern"], next: "party" },
        { emoji: "🎆", label: "fireworks", say: "Fireworks light the sky!", words: ["fireworks"], next: "party" },
      ],
    },
    party: {
      emoji: "🎉",
      en: "Amazing! Every festival ends with a party. What do we do?",
      it: "Fantastico! Ogni festa finisce con una festa. Cosa facciamo?",
      choices: [
        { emoji: "💃", label: "dance", say: "We dance together!", next: "win" },
        { emoji: "🍗", label: "eat", say: "We eat a big feast!", words: ["feast"], next: "win" },
        { emoji: "🎊", label: "celebrate", say: "We celebrate all night!", next: "win" },
      ],
    },
    win: {
      emoji: "🌟",
      en: "What a trip, {name}! Now you know festivals from around the world!",
      it: "Che viaggio, {name}! Ora conosci le feste di tutto il mondo!",
      end: true,
    },
  },
};
const STORYLAND_STORY = {
  start: "open",
  nodes: {
    open: {
      emoji: "📖",
      en: "Open the magic book, {name}! A story begins. Where were you walking when it started?",
      it: "Apri il libro magico, {name}! Inizia una storia. Dove stavi camminando quando è cominciata?",
      choices: [
        { emoji: "🌳", label: "in a forest", say: "While you were walking in a forest, you heard a noise!", next: "meet" },
        { emoji: "🏔️", label: "up a mountain", say: "While you were climbing a mountain, you heard a noise!", words: ["mountain"], next: "meet" },
        { emoji: "🏰", label: "near a castle", say: "While you were near a castle, you heard a noise!", words: ["castle"], next: "meet" },
      ],
    },
    meet: {
      emoji: "🧙",
      en: "Suddenly you met someone! Who was it?",
      it: "All'improvviso hai incontrato qualcuno! Chi era?",
      choices: [
        { emoji: "🧙", label: "a wizard", say: "It was a wizard! He said he was lost.", words: ["wizard"], next: "find" },
        { emoji: "🧚", label: "a fairy", say: "It was a fairy! She said she needed help.", words: ["fairy"], next: "find" },
        { emoji: "🐉", label: "a dragon", say: "It was a dragon! It said it was hungry.", words: ["dragon"], next: "find" },
      ],
    },
    find: {
      emoji: "🔦",
      en: "You had never seen magic before! What did you find next?",
      it: "Non avevi mai visto la magia prima! Cosa hai trovato dopo?",
      choices: [
        { emoji: "🪄", label: "a magic wand", say: "You found a magic wand!", words: ["wand"], next: "end2" },
        { emoji: "💰", label: "treasure", say: "You found the treasure!", words: ["treasure"], next: "end2" },
        { emoji: "🗝️", label: "a golden key", say: "You found a golden key!", words: ["key"], next: "end2" },
      ],
    },
    end2: {
      emoji: "🌟",
      en: "You closed the book, {name}. What a story! How did it end?",
      it: "Hai chiuso il libro, {name}. Che storia! Come è finita?",
      choices: [
        { emoji: "😄", label: "happily", say: "The story ended happily!", words: ["happy"], next: "win" },
        { emoji: "🏆", label: "you won", say: "You saved the day and won!", next: "win" },
      ],
    },
    win: {
      emoji: "📚",
      en: "The end, {name}! You are a wonderful storyteller!",
      it: "Fine, {name}! Sei un narratore meraviglioso!",
      end: true,
    },
  },
};
const WORDMASTER_STORY = {
  start: "gate",
  nodes: {
    gate: {
      emoji: "🧙",
      en: "Welcome, {name}. I am the Word Master. To pass, answer my questions! First: what is a microscope used for?",
      it: "Benvenuto, {name}. Sono il Maestro delle Parole. Per passare, rispondi! Prima: a cosa serve un microscopio?",
      choices: [
        { emoji: "🔬", label: "for science", say: "Yes! A microscope is used for science!", next: "past" },
        { emoji: "🍰", label: "for cakes", say: "Hmm, try science! A microscope is used for science.", next: "past" },
      ],
    },
    past: {
      emoji: "⏳",
      en: "Good! Long ago, what did people ride?",
      it: "Bene! Tanto tempo fa, cosa cavalcavano le persone?",
      choices: [
        { emoji: "🐴", label: "a horse", say: "Right! People used to ride horses!", words: ["horse"], next: "planet" },
        { emoji: "✈️", label: "a plane", say: "Not then! People used to ride horses.", words: ["plane"], next: "planet" },
      ],
    },
    planet: {
      emoji: "🌍",
      en: "Wonderful! If we recycle and save energy, what will happen to our planet?",
      it: "Meraviglioso! Se ricicliamo e risparmiamo energia, cosa succederà al nostro pianeta?",
      choices: [
        { emoji: "😄", label: "it will be happy", say: "Yes! If we help, the planet will be happy!", words: ["happy"], next: "dream" },
        { emoji: "🌈", label: "it will be clean", say: "Exactly! The planet will be clean and green!", next: "dream" },
      ],
    },
    dream: {
      emoji: "🚀",
      en: "Last question! When you grow up, what will you be?",
      it: "Ultima domanda! Da grande, cosa sarai?",
      choices: [
        { emoji: "🛠️", label: "an engineer", say: "You will be a great engineer!", next: "win" },
        { emoji: "🔭", label: "an explorer", say: "You will be a brave explorer!", next: "win" },
        { emoji: "✍️", label: "a writer", say: "You will be a wonderful writer!", next: "win" },
      ],
    },
    win: {
      emoji: "🏆",
      en: "You did it, {name}! You have mastered a whole world of words. You are a true B1 Master!",
      it: "Ce l'hai fatta, {name}! Hai imparato un mondo intero di parole. Ora sei un vero Maestro (B1)! (È un nostro traguardo, non un livello Cambridge ufficiale.)",
      end: true,
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 7 · LA PALESTRA DELLA GRAMMATICA (isole 62-71)
   Dal RICONOSCERE al COSTRUIRE: motori `order` (tessere-parola) e
   `cloze` (riempi-il-buco). Tutto CHIUSO e corretto sul dispositivo
   (zero AI, zero costi). Contenuti in stile Cambridge A2 Key — è una
   NOSTRA tappa interna "Campione di Grammatica", non un livello o esame
   Cambridge ufficiale. Frasi generate e validate (correttezza, ordine
   delle parole, risposte non ambigue, distrattori plausibili).
   ═══════════════════════════════════════════════════════════ */

// I pool grammaticali (Arc7) vivono in ./grammar.js (importati in cima) —
// modulo puro, condiviso col generatore audio.

// helper cfg compatti per i due nuovi motori
const orderCfg = (pool, hintIt) => ({
  pool, keyOf: (t) => t.key, sayOf: (t) => t.sayText, wordsOf: (t) => [t.key],
  build: (t) => t.en, accepted: (t) => t.accepted || [], it: (t) => t.it, hintIt,
});
const clozeCfg = (pool, hintIt) => ({
  pool, keyOf: (t) => t.key, sayOf: (t) => t.sayText, wordsOf: (t) => [t.key],
  textOf: (t) => t.text, answerOf: (t) => t.answer, bankOf: (t) => t.bank, it: (t) => t.it, hintIt,
});

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
      {
        key: "sayMirror", emoji: "🎤", title: "Parla allo Specchio", type: "say",
        cfg: {
          pool: [...FAMILY, ...BODY],
          keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en],
          render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>,
          hintIt: "Guarda, ascolta e ripeti al microfono!",
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
    id: "garden",
    name: "L'Orto Reale",
    emoji: "🥕",
    sub: "Le verdure",
    games: [
      {
        key: "veggies", emoji: "🧺", title: "Raccogli le Verdure", type: "listentap",
        cfg: {
          pool: VEGETABLES,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          wordsOf: (a) => [a.en],
          prompt: (a) => `Find the ${a.en}!`,
          hintIt: "Ascolta e tocca la verdura giusta",
          render: (a) => <span style={{ fontSize: 64 }}>{a.emoji}</span>,
          style: () => ({
            width: 128, height: 128, borderRadius: 28,
            background: "#ffffff14", border: "3px solid #ffffff30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }),
        },
      },
      {
        key: "memoryGarden", emoji: "🥗", title: "Memory dell'Orto", type: "memory",
        cfg: {
          pool: VEGETABLES,
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
      {
        key: "sayBall", emoji: "🎤", title: "La Danza dei Comandi", type: "say",
        cfg: {
          pool: VERBS,
          keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en],
          say: (a) => `I can ${a.en}!`,
          render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>,
          hintIt: "Di' la frase al microfono: I can…!",
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
    sub: "Storia, sfida e mini-esame",
    games: [
      { key: "story", emoji: "📖", title: "La Storia del Drago", type: "story", story: DRAGON_STORY },
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
      {
        key: "exam", emoji: "🎓", title: "L'Esame di Starters", type: "exam",
        cfg: {
          pool: BOSS_POOL,
          keyOf: (a) => a.en, sayOf: (a) => a.en,
          prompt: (a) => `Find the ${a.en}!`,
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

  /* ── ARCIPELAGO 2 · MOVERS ── */
  {
    id: "village", name: "Il Villaggio dei Mestieri", emoji: "🏘️", sub: "Lavori e luoghi",
    games: [
      {
        key: "jobs", emoji: "👩‍⚕️", title: "Chi Fa Cosa?", type: "listentap",
        cfg: { pool: JOBS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `He's a ${a.en}!`, hintIt: "Chi è? Tocca il mestiere giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "places", emoji: "🏫", title: "I Luoghi del Villaggio", type: "listentap",
        cfg: { pool: PLACES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Let's go to the ${a.en}!`, showWord: true, hintIt: "Leggi la parola e tocca il posto giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "memoryVillage", emoji: "🏘️", title: "Memory del Villaggio", type: "memory",
        cfg: { pool: JOBS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "market", name: "Il Mercato Fatato", emoji: "🛍️", sub: "Compere e quantità",
    games: [
      {
        key: "buy", emoji: "🍎", title: "La Spesa Magica", type: "listentap",
        cfg: { pool: MARKET, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Can I have some ${a.en}, please?`, hintIt: "Fai la spesa: tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      { key: "howmany", emoji: "🔢", title: "Quanti Ne Vuoi?", type: "count" },
      {
        key: "memoryMarket", emoji: "🛒", title: "Memory del Mercato", type: "memory",
        cfg: { pool: MARKET, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "time", name: "La Torre del Tempo", emoji: "⏰", sub: "Giorni e routine",
    games: [
      {
        key: "days", emoji: "📅", title: "I Giorni della Settimana", type: "listentap",
        cfg: { pool: DAYS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Today is ${a.en}!`, hintIt: "Ascolta e tocca il giorno giusto", render: textRender, style: wordTileStyle },
      },
      {
        key: "routine", emoji: "🌅", title: "La Giornata Reale", type: "listentap",
        cfg: { pool: ROUTINE, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Every day I ${a.en}.`, hintIt: "La routine: tocca l'azione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "memoryTime", emoji: "⏰", title: "Memory della Giornata", type: "memory",
        cfg: { pool: ROUTINE, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "lake", name: "Il Lago degli Specchi", emoji: "🪷", sub: "I confronti",
    games: [
      { key: "compare", emoji: "⚖️", title: "Più Grande o Più Piccolo?", type: "compare", cfg: { pool: COMPARE_POOL } },
      {
        key: "memoryLake", emoji: "🪷", title: "Memory degli Animali", type: "memory",
        cfg: { pool: ANIMALS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "stories", name: "Il Sentiero delle Storie", emoji: "📜", sub: "I verbi al passato",
    games: [
      {
        key: "past", emoji: "⏳", title: "Racconta Ieri", type: "listentap",
        cfg: { pool: PAST_VERBS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Yesterday I ${a.en}.`, hintIt: "Ieri...: tocca l'azione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayPast", emoji: "🎤", title: "Ieri Io...", type: "say",
        cfg: { pool: PAST_VERBS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `Yesterday I ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' la frase al passato!" },
      },
      {
        key: "memoryStories", emoji: "📜", title: "Memory delle Storie", type: "memory",
        cfg: { pool: PAST_VERBS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "mountain", name: "La Montagna del Meteo", emoji: "🏔️", sub: "Stagioni e meteo",
    games: [
      {
        key: "seasons", emoji: "🍂", title: "Le Quattro Stagioni", type: "listentap",
        cfg: { pool: SEASONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It's ${a.en}!`, hintIt: "Tocca la stagione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "weatherWas", emoji: "🌦️", title: "Che Tempo Faceva?", type: "listentap",
        cfg: { pool: WEATHER, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It was ${a.en}!`, hintIt: "Che tempo faceva? Tocca il cielo", render: emojiRender, style: tileStyle },
      },
      {
        key: "memoryMountain", emoji: "🏔️", title: "Memory delle Stagioni", type: "memory",
        cfg: { pool: [...SEASONS, ...WEATHER], keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "fairyhospital", name: "L'Ospedale delle Fate", emoji: "🧚", sub: "Salute e malanni",
    games: [
      {
        key: "ailments", emoji: "🤒", title: "Cosa Ti Fa Male?", type: "listentap",
        cfg: { pool: HEALTH, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I have a ${a.en}!`, hintIt: "What's the matter? Tocca il malanno", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayHealth", emoji: "🎤", title: "Dalla Dottoressa Fata", type: "say",
        cfg: { pool: HEALTH, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I have a ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' cosa ti fa male!" },
      },
      {
        key: "memoryHospital", emoji: "🧚", title: "Memory dell'Ospedale", type: "memory",
        cfg: { pool: HEALTH, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "hobbies", name: "La Foresta degli Hobby", emoji: "⚽", sub: "Sport e passatempi",
    games: [
      {
        key: "sports", emoji: "🏀", title: "Il Torneo del Regno", type: "listentap",
        cfg: { pool: SPORTS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I like ${a.en}!`, hintIt: "Tocca lo sport giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "saySports", emoji: "🎤", title: "Intervista Magica", type: "say",
        cfg: { pool: SPORTS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I like ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' cosa ti piace fare!" },
      },
      {
        key: "memoryHobbies", emoji: "⚽", title: "Memory degli Hobby", type: "memory",
        cfg: { pool: SPORTS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "port", name: "Il Porto delle Avventure", emoji: "⛵", sub: "Viaggi e direzioni",
    games: [
      {
        key: "transport", emoji: "🚗", title: "Come Viaggiamo?", type: "listentap",
        cfg: { pool: TRANSPORT, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Let's go by ${a.en}!`, hintIt: "Tocca il mezzo giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "directions", emoji: "🧭", title: "La Mappa del Tesoro", type: "listentap",
        cfg: { pool: DIRECTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Go ${a.en}!`, hintIt: "Segui le indicazioni: tocca la freccia", render: emojiRender, style: tileStyle },
      },
      {
        key: "memoryPort", emoji: "⛵", title: "Memory del Porto", type: "memory",
        cfg: { pool: TRANSPORT, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "witch", name: "BOSS: La Strega del Passato", emoji: "🧙", sub: "Storia ed esame Movers",
    games: [
      { key: "witchStory", emoji: "📖", title: "La Quest della Strega", type: "story", story: WITCH_STORY },
      {
        key: "witchChallenge", emoji: "🔮", title: "La Sfida della Strega", type: "listentap",
        cfg: { pool: MOVERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Ripasso Movers: tocca la parola giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "witchExam", emoji: "🎓", title: "L'Esame di Movers", type: "exam",
        cfg: { pool: MOVERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, prompt: (a) => `Find the ${a.en}!`, render: emojiRender, style: tileStyle, examEmoji: "🧙", diploma: "Movers" },
      },
      {
        key: "memoryWitch", emoji: "🧙", title: "Memory della Strega", type: "memory",
        cfg: { pool: MOVERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },

  /* ── ARCIPELAGO 3 · FLYERS ── */
  {
    id: "world", name: "Il Mappamondo Incantato", emoji: "🌍", sub: "Paesi e paesaggi",
    games: [
      {
        key: "countries", emoji: "🗺️", title: "Il Giro del Mondo", type: "listentap",
        cfg: { pool: WORLD, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Let's fly to ${a.en}!`, showWord: true, hintIt: "Leggi e tocca il Paese giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "landscape", emoji: "🏔️", title: "Terre Lontane", type: "listentap",
        cfg: { pool: LANDSCAPE, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Look at the ${a.en}!`, hintIt: "Tocca il paesaggio giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "memoryWorld", emoji: "🌍", title: "Memory del Mondo", type: "memory",
        cfg: { pool: LANDSCAPE, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "feelings", name: "Il Faro delle Emozioni", emoji: "💫", sub: "Sentimenti ed emozioni",
    games: [
      {
        key: "emotions", emoji: "😊", title: "Come Ti Senti?", type: "listentap",
        cfg: { pool: FEELINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I feel ${a.en}!`, hintIt: "How do you feel? Tocca l'emozione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayFeelings", emoji: "🎤", title: "Dillo col Cuore", type: "say",
        cfg: { pool: FEELINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I feel ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' come ti senti!" },
      },
      {
        key: "memoryFeelings", emoji: "💫", title: "Memory delle Emozioni", type: "memory",
        cfg: { pool: FEELINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "materials", name: "La Grotta dei Materiali", emoji: "🪨", sub: "Di cosa è fatto?",
    games: [
      {
        key: "madeof", emoji: "🔨", title: "Di Cosa è Fatto?", type: "listentap",
        cfg: { pool: MATERIALS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It's made of ${a.en}!`, showWord: true, hintIt: "Leggi e tocca il materiale giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayMaterials", emoji: "🎤", title: "Il Mastro Artigiano", type: "say",
        cfg: { pool: MATERIALS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `It's made of ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' di cosa è fatto!" },
      },
      {
        key: "memoryMaterials", emoji: "🪨", title: "Memory dei Materiali", type: "memory",
        cfg: { pool: MATERIALS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "tech", name: "La Torre della Tecnologia", emoji: "🤖", sub: "Macchine e gadget",
    games: [
      {
        key: "gadgets", emoji: "💻", title: "I Gadget Magici", type: "listentap",
        cfg: { pool: TECH, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca l'oggetto giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayTech", emoji: "🎤", title: "La Piccola Inventrice", type: "say",
        cfg: { pool: TECH, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I can use the ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' cosa sai usare!" },
      },
      {
        key: "memoryTech", emoji: "🤖", title: "Memory della Tecnologia", type: "memory",
        cfg: { pool: TECH, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "sea", name: "Le Profondità del Mare", emoji: "🌊", sub: "Il mare e le sue creature",
    games: [
      {
        key: "seacreatures", emoji: "🐬", title: "Il Mondo Sommerso", type: "listentap",
        cfg: { pool: SEA, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Tuffati e tocca la creatura giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "saySea", emoji: "🎤", title: "L'Esploratrice del Mare", type: "say",
        cfg: { pool: SEA, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I can see a ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' cosa vedi nel mare!" },
      },
      {
        key: "memorySea", emoji: "🌊", title: "Memory del Mare", type: "memory",
        cfg: { pool: SEA, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "space", name: "Il Cielo Stellato", emoji: "🚀", sub: "Lo spazio e i pianeti",
    games: [
      {
        key: "spaceobjects", emoji: "🪐", title: "Viaggio nello Spazio", type: "listentap",
        cfg: { pool: SPACE, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca l'oggetto dello spazio", render: emojiRender, style: tileStyle },
      },
      { key: "countStars", emoji: "⭐", title: "Conta le Stelle", type: "count" },
      {
        key: "memorySpace", emoji: "🚀", title: "Memory dello Spazio", type: "memory",
        cfg: { pool: SPACE, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "tomorrow", name: "Il Sentiero del Domani", emoji: "🔮", sub: "Il futuro · I will…",
    games: [
      {
        key: "future", emoji: "✨", title: "Domani Io...", type: "listentap",
        cfg: { pool: FUTURE_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Tomorrow I will ${a.en}!`, hintIt: "Cosa farai domani? Tocca l'azione", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayFuture", emoji: "🎤", title: "La Promessa Magica", type: "say",
        cfg: { pool: FUTURE_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `Tomorrow I will ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Di' cosa farai domani!" },
      },
      {
        key: "memoryFuture", emoji: "🔮", title: "Memory del Futuro", type: "memory",
        cfg: { pool: FUTURE_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "memories", name: "Il Diario dei Ricordi", emoji: "📔", sub: "Present perfect · I have seen…",
    games: [
      {
        key: "seen", emoji: "👀", title: "Ho Visto...", type: "listentap",
        cfg: { pool: SEEN_THINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I have seen a ${a.en}!`, hintIt: "Cosa hai visto? Tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "saySeen", emoji: "🎤", title: "Il Mio Diario", type: "say",
        cfg: { pool: SEEN_THINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I have seen a ${a.en}.`, render: (a) => <span style={{ fontSize: 76 }}>{a.emoji}</span>, hintIt: "Racconta cosa hai visto!" },
      },
      {
        key: "memoryMemories", emoji: "📔", title: "Memory dei Ricordi", type: "memory",
        cfg: { pool: SEEN_THINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "opposites", name: "Il Giardino degli Opposti", emoji: "🌗", sub: "Aggettivi e confronti",
    games: [
      {
        key: "adjectives", emoji: "🎭", title: "Il Mondo degli Aggettivi", type: "listentap",
        cfg: { pool: ADJECTIVES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It is ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      { key: "compareBig", emoji: "⚖️", title: "Più Grande o Più Piccolo?", type: "compare", cfg: { pool: COMPARE_POOL } },
      {
        key: "memoryOpposites", emoji: "🌗", title: "Memory degli Aggettivi", type: "memory",
        cfg: { pool: ADJECTIVES, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "skywizard", name: "BOSS: Il Gran Mago dei Cieli", emoji: "🧙‍♂️", sub: "Storia ed esame Flyers",
    games: [
      { key: "wizardStory", emoji: "📖", title: "Il Viaggio nei Cieli", type: "story", story: WIZARD_STORY },
      {
        key: "wizardChallenge", emoji: "🌟", title: "La Sfida del Mago", type: "listentap",
        cfg: { pool: FLYERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Ripasso Flyers: tocca la parola giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "flyersExam", emoji: "🎓", title: "L'Esame di Flyers", type: "exam",
        cfg: { pool: FLYERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, prompt: (a) => `Find the ${a.en}!`, render: emojiRender, style: tileStyle, examEmoji: "🧙‍♂️", diploma: "Flyers" },
      },
      {
        key: "memoryWizard", emoji: "🧙‍♂️", title: "Memory del Mago", type: "memory",
        cfg: { pool: FLYERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },

  /* ── ARCIPELAGO 4 · EXPLORERS (verso il B1) ── */
  {
    id: "planet", name: "Il Pianeta da Salvare", emoji: "🌍", sub: "Ambiente e riciclo · scrittura",
    games: [
      {
        key: "recycle", emoji: "♻️", title: "La Squadra del Riciclo", type: "listentap",
        cfg: { pool: ENVIRONMENT, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `We should recycle the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la cosa da riciclare", render: emojiRender, style: tileStyle },
      },
      {
        key: "spellPlanet", emoji: "✏️", title: "Scrivi e Ricicla", type: "spelling",
        cfg: { pool: spellable(ENVIRONMENT), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola!" },
      },
      {
        key: "memoryPlanet", emoji: "🌍", title: "Memory del Pianeta", type: "memory",
        cfg: { pool: ENVIRONMENT, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "school2", name: "L'Accademia dei Saggi", emoji: "📚", sub: "Le materie di scuola · scrittura",
    games: [
      {
        key: "subjects", emoji: "🔬", title: "La Mia Materia Preferita", type: "listentap",
        cfg: { pool: SCHOOL_SUBJECTS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `My favourite subject is ${a.en}.`, showWord: true, hintIt: "Leggi e tocca la materia giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "spellSchool", emoji: "✏️", title: "Scrivi la Materia", type: "spelling",
        cfg: { pool: spellable(SCHOOL_SUBJECTS), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la materia!" },
      },
      {
        key: "memorySchool2", emoji: "📚", title: "Memory dell'Accademia", type: "memory",
        cfg: { pool: SCHOOL_SUBJECTS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "fitness", name: "Il Tempio del Benessere", emoji: "💪", sub: "Abitudini sane · you should…",
    games: [
      {
        key: "habits", emoji: "🥦", title: "Consigli di Salute", type: "listentap",
        cfg: { pool: HABITS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `You should ${a.en}!`, hintIt: "Ascolta il consiglio e tocca l'immagine", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayHabits", emoji: "🎤", title: "Il Buon Consiglio", type: "say",
        cfg: { pool: HABITS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `You should ${a.en}.`, hintIt: "Ripeti il consiglio: You should…", render: emojiRender },
      },
      {
        key: "memoryFitness", emoji: "💪", title: "Memory del Benessere", type: "memory",
        cfg: { pool: HABITS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "travel", name: "Il Porto dei Viaggi", emoji: "✈️", sub: "Viaggi e vacanze · scrittura",
    games: [
      {
        key: "packing", emoji: "🧳", title: "Pronti a Partire", type: "listentap",
        cfg: { pool: TRAVEL_HOLIDAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la cosa da viaggio", render: emojiRender, style: tileStyle },
      },
      {
        key: "spellTravel", emoji: "✏️", title: "Scrivi il Viaggio", type: "spelling",
        cfg: { pool: spellable(TRAVEL_HOLIDAY), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola!" },
      },
      {
        key: "memoryTravel", emoji: "✈️", title: "Memory del Porto", type: "memory",
        cfg: { pool: TRAVEL_HOLIDAY, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "restaurant", name: "La Locanda del Gran Sapore", emoji: "🍽️", sub: "Al ristorante · I would like…",
    games: [
      {
        key: "order", emoji: "🍔", title: "Ordina al Cameriere", type: "listentap",
        cfg: { pool: RESTAURANT_FOOD, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I would like some ${a.en}.`, hintIt: "Cosa vuoi? Tocca il piatto giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayOrder", emoji: "🎤", title: "Per Favore!", type: "say",
        cfg: { pool: RESTAURANT_FOOD, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `I would like some ${a.en}, please.`, hintIt: "Ordina con gentilezza: I would like…", render: emojiRender },
      },
      {
        key: "memoryRestaurant", emoji: "🍽️", title: "Memory della Locanda", type: "memory",
        cfg: { pool: RESTAURANT_FOOD, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "entertainment", name: "Il Teatro delle Meraviglie", emoji: "🎬", sub: "Spettacolo e musica · scrittura",
    games: [
      {
        key: "showtime", emoji: "🎪", title: "Che Spettacolo!", type: "listentap",
        cfg: { pool: ENTERTAINMENT, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "spellShow", emoji: "✏️", title: "Scrivi lo Spettacolo", type: "spelling",
        cfg: { pool: spellable(ENTERTAINMENT), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola!" },
      },
      {
        key: "memoryShow", emoji: "🎬", title: "Memory del Teatro", type: "memory",
        cfg: { pool: ENTERTAINMENT, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "digital", name: "Il Ponte delle Connessioni", emoji: "📱", sub: "Comunicare e internet · scrittura",
    games: [
      {
        key: "online", emoji: "🌐", title: "Sempre Connessi", type: "listentap",
        cfg: { pool: DIGITAL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la cosa digitale", render: emojiRender, style: tileStyle },
      },
      {
        key: "spellDigital", emoji: "✏️", title: "Scrivi il Messaggio", type: "spelling",
        cfg: { pool: spellable(DIGITAL), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola!" },
      },
      {
        key: "memoryDigital", emoji: "📱", title: "Memory delle Connessioni", type: "memory",
        cfg: { pool: DIGITAL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "describe", name: "La Galleria dei Ritratti", emoji: "🖼️", sub: "Descrivere le persone · he/she is…",
    games: [
      { key: "galleryStory", emoji: "📖", title: "Visita alla Galleria", type: "story", story: DESCRIBE_STORY },
      {
        key: "character", emoji: "😊", title: "Com'è Fatto?", type: "listentap",
        cfg: { pool: PERSONALITY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `She is ${a.en}.`, hintIt: "Ascolta e leggi: tocca la parola giusta", render: textRender, style: wordTileStyle },
      },
      {
        key: "sayCharacter", emoji: "🎤", title: "Descrivi un Amico", type: "say",
        cfg: { pool: PERSONALITY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `He is ${a.en}.`, hintIt: "Descrivi: He is…", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
    ],
  },
  {
    id: "dreams", name: "Il Bivio dei Sogni", emoji: "🌈", sub: "Sogni e se… (first conditional)",
    games: [
      { key: "dreamStory", emoji: "📖", title: "Il Sogno che Verrà", type: "story", story: DREAM_STORY },
      {
        key: "ambitions", emoji: "🌠", title: "Da Grande Sarò…", type: "listentap",
        cfg: { pool: AMBITIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I want to be a ${a.en}!`, showWord: true, hintIt: "Leggi e tocca il mestiere dei sogni", render: emojiRender, style: tileStyle },
      },
      {
        key: "sayIf", emoji: "🎤", title: "Se Io… Allora…", type: "say",
        cfg: { pool: CONDITIONAL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `${a.en}.`, hintIt: "Ripeti la frase: If I…, I will…", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "memoryDreams", emoji: "🌈", title: "Memory dei Sogni", type: "memory",
        cfg: { pool: AMBITIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },
  {
    id: "grandexplorer", name: "BOSS: Il Sommo Esploratore", emoji: "🧭", sub: "Ripasso ed esame Explorers (verso il B1)",
    games: [
      { key: "explorerStory", emoji: "📖", title: "Il Grande Viaggio", type: "story", story: EXPLORER_STORY },
      {
        key: "explorerChallenge", emoji: "🌟", title: "La Sfida dell'Esploratore", type: "listentap",
        cfg: { pool: EXPLORERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Ripasso Explorers: tocca la parola giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "explorerExam", emoji: "🎓", title: "L'Esame degli Esploratori", type: "exam",
        cfg: { pool: EXPLORERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, prompt: (a) => `Find the ${a.en}!`, render: emojiRender, style: tileStyle, examEmoji: "🧭", diploma: "Explorers" },
      },
      {
        key: "memoryExplorer", emoji: "🧭", title: "Memory dell'Esploratore", type: "memory",
        cfg: { pool: EXPLORERS_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },

  /* ═══════════ ARCIPELAGO 5 · LA VOCE (isole 41-50) ═══════════ */
  {
    id: "meetGreet", name: "La Piazza degli Incontri", emoji: "👋", sub: "Presentarsi e piccole chiacchiere",
    games: [
      { key: "meetChat", emoji: "💬", title: "Ciao, Piacere!", type: "chat", cfg: CHAT_MEET },
      {
        key: "greetSay", emoji: "🎤", title: "Ripeti il Saluto", type: "say",
        cfg: { pool: GREET_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ripeti il saluto ad alta voce!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "whoSays", emoji: "👂", title: "Chi Dice Cosa?", type: "listentap",
        cfg: { pool: GREET_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Someone says: "${a.en}"`, hintIt: "Ascolta la frase e tocca quella giusta", render: textRender, style: wordTileStyle },
      },
    ],
  },
  {
    id: "opinions", name: "Il Palco delle Opinioni", emoji: "💭", sub: "Dire cosa pensi e cosa preferisci",
    games: [
      { key: "opinionChat", emoji: "💬", title: "Cosa Ne Pensi?", type: "chat", cfg: CHAT_OPINIONS },
      {
        key: "agreeTap", emoji: "👂", title: "Sono d'Accordo?", type: "listentap",
        cfg: { pool: OPINION_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Choose: "${a.en}"`, hintIt: "Ascolta e tocca la frase giusta", render: textRender, style: wordTileStyle },
      },
      {
        key: "opinionSay", emoji: "🎤", title: "Secondo Me…", type: "say",
        cfg: { pool: OPINION_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ripeti la tua opinione!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
    ],
  },
  {
    id: "invites", name: "Il Salone degli Inviti", emoji: "🎉", sub: "Invitare e proporre idee",
    games: [
      { key: "inviteChat", emoji: "💬", title: "Ti Va di Venire?", type: "chat", cfg: CHAT_INVITES },
      {
        key: "inviteSay", emoji: "🎤", title: "Facciamo Insieme!", type: "say",
        cfg: { pool: INVITE_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Fai un invito o una proposta!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "acceptTap", emoji: "👂", title: "Accetti o No?", type: "listentap",
        cfg: { pool: INVITE_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Reply: "${a.en}"`, hintIt: "Ascolta e tocca la risposta giusta", render: textRender, style: wordTileStyle },
      },
    ],
  },
  {
    id: "plansTime", name: "L'Orologio degli Appuntamenti", emoji: "📅", sub: "Fare piani e darsi appuntamento",
    games: [
      { key: "plansChat", emoji: "💬", title: "Quando Ci Vediamo?", type: "chat", cfg: CHAT_PLANS },
      {
        key: "plansSay", emoji: "🎤", title: "Diamoci Appuntamento", type: "say",
        cfg: { pool: PLANS_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ripeti la frase per fare un piano!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "whenTap", emoji: "👂", title: "Che Giorno?", type: "listentap",
        cfg: { pool: PLANS_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `"${a.en}"`, hintIt: "Ascolta e tocca il momento giusto", render: textRender, style: wordTileStyle },
      },
    ],
  },
  {
    id: "shopTalk", name: "Il Bazar delle Trattative", emoji: "🛍️", sub: "Comprare, prezzi e monete",
    games: [
      { key: "shopChat", emoji: "💬", title: "Quanto Costa?", type: "chat", cfg: CHAT_SHOP },
      {
        key: "shopTap", emoji: "🏪", title: "Al Negozio", type: "listentap",
        cfg: { pool: SHOP_NOUNS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Ascolta e tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "shopSpell", emoji: "✏️", title: "Scrivi il Prezzo", type: "spelling",
        cfg: { pool: spellable(SHOP_NOUNS), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola!" },
      },
    ],
  },
  {
    id: "askHelp", name: "Il Crocevia dell'Aiuto", emoji: "🧭", sub: "Chiedere aiuto e indicazioni",
    games: [
      { key: "helpChat", emoji: "💬", title: "Scusi, Dov'è…?", type: "chat", cfg: CHAT_HELP },
      {
        key: "helpSay", emoji: "🎤", title: "Chiedi la Strada", type: "say",
        cfg: { pool: HELP_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Chiedi aiuto o indicazioni!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "helpTap", emoji: "👂", title: "Indicazioni Giuste", type: "listentap",
        cfg: { pool: HELP_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `"${a.en}"`, hintIt: "Ascolta la richiesta e tocca la frase giusta", render: textRender, style: wordTileStyle },
      },
    ],
  },
  {
    id: "feelingsAdvice", name: "La Fonte dei Consigli", emoji: "💗", sub: "Sentimenti, problemi e consigli",
    games: [
      { key: "feelChat", emoji: "💬", title: "Cosa C'è che Non Va?", type: "chat", cfg: CHAT_FEELINGS },
      {
        key: "feelTap", emoji: "🫂", title: "Come Ti Senti?", type: "listentap",
        cfg: { pool: FEELINGS_ADV, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `I feel ${a.en}.`, hintIt: "Ascolta come si sente e tocca la faccia", render: emojiRender, style: tileStyle },
      },
      {
        key: "adviceSay", emoji: "🎤", title: "Un Buon Consiglio", type: "say",
        cfg: { pool: ADVICE_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Dai un consiglio a un amico!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
    ],
  },
  {
    id: "sorryThanks", name: "Il Giardino della Gentilezza", emoji: "🙏", sub: "Scusarsi, ringraziare e i buoni modi",
    games: [
      { key: "sorryChat", emoji: "💬", title: "Scusa e Grazie", type: "chat", cfg: CHAT_SORRY },
      {
        key: "magicSay", emoji: "🎤", title: "Le Parole Magiche", type: "say",
        cfg: { pool: MANNERS_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ripeti la parola gentile!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
      {
        key: "mannersTap", emoji: "👂", title: "Modi Gentili", type: "listentap",
        cfg: { pool: MANNERS_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Say: "${a.en}"`, hintIt: "Ascolta e tocca la frase gentile", render: textRender, style: wordTileStyle },
      },
    ],
  },
  {
    id: "recount", name: "Il Falò dei Racconti", emoji: "🔥", sub: "Raccontare cosa è successo",
    games: [
      { key: "recountChat", emoji: "💬", title: "Indovina Cosa!", type: "chat", cfg: CHAT_RECOUNT },
      {
        key: "recountTap", emoji: "👂", title: "E Poi… E Dopo…", type: "listentap",
        cfg: { pool: RECOUNT_PHRASES, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `"${a.en}"`, hintIt: "Ascolta e tocca la parola del racconto", render: textRender, style: wordTileStyle },
      },
      {
        key: "recountSay", emoji: "🎤", title: "Racconta la Tua Giornata", type: "say",
        cfg: { pool: RECOUNT_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Racconta cosa è successo!", render: (a) => <span style={{ fontSize: 60 }}>{a.emoji}</span> },
      },
    ],
  },
  {
    id: "grandDialogo", name: "BOSS: Il Grande Dialogo", emoji: "🎙️", sub: "Ripasso della conversazione ed esame · diploma Conversazione",
    games: [
      { key: "grandChat", emoji: "💬", title: "Il Grande Dialogo", type: "chat", cfg: CHAT_GRAND },
      { key: "voiceStory", emoji: "📖", title: "La Voce che Vince", type: "story", story: VOICE_STORY },
      {
        key: "voiceExam", emoji: "🎓", title: "L'Esame della Voce", type: "exam",
        cfg: { pool: VOICE_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, prompt: (a) => `Find the ${a.en}!`, render: emojiRender, style: tileStyle, examEmoji: "🎙️", diploma: "Conversation" },
      },
      {
        key: "voiceMemory", emoji: "🧠", title: "Memory della Voce", type: "memory",
        cfg: { pool: VOICE_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
    ],
  },

  /* ═══════════ ARCIPELAGO 6 · IL MONDO REALE (isole 51-60) ═══════════ */
  {
    id: "howThings", name: "La Fucina della Scienza", emoji: "🔬", sub: "La scienza e come funzionano le cose",
    games: [
      {
        key: "scienceUse", emoji: "🔬", title: "A Cosa Serve?", type: "listentap",
        cfg: { pool: SCIENCE_TOOLS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It is used for science. Find the ${a.en}!`, hintIt: "Ascolta e tocca lo strumento giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "madeOf", emoji: "🧱", title: "Di Che Cosa È Fatto?", type: "listentap",
        cfg: { pool: MADE_OF, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It is made of something. Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca l'oggetto giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "scientistSay", emoji: "🎤", title: "Il Piccolo Scienziato", type: "say",
        cfg: { pool: SCIENCE_TOOLS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `A ${a.en} is used in science.`, hintIt: "Di' la frase come un vero scienziato!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "scienceSpell", emoji: "✏️", title: "Scrivi lo Strumento", type: "spelling",
        cfg: { pool: spellable([...SCIENCE_TOOLS, ...MADE_OF]), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi lo strumento!" },
      },
    ],
  },
  {
    id: "wildHabitats", name: "Il Rifugio della Natura", emoji: "🌿", sub: "Animali, habitat e ambiente",
    games: [
      {
        key: "wildTap", emoji: "🦊", title: "Gli Animali Selvaggi", type: "listentap",
        cfg: { pool: WILD_ANIMALS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Look in the wild! Find the ${a.en}!`, hintIt: "Ascolta e tocca l'animale selvaggio", render: emojiRender, style: tileStyle },
      },
      {
        key: "habitatTap", emoji: "🪹", title: "Dove Vivono?", type: "listentap",
        cfg: { pool: HABITATS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Animals live here. Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca la casa dell'animale", render: emojiRender, style: tileStyle },
      },
      {
        key: "natureMemory", emoji: "🧠", title: "Memory della Natura", type: "memory",
        cfg: { pool: WILD_ANIMALS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
      {
        key: "wildSpell", emoji: "✏️", title: "Scrivi l'Animale", type: "spelling",
        cfg: { pool: spellable([...WILD_ANIMALS, ...HABITATS]), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi il nome!" },
      },
    ],
  },
  {
    id: "bodyHealth", name: "Il Tempio del Corpo", emoji: "🫀", sub: "Il corpo umano e stare in forma",
    games: [
      {
        key: "bodyTap", emoji: "🧠", title: "Dentro il Corpo", type: "listentap",
        cfg: { pool: BODY_ADV, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It is part of your body. Find the ${a.en}!`, hintIt: "Ascolta e tocca la parte del corpo", render: emojiRender, style: tileStyle },
      },
      {
        key: "healthTap", emoji: "🩺", title: "Consigli di Salute", type: "listentap",
        cfg: { pool: HEALTH_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `You should ${a.en}!`, showWord: true, hintIt: "You should…: tocca il consiglio giusto", render: emojiRender, style: tileStyle },
      },
      {
        key: "doctorSay", emoji: "🎤", title: "Il Buon Dottore", type: "say",
        cfg: { pool: HEALTH_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `You should ${a.en} to stay healthy.`, hintIt: "Dai un buon consiglio a voce!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "bodySpell", emoji: "✏️", title: "Scrivi la Parte", type: "spelling",
        cfg: { pool: spellable(BODY_ADV), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parte del corpo!" },
      },
    ],
  },
  {
    id: "worldFestivals", name: "Il Giro del Mondo", emoji: "🎉", sub: "Culture e feste del mondo",
    games: [
      {
        key: "festivalTap", emoji: "🎄", title: "Le Feste del Mondo", type: "listentap",
        cfg: { pool: FESTIVALS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `People celebrate. Find the ${a.en}!`, hintIt: "Ascolta e tocca la festa giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "symbolTap", emoji: "🏮", title: "Simboli e Tradizioni", type: "listentap",
        cfg: { pool: SYMBOLS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It's a tradition. Find the ${a.en}!`, showWord: true, hintIt: "Leggi e tocca il simbolo giusto", render: emojiRender, style: tileStyle },
      },
      { key: "festivalStory", emoji: "📖", title: "La Festa Intorno al Mondo", type: "story", story: FESTIVAL_STORY },
      {
        key: "festivalSpell", emoji: "✏️", title: "Scrivi la Festa", type: "spelling",
        cfg: { pool: spellable([...FESTIVALS, ...SYMBOLS]), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la festa!" },
      },
    ],
  },
  {
    id: "futureJobs", name: "La Torre del Futuro", emoji: "🚀", sub: "Lavori e progetti per il domani",
    games: [
      {
        key: "jobsTap", emoji: "🛠️", title: "I Mestieri del Domani", type: "listentap",
        cfg: { pool: FUTURE_JOBS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `When I grow up, I want this job: ${a.en}!`, hintIt: "When I grow up…: tocca il lavoro", render: emojiRender, style: tileStyle },
      },
      {
        key: "goalsTap", emoji: "🌟", title: "Cosa Farò", type: "listentap",
        cfg: { pool: FUTURE_GOALS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `One day I will ${a.en}!`, showWord: true, hintIt: "Leggi e tocca cosa farai", render: emojiRender, style: tileStyle },
      },
      {
        key: "dreamSay", emoji: "🎤", title: "Il Mio Sogno", type: "say",
        cfg: { pool: FUTURE_JOBS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `When I grow up, I want this job: ${a.en}.`, hintIt: "Di' che lavoro vuoi fare da grande!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "jobsSpell", emoji: "✏️", title: "Scrivi il Mestiere", type: "spelling",
        cfg: { pool: spellable([...FUTURE_JOBS, ...FUTURE_GOALS]), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola del futuro!" },
      },
    ],
  },
  {
    id: "moneyMarket", name: "Il Salvadanaio Magico", emoji: "💰", sub: "Soldi, risparmio e spese",
    games: [
      {
        key: "moneyTap", emoji: "🪙", title: "Il Mondo dei Soldi", type: "listentap",
        cfg: { pool: MONEY_NOUNS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `It's about money. Find the ${a.en}!`, hintIt: "Ascolta e tocca la cosa giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "moneyMemory", emoji: "🧠", title: "Memory dei Soldi", type: "memory",
        cfg: { pool: MONEY_NOUNS, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
      {
        key: "moneySay", emoji: "🎤", title: "Al Negozio", type: "say",
        cfg: { pool: MONEY_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `At the shop I will ${a.en}.`, hintIt: "Di' cosa fai con i soldi!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "moneySpell", emoji: "✏️", title: "Scrivi la Parola dei Soldi", type: "spelling",
        cfg: { pool: spellable(MONEY_NOUNS), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola dei soldi!" },
      },
    ],
  },
  {
    id: "longAgo", name: "La Macchina del Tempo", emoji: "⏳", sub: "Tanto tempo fa e 'used to'",
    games: [
      {
        key: "historyTap", emoji: "🏰", title: "Il Mondo di Una Volta", type: "listentap",
        cfg: { pool: HISTORY_NOUNS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Long ago there was a ${a.en}. Find it!`, hintIt: "Ascolta e tocca la cosa del passato", render: emojiRender, style: tileStyle },
      },
      {
        key: "usedToTap", emoji: "🐴", title: "Una Volta Si Faceva Così", type: "listentap",
        cfg: { pool: PAST_HABITS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `People used to ${a.en}!`, showWord: true, hintIt: "Used to…: tocca cosa si faceva una volta", render: emojiRender, style: tileStyle },
      },
      {
        key: "ancientSay", emoji: "🎤", title: "Ai Tempi Antichi", type: "say",
        cfg: { pool: PAST_HABITS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `Long ago, people used to ${a.en}.`, hintIt: "Di' com'era la vita una volta!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "historySpell", emoji: "✏️", title: "Scrivi la Parola Antica", type: "spelling",
        cfg: { pool: spellable(HISTORY_NOUNS), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola antica!" },
      },
    ],
  },
  {
    id: "storyland", name: "Il Regno delle Storie", emoji: "📖", sub: "Libri, racconti e fantasia",
    games: [
      {
        key: "storyTap", emoji: "🧙", title: "Nel Mondo dei Racconti", type: "listentap",
        cfg: { pool: STORY_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `In the story there is a ${a.en}. Find it!`, hintIt: "Ascolta e tocca il personaggio della storia", render: emojiRender, style: tileStyle },
      },
      { key: "bigAdventure", emoji: "📖", title: "La Grande Avventura", type: "story", story: STORYLAND_STORY },
      {
        key: "taleMemory", emoji: "🧠", title: "Memory delle Fiabe", type: "memory",
        cfg: { pool: STORY_POOL, keyOf: (a) => a.en, sayOf: (a) => a.en, renderPic: (a) => <span className="text-4xl">{a.emoji}</span> },
      },
      {
        key: "storySpell", emoji: "✏️", title: "Scrivi la Parola Magica", type: "spelling",
        cfg: { pool: spellable(STORY_POOL), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi la parola magica!" },
      },
    ],
  },
  {
    id: "growingUp", name: "Il Faro dei Sentimenti", emoji: "💗", sub: "Amicizia, emozioni e crescere",
    games: [
      {
        key: "deepFeelTap", emoji: "😌", title: "Emozioni Profonde", type: "listentap",
        cfg: { pool: DEEP_FEELINGS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `How do you feel? Find ${a.en}!`, hintIt: "Ascolta e tocca l'emozione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "friendTap", emoji: "🤝", title: "Cosa Fa un Buon Amico", type: "listentap",
        cfg: { pool: FRIEND_ACTIONS, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `A good friend should ${a.en}!`, showWord: true, hintIt: "Un buon amico…: tocca l'azione giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "heartSay", emoji: "🎤", title: "Parla col Cuore", type: "say",
        cfg: { pool: COMFORT_SAY, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], say: (a) => `If you feel sad, you should ${a.en}.`, hintIt: "Dai un consiglio gentile a voce!", render: (a) => <span style={{ fontSize: 72 }}>{a.emoji}</span> },
      },
      {
        key: "feelSpell", emoji: "✏️", title: "Scrivi l'Emozione", type: "spelling",
        cfg: { pool: spellable([...DEEP_FEELINGS, ...FRIEND_ACTIONS]), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi l'emozione!" },
      },
    ],
  },
  {
    id: "wordMaster", name: "GRAN BOSS: Il Maestro delle Parole", emoji: "🧙", sub: "Grande ripasso e diploma finale 'B1 Master'",
    games: [
      { key: "masterStory", emoji: "📖", title: "L'Ultima Prova del Maestro", type: "story", story: WORDMASTER_STORY },
      {
        key: "finalChallenge", emoji: "🌟", title: "La Sfida Finale", type: "listentap",
        cfg: { pool: FINAL_REVIEW, keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], prompt: (a) => `Find the ${a.en}!`, hintIt: "Il Maestro mette alla prova tutto! Tocca la parola giusta", render: emojiRender, style: tileStyle },
      },
      {
        key: "masterExam", emoji: "🎓", title: "L'Esame del B1 Master", type: "exam",
        cfg: { pool: FINAL_REVIEW, keyOf: (a) => a.en, sayOf: (a) => a.en, prompt: (a) => `Find the ${a.en}!`, render: emojiRender, style: tileStyle, examEmoji: "🧙", diploma: "B1 Master" },
      },
      {
        key: "masterSpell", emoji: "✏️", title: "Scrivi da Maestro", type: "spelling",
        cfg: { pool: spellable(FINAL_REVIEW), keyOf: (a) => a.en, sayOf: (a) => a.en, wordsOf: (a) => [a.en], hintIt: "Ascolta e scrivi come un vero Maestro!" },
      },
    ],
  },

  /* ═══ ARCIPELAGO 7 · LA PALESTRA DELLA GRAMMATICA (isole 62-71) ═══ */
  {
    id: "gramQuestions", name: "La Bottega delle Domande", emoji: "❓", sub: "Costruire le domande (A2)",
    games: [
      { key: "buildQ", emoji: "❓", title: "Costruisci la Domanda", type: "order",
        cfg: orderCfg(GRAM_QUESTIONS, "Ascolta, poi rimetti in ordine le parole per fare la domanda!") },
    ],
  },
  {
    id: "gramNegatives", name: "Il Muro dei No", emoji: "🚫", sub: "Le frasi negative (A2)",
    games: [
      { key: "buildNeg", emoji: "🚫", title: "Costruisci il No", type: "order",
        cfg: orderCfg(GRAM_NEGATIVES, "Ascolta, poi costruisci la frase negativa!") },
    ],
  },
  {
    id: "gramVerbForms", name: "L'Officina dei Verbi", emoji: "⚙️", sub: "La forma giusta del verbo (A2)",
    games: [
      { key: "verbForm", emoji: "⚙️", title: "Scegli la Forma Giusta", type: "cloze",
        cfg: clozeCfg(CLOZE_VERBFORMS, "Leggi la frase e tocca la parola giusta dal banco!") },
    ],
  },
  {
    id: "gramPast", name: "Il Sentiero di Ieri", emoji: "⏪", sub: "Costruire il passato (A2)",
    games: [
      { key: "buildPast", emoji: "⏪", title: "Racconta Ieri", type: "order",
        cfg: orderCfg(GRAM_PAST, "Ascolta, poi metti in ordine la frase al passato!") },
    ],
  },
  {
    id: "gramArticles", name: "Il Ponte delle Paroline", emoji: "🌉", sub: "a/an/the e preposizioni (A2)",
    games: [
      { key: "fillArt", emoji: "🌉", title: "La Parolina Giusta", type: "cloze",
        cfg: clozeCfg(CLOZE_ARTICLES, "Leggi e tocca la parolina giusta (a, an, in, on…)!") },
    ],
  },
  {
    id: "gramToBe", name: "La Fucina dell'Essere", emoji: "🔨", sub: "am / is / are (A2)",
    games: [
      { key: "fillToBe", emoji: "🔨", title: "Sono, Sei, È", type: "cloze",
        cfg: clozeCfg(CLOZE_TOBE, "Leggi e tocca la forma giusta del verbo 'to be'!") },
    ],
  },
  {
    id: "gramQuantifiers", name: "Il Mercato del Quanto", emoji: "⚖️", sub: "some/any · much/many (A2)",
    games: [
      { key: "fillQuant", emoji: "⚖️", title: "Quanto Ne Vuoi?", type: "cloze",
        cfg: clozeCfg(CLOZE_QUANTIFIERS, "Leggi e tocca: some, any, much o many?") },
    ],
  },
  {
    id: "gramCompare", name: "La Torre dei Confronti", emoji: "📏", sub: "Comparativi e superlativi (A2)",
    games: [
      { key: "buildCompare", emoji: "📏", title: "Più Grande, Il Più Grande", type: "order",
        cfg: orderCfg(GRAM_COMPARE, "Ascolta, poi costruisci il confronto!") },
    ],
  },
  {
    id: "gramConditional", name: "Il Bivio del Se", emoji: "🔀", sub: "First conditional — il dojo avanzato (A2→B1)",
    games: [
      { key: "buildIf", emoji: "🔀", title: "Se… allora…", type: "order",
        cfg: orderCfg(GRAM_CONDITIONAL, "Ascolta, poi costruisci la frase col 'se'! (a volte va bene più di un ordine)") },
    ],
  },
  {
    id: "gramMaster", name: "GRAN BOSS: L'Architetto delle Frasi", emoji: "🏗️", sub: "Ripasso di grammatica e diploma 'Campione di Grammatica'",
    games: [
      { key: "bossBuild", emoji: "🧱", title: "La Grande Frase", type: "order",
        cfg: orderCfg(GRAM_BOSS_ORDER, "Costruisci la frase come un vero architetto delle parole!") },
      {
        key: "gramExam", emoji: "🎓", title: "L'Esame di Grammatica", type: "exam",
        cfg: {
          pool: GRAM_EXAM, keyOf: (t) => t.key, sayOf: (t) => t.a, prompt: (t) => t.q,
          render: (t) => <span className="display" style={{ fontSize: 24, fontWeight: 800, color: "#4A2F8E" }}>{t.a}</span>,
          style: wordTileStyle, examEmoji: "🏗️", diploma: "Campione di Grammatica",
        },
      },
    ],
  },

  /* ═══ ARCIPELAGO 8 · LETTURA E ASCOLTO (isole 72-81) — dati in comprehension.js ═══ */
  ...ARC8_ISLANDS,

  /* ═══ ARCIPELAGO 9 · L'ACCADEMIA DEGLI ESAMI (isole 82-91) — dati in exams.js ═══ */
  ...ARC9_ISLANDS,

  /* ═══ ARCIPELAGO 10 · IL GRANDE PALCO (isole 92-101) — dati in dialogues.js ═══ */
  ...ARC10_ISLANDS,
];

/* ═══════════════════════════════════════════════════════════
   IL FARO DELLA MEMORIA (Fase 3) — Sfida Giornaliera + ripasso dilazionato
   Strato TRASVERSALE (nessuna isola nuova): ripesca le parole già viste e
   quelle deboli con priorità a scadenza (Leitner), una sfida veloce al giorno
   con gemma bonus. Riusa `weak` e la Fiamma esistenti; aggiunge solo `review`
   (scatole) e `daily` (bonus 1/giorno). Tutto chiuso e sul dispositivo.
   ═══════════════════════════════════════════════════════════ */

// Catalogo piatto di TUTTO il vocabolario "illustrabile" (parola + emoji),
// ricavato una volta dalle isole con giochi ascolta&tocca / memory.
const VOCAB_CATALOG = (() => {
  const seen = new Set();
  const out = [];
  for (const isl of ISLANDS) {
    for (const g of isl.games || []) {
      if (g.type !== "listentap" && g.type !== "memory") continue;
      for (const it of (g.cfg && g.cfg.pool) || []) {
        if (it && typeof it.en === "string" && typeof it.emoji === "string" && it.emoji) {
          const k = it.en.toLowerCase().trim();
          if (!seen.has(k)) { seen.add(k); out.push({ en: it.en, emoji: it.emoji, islandId: isl.id }); }
        }
      }
    }
  }
  return out;
})();

// Ripasso dilazionato: intervalli (in giorni) per scatola di Leitner 0..5.
const REVIEW_INTERVALS = [0, 1, 2, 4, 8, 16];
const dayIndex = () => Math.floor(new Date(todayStr() + "T00:00:00").getTime() / 86400000);

// PRNG deterministico da stringa (mulberry32) → la Sfida "di oggi" è stabile nel giorno.
function seededRng(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Sceglie le N parole della Sfida: deboli prima, poi quelle "in scadenza" nel
// ripasso, poi vocabolario già visto. Pesca solo dalle isole già giocate.
function pickDailyItems(seenIslandIds, weak, review, dateStr, n = 6) {
  const seenSet = new Set(seenIslandIds);
  let pool = VOCAB_CATALOG.filter((x) => seenSet.has(x.islandId));
  if (pool.length < n && ISLANDS[0]) pool = VOCAB_CATALOG.filter((x) => x.islandId === ISLANDS[0].id);
  if (pool.length < n) pool = VOCAB_CATALOG.slice();
  const rng = seededRng(dateStr + ":" + pool.length);
  const today = dayIndex();
  const score = (x) => {
    let s = rng() * 5; // varietà stabile nel giorno
    const w = weak[x.en] || 0;
    if (w > 0) s += 100 + w; // deboli: massima priorità
    const r = review[x.en];
    if (r) { const due = today - r.seen - (REVIEW_INTERVALS[r.box] || 0); if (due >= 0) s += 40 + Math.min(due, 20); }
    else s += 12; // mai ripassata: priorità media
    return s;
  };
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, n);
}

/* Sfida Giornaliera: quiz ascolta&tocca veloce sulle parole selezionate. */
function DailyChallengeGame({ speak, items, onGem, onMiss, onDone }) {
  const N = items.length;
  const [round, setRound] = useState(0);
  const [opts, setOpts] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [burst, setBurst] = useState(0);
  const mistakes = useRef(0);
  const target = items[round];

  const build = useCallback(() => {
    const pool = VOCAB_CATALOG.filter((x) => x.en !== target.en);
    const same = shuffle(pool.filter((x) => x.islandId === target.islandId));
    const other = shuffle(pool.filter((x) => x.islandId !== target.islandId));
    const distr = [...same, ...other].slice(0, 3);
    setOpts(shuffle([target, ...distr]));
    setLocked(false); setWrongIdx(null);
    setTimeout(() => audio.whenIdle().then(() => speak(`Find the ${target.en}!`)), 450);
  }, [round]); // eslint-disable-line

  useEffect(() => { build(); }, [round]); // eslint-disable-line

  const pick = (it, i) => {
    if (locked) return;
    if (it.en === target.en) {
      setLocked(true); setBurst((b) => b + 1); onGem(target);
      speak(target.en, PRAISE[rand(PRAISE.length)]);
      setTimeout(() => {
        if (round + 1 >= N) onDone(mistakes.current === 0 ? 3 : mistakes.current <= 2 ? 2 : 1);
        else setRound((r) => r + 1);
      }, 1500);
    } else {
      mistakes.current += 1; setWrongIdx(i); onMiss(target);
      speak(`That's ${it.en}.`, `Find the ${target.en}!`);
      setTimeout(() => setWrongIdx(null), 700);
    }
  };

  if (!target) return null;
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <SparkleBurst trigger={burst} />
      <ProgressPips total={N} done={round} />
      <p className="text-lg font-semibold text-center" style={{ color: "#CDBBF2" }}>🔦 Ascolta e tocca la parola giusta!</p>
      <button onClick={() => speak(`Find the ${target.en}!`)} className="listen-btn">🔊 Riascolta</button>
      <div className="grid grid-cols-2 gap-6 mt-2">
        {opts.map((it, i) => (
          <button key={it.en} onClick={() => pick(it, i)}
            className={`opt-btn ${wrongIdx === i ? "shake" : ""}`}>
            <span className="text-5xl">{it.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const [view, setView] = useState({ screen: "profiles" }); // profiles|create|map|island|game|shop|daily
  const [celebrate, setCelebrate] = useState(false);
  const [dailyToast, setDailyToast] = useState(null); // bonus Fiamma Magica di oggi
  const [dailyItems, setDailyItems] = useState([]); // parole della Sfida di oggi (Faro)
  const [leveledUp, setLeveledUp] = useState(null); // overlay salita di livello
  const [shopBurst, setShopBurst] = useState(0);
  const [denyId, setDenyId] = useState(null); // carta negozio "non puoi permettertelo"
  const saveTimer = useRef(null);
  const prevLevelRef = useRef(null);
  const didInit = useRef(false);
  const syncedRef = useRef(null); // JSON dei profili già allineati col cloud (anti-eco)

  // Avvio: ascolta i profili dal cloud (condivisi tra dispositivi). Il profilo
  // attivo è invece locale a questo dispositivo. Alla prima ricezione decido la
  // schermata (creazione se non c'è nessun profilo, altrimenti selezione).
  useEffect(() => {
    if (didInit.current) return; // evita il doppio-mount di StrictMode in dev
    didInit.current = true;

    let localActiveId = null;
    try { localActiveId = localStorage.getItem(ACTIVE_KEY); } catch { /* n/d */ }

    // Profili già presenti in locale su QUESTO dispositivo (da prima del cloud)
    const seed = loadStore().profiles;

    let first = true;
    const unsub = subscribeProfiles((cloudProfiles) => {
      let profiles = cloudProfiles;

      if (first) {
        first = false;
        // Migrazione una-tantum: porta nel cloud i profili locali non ancora
        // presenti (confronto per id), così i progressi fatti prima del cloud
        // non si perdono e non si creano doppioni.
        const missing = seed.filter((sp) => !cloudProfiles.some((cp) => cp.id === sp.id));
        if (missing.length) {
          profiles = [...cloudProfiles, ...missing];
          pushProfiles(profiles).catch((e) => console.error("Migrazione cloud:", e));
        }
        setView({ screen: profiles.length ? "profiles" : "create" });
        syncedRef.current = JSON.stringify(profiles);
        const active = localActiveId && profiles.some((p) => p.id === localActiveId) ? localActiveId : null;
        setStore({ activeId: active, profiles });
        return;
      }

      const remoteJson = JSON.stringify(profiles);
      if (remoteJson === syncedRef.current) return; // nostro stesso salvataggio tornato indietro
      syncedRef.current = remoteJson;
      setStore((s) => {
        const activeId = s?.activeId ?? localActiveId;
        const stillThere = profiles.some((p) => p.id === activeId);
        return { activeId: stillThere ? activeId : null, profiles };
      });
    });

    return () => unsub();
  }, []);

  // Il profilo attivo resta salvato SOLO su questo dispositivo (non nel cloud)
  useEffect(() => {
    if (!store) return;
    try {
      if (store.activeId) localStorage.setItem(ACTIVE_KEY, store.activeId);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch { /* storage non disponibile */ }
  }, [store?.activeId]);

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

  // Salvataggio (debounced) dei PROFILI nel cloud. Salta se sono già allineati
  // (cambiamento arrivato dal cloud o nostro stesso eco) per non ciclare.
  useEffect(() => {
    if (!store) return;
    const json = JSON.stringify(store.profiles);
    if (json === syncedRef.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      syncedRef.current = json;
      pushProfiles(store.profiles).catch((e) => console.error("Salvataggio cloud:", e));
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [store?.profiles]); // eslint-disable-line

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

  // ─── Faro della Memoria: Sfida Giornaliera (aggiorna weak + ripasso Leitner) ───
  const onDailyGem = (item) => setProgress((p) => {
    const weak = { ...p.weak }; if (weak[item.en] > 0) weak[item.en] -= 1;
    const review = { ...(p.review || {}) };
    const cur = review[item.en] || { box: 0, seen: 0 };
    review[item.en] = { box: Math.min(5, cur.box + 1), seen: dayIndex() };
    return { ...p, gems: p.gems + 1, xp: p.xp + XP_PER_CORRECT, weak, review };
  });
  const onDailyMiss = (item) => setProgress((p) => {
    const weak = { ...p.weak }; weak[item.en] = (weak[item.en] || 0) + 2;
    const review = { ...(p.review || {}) };
    review[item.en] = { box: 0, seen: dayIndex() }; // sbagliata → torna alla scatola 0
    return { ...p, weak, review };
  });
  const startDaily = () => {
    audio.unlock();
    const stars = progress.stars || {};
    const seen = Object.keys(stars).filter((id) => Object.values(stars[id] || {}).some((v) => v > 0));
    setDailyItems(pickDailyItems(seen, progress.weak || {}, progress.review || {}, todayStr(), 6));
    setView({ screen: "daily" });
  };
  const finishDaily = (stars) => {
    setProgress((p) => {
      const firstToday = !(p.daily && p.daily.date === todayStr() && p.daily.done);
      const bonus = firstToday ? 5 : 0; // gemma bonus una sola volta al giorno
      return { ...p, gems: p.gems + bonus, daily: { date: todayStr(), done: true } };
    });
    speak("Great job!");
    setView({ screen: "map" });
  };
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
  const dailyDoneToday = !!(progress && progress.daily && progress.daily.date === todayStr() && progress.daily.done);
  const hasPlayed = !!(progress && Object.keys(progress.stars || {}).length > 0); // sblocca il Faro dopo il primo gioco
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
        .mic-btn { font-weight:800; font-size:1.15rem; color:#fff; border:none; border-radius:999px; padding:16px 32px; box-shadow:0 5px 0 #00000033; transition: transform .1s; }
        .mic-btn:active { transform: translateY(3px); box-shadow:0 2px 0 #00000033; }
        .mic-btn:disabled { opacity:.9; }
        @keyframes micPulse { 0%,100% { transform: scale(1); box-shadow:0 5px 0 #00000033, 0 0 0 0 #E8455A66;} 50% { transform: scale(1.05); box-shadow:0 5px 0 #00000033, 0 0 0 14px #E8455A00;} }
        .mic-pulse { animation: micPulse 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sparkle-fly,.star-twinkle,.gem-pop,.shake,.float,.flame-flicker,.mic-pulse { animation: none !important; } }
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
          {/* 🔦 Il Faro della Memoria — Sfida Giornaliera di ripasso (dopo il primo gioco) */}
          {hasPlayed && (
            <button onClick={startDaily} className="game-tile" style={{ width: "100%" }}>
              <span className="text-4xl">🔦</span>
              <span className="flex-1">
                <span className="display block text-lg leading-snug" style={{ color: "#F6F1FF" }}>Sfida di oggi</span>
                <span className="block text-sm" style={{ color: "#9F8CC9" }}>
                  {dailyDoneToday ? "✅ Fatta oggi — torna domani!" : "6 domande veloci di ripasso · +💎 bonus"}
                </span>
              </span>
              <span className="font-bold text-sm" style={{ color: dailyDoneToday ? "#7FE0A3" : "#FFB86B" }}>
                {dailyDoneToday ? "✅" : "▶"}
              </span>
            </button>
          )}
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
              const archLabel = idx === 0 ? "🏰 Arcipelago 1 · Il Regno Incantato — Starters" : idx === 11 ? "☁️ Arcipelago 2 · Le Terre di Mezzo — Movers" : idx === 21 ? "🌍 Arcipelago 3 · Il Grande Mondo — Flyers" : idx === 31 ? "🧭 Arcipelago 4 · Gli Esploratori — il ponte verso il B1" : idx === 41 ? "🎙️ Arcipelago 5 · La Voce — la conversazione (verso il B1)" : idx === 51 ? "🌍 Arcipelago 6 · Il Mondo Reale — arricchimento (B1+)" : idx === 61 ? "🏗️ Arcipelago 7 · La Palestra della Grammatica — la produzione (in stile A2 Key)" : idx === 71 ? "📖 Arcipelago 8 · Lettura e Ascolto — la comprensione (in stile A2 Key)" : idx === 81 ? "🎓 Arcipelago 9 · L'Accademia degli Esami — abbinamenti e prove (in stile A2 Key)" : idx === 91 ? "🎭 Arcipelago 10 · Il Grande Palco — la conversazione a scelte (verso il B1)" : null;
              return (
                <Fragment key={isl.id}>
                {archLabel && (
                  <div className="display text-sm mt-3 mb-1 text-center" style={{ color: "#CDBBF2", opacity: 0.9 }}>{archLabel}</div>
                )}
                <button className="game-tile" disabled={!unlocked}
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
                </Fragment>
              );
            })}
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "#7A68A8" }}>
            🔊 Attiva l'audio del tablet — le voci parlano in inglese! I progressi si salvano da soli.
          </p>
        </div>
      )}

      {/* ── SFIDA DI OGGI (Faro della Memoria) ── */}
      {view.screen === "daily" && progress && (
        <div className="flex flex-col items-center gap-5 px-5 py-8 w-full max-w-md relative z-10">
          <div className="w-full flex items-center">
            <button onClick={() => setView({ screen: "map" })}
              className="text-sm font-semibold px-4 py-2 rounded-full"
              style={{ background: "#ffffff12", color: "#CDBBF2", border: "1.5px solid #ffffff22" }}>← Mappa</button>
          </div>
          <h2 className="display text-2xl text-center" style={{ color: "#F6F1FF" }}>🔦 Sfida di oggi</h2>
          {dailyItems.length >= 4 ? (
            <DailyChallengeGame speak={speak} items={dailyItems}
              onGem={onDailyGem} onMiss={onDailyMiss} onDone={finishDaily} />
          ) : (
            <div className="text-center" style={{ color: "#CDBBF2" }}>
              <p className="text-lg">Gioca almeno un'isola per accendere il Faro! 🔦</p>
              <button onClick={() => setView({ screen: "map" })} className="listen-btn mt-4">Torna alla mappa</button>
            </div>
          )}
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
          {currentGame.type === "say" && (
            <SayGame speak={speak} cfg={currentGame.cfg} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "spelling" && (
            <SpellGame speak={speak} cfg={currentGame.cfg} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "story" && (
            <StoryGame speak={speak} story={currentGame.story} name={playerName}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "exam" && (
            <ExamGame speak={speak} cfg={currentGame.cfg} name={playerName}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "compare" && (
            <CompareGame speak={speak} cfg={currentGame.cfg}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "chat" && (
            <ChatGame speak={speak} cfg={currentGame.cfg} name={playerName}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "order" && (
            <OrderGame speak={speak} cfg={currentGame.cfg} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "cloze" && (
            <ClozeGame speak={speak} cfg={currentGame.cfg} weak={progress.weak}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "readscene" && (
            <ReadSceneGame speak={speak} cfg={currentGame.cfg} name={playerName}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "matching" && (
            <MatchGame speak={speak} cfg={currentGame.cfg} name={playerName}
              onGem={onGem} onMiss={onMiss} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
          {currentGame.type === "dialogue" && (
            <DialogueGame speak={speak} cfg={currentGame.cfg} name={playerName}
              onGem={onGem} onDone={finishGame(currentIsland.id, currentGame.key)} />
          )}
        </div>
      )}
    </div>
  );
}
