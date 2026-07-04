import { useState, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   REGNO INCANTATO — Generatore Audio Batch (ElevenLabs)
   Costruisce ~300 clip MP3 da tutte le frasi del gioco
   e le scarica in un unico ZIP (+ manifest.json).
   La API key vive solo in memoria: mai salvata, mai loggata.
   ═══════════════════════════════════════════════════════════ */

/* ─── Game data (must mirror the game exactly) ─── */
const COLORS = ["red","blue","green","yellow","purple","pink","orange","brown","white","black"];
const ANIMALS = ["cat","dog","horse","fish","bird","elephant","lion","monkey","mouse","sheep","cow","duck","frog","bee"];
const FAMILY = ["mother","father","sister","brother","baby","grandmother","grandfather"];
const BODY = ["eyes","ear","nose","mouth","hand","foot","arm","leg","face"];
const FOOD = ["apple","banana","orange","egg","bread","milk","water","cake","ice cream","pizza","chicken","rice","carrot","grapes"];
const HOUSE = ["bed","chair","door","window","lamp","clock","key","sofa","television","cup"];
const SCHOOL = ["book","pen","pencil","bag","ruler","scissors","crayon","notebook"];
const NUMBER_WORDS = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
const PRAISE = ["Great job!","Wonderful!","Perfect!","Amazing!","Well done!","Fantastic!"];
const PREP_SUBJECTS = ["cat","dog","ball","mouse"];
const PREP_OBJECTS = ["box","chair","bed"];
const PREPS = ["in","on","under"];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_");

function buildManifest() {
  const M = [];
  const add = (file, text) => M.push({ file: `${file}.mp3`, text });

  /* system */
  add("sys_welcome", "Welcome to the Magic Kingdom, Silvana!");
  PRAISE.forEach((p, i) => add(`praise_${i + 1}`, p));
  add("sys_howmany", "How many stars?");
  add("sys_tryagain", "Try again! How many stars?");
  add("sys_pairs_intro", "Find the pairs! Match the word and the picture.");
  add("sys_pairs_done", "You found all the pairs!");

  /* single words */
  COLORS.forEach((w) => add(`word_${slug(w)}`, w));
  ANIMALS.forEach((w) => add(`word_${slug(w)}`, w));
  FAMILY.forEach((w) => add(`word_${slug(w)}`, w));
  BODY.forEach((w) => add(`word_${slug(w)}`, w));
  FOOD.forEach((w) => add(`word_${slug(w)}`, w));
  HOUSE.forEach((w) => { if (!M.some((m) => m.file === `word_${slug(w)}.mp3`)) add(`word_${slug(w)}`, w); });
  SCHOOL.forEach((w) => { if (!M.some((m) => m.file === `word_${slug(w)}.mp3`)) add(`word_${slug(w)}`, w); });
  PREPS.forEach((w) => add(`word_${slug(w)}`, w));
  for (let n = 1; n <= 20; n++) add(`word_num_${n}`, NUMBER_WORDS[n]);

  /* prompts — Isola 1 */
  COLORS.forEach((c) => add(`prompt_gem_${slug(c)}`, `Find the ${c} gem!`));
  for (let n = 1; n <= 20; n++) add(`yes_${n}`, `Yes! ${NUMBER_WORDS[n]} stars.`);

  /* prompts — Isola 2 */
  ANIMALS.forEach((a) => add(`prompt_animal_${slug(a)}`, `Find the ${a}!`));
  const usable = COLORS.filter((c) => !["white","black","brown"].includes(c));
  ANIMALS.slice(0, 10).forEach((a, i) => {
    [usable[i % usable.length], usable[(i + 3) % usable.length]].forEach((c) => {
      add(`prompt_combo_${slug(c)}_${slug(a)}`, `Find the ${c} ${a}!`);
      add(`name_combo_${slug(c)}_${slug(a)}`, `the ${c} ${a}`);
    });
  });

  /* prompts — Isola 3 */
  FAMILY.forEach((f) => add(`prompt_family_${slug(f)}`, `Find the ${f}!`));
  BODY.forEach((b) => add(`prompt_body_${slug(b)}`, `Touch the ${b}!`));

  /* prompts — Isola 4 */
  FOOD.forEach((f) => add(`prompt_food_${slug(f)}`, `I like ${f}! Give me the ${f}, please!`));

  /* prompts — Isola 5 */
  HOUSE.forEach((h) => add(`prompt_house_${slug(h)}`, `Find the ${h}!`));
  PREP_SUBJECTS.forEach((s) =>
    PREP_OBJECTS.forEach((o) =>
      PREPS.forEach((p) => add(`prompt_prep_${slug(s)}_${slug(p)}_${slug(o)}`, `The ${s} is ${p} the ${o}!`))
    )
  );
  PREPS.forEach((p) => PREP_OBJECTS.forEach((o) => add(`name_prep_${slug(p)}_${slug(o)}`, `${p} the ${o}`)));

  /* prompts — Isola 6 */
  SCHOOL.forEach((s) => add(`prompt_school_${slug(s)}`, `Put the ${s} in the bag!`));
  SCHOOL.slice(0, 6).forEach((o, i) => {
    [usable[i % usable.length], usable[(i + 3) % usable.length]].forEach((c) => {
      add(`prompt_scombo_${slug(c)}_${slug(o)}`, `Find the ${c} ${o}!`);
      add(`name_scombo_${slug(c)}_${slug(o)}`, `the ${c} ${o}`);
    });
  });

  /* dedupe by filename (word overlaps across islands) */
  const seen = new Set();
  return M.filter((m) => (seen.has(m.file) ? false : (seen.add(m.file), true)));
}

/* ─── Minimal ZIP writer (store, no compression — MP3s don't compress) ─── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(u8) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function makeZip(files) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const nameB = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, size, true); lh.setUint32(22, size, true);
    lh.setUint16(26, nameB.length, true);
    parts.push(new Uint8Array(lh.buffer), nameB, f.data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, size, true); ch.setUint32(24, size, true);
    ch.setUint16(28, nameB.length, true); ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), nameB);
    offset += 30 + nameB.length + size;
  }
  const centralSize = central.reduce((s, c) => s + c.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(8, files.length, true); eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, centralSize, true); eocd.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(eocd.buffer)], { type: "application/zip" });
}

/* ─── ElevenLabs API ─── */
async function ttsCall({ apiKey, voiceId, model, text, settings }) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        model_id: model,
        text,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity,
          style: settings.style,
          use_speaker_boost: true,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 140)}`);
  return new Uint8Array(await res.arrayBuffer());
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [voices, setVoices] = useState([]);
  const [model, setModel] = useState("eleven_turbo_v2_5");
  const [settings, setSettings] = useState({ stability: 0.55, similarity: 0.8, style: 0.3 });
  const [status, setStatus] = useState("idle"); // idle | testing | running | done
  const [doneCount, setDoneCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [log, setLog] = useState("");
  const [zipUrl, setZipUrl] = useState(null);
  const resultsRef = useRef({});
  const abortRef = useRef(false);
  const audioRef = useRef(null);

  const manifest = useMemo(buildManifest, []);
  const totalChars = useMemo(() => manifest.reduce((s, m) => s + m.text.length, 0), [manifest]);

  const loadVoices = async () => {
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": apiKey } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVoices(data.voices || []);
      setLog(`✅ ${data.voices?.length || 0} voci caricate dal tuo account`);
    } catch (e) {
      setLog(`❌ Errore nel caricare le voci: ${e.message} — controlla la API key`);
    }
  };

  const playTest = async () => {
    if (!apiKey || !voiceId) { setLog("⚠️ Inserisci API key e scegli una voce"); return; }
    setStatus("testing");
    setLog("🎧 Genero una frase di prova…");
    try {
      const data = await ttsCall({ apiKey, voiceId, model, settings, text: "Welcome to the Magic Kingdom, Silvana! Find the red gem!" });
      const url = URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
      setLog("✅ Prova generata: ascoltala. Se la voce ti piace, lancia la generazione completa.");
    } catch (e) {
      setLog(`❌ Test fallito: ${e.message}`);
    }
    setStatus("idle");
  };

  const runAll = async () => {
    if (!apiKey || !voiceId) { setLog("⚠️ Inserisci API key e scegli una voce"); return; }
    setStatus("running"); setErrors([]); setZipUrl(null); abortRef.current = false;
    const todo = manifest.filter((m) => !resultsRef.current[m.file]);
    setDoneCount(manifest.length - todo.length);
    let idx = 0;
    const failed = [];
    const WORKERS = 3;
    const worker = async () => {
      while (!abortRef.current) {
        const i = idx++;
        if (i >= todo.length) return;
        const item = todo[i];
        try {
          const data = await ttsCall({ apiKey, voiceId, model, settings, text: item.text });
          resultsRef.current[item.file] = data;
        } catch (e1) {
          await new Promise((r) => setTimeout(r, 1500)); // one retry
          try {
            const data = await ttsCall({ apiKey, voiceId, model, settings, text: item.text });
            resultsRef.current[item.file] = data;
          } catch (e2) {
            failed.push({ file: item.file, err: e2.message });
          }
        }
        setDoneCount((d) => d + 1);
      }
    };
    await Promise.all(Array.from({ length: WORKERS }, worker));
    setErrors(failed);
    if (!abortRef.current && failed.length === 0) {
      buildZip();
      setStatus("done");
      setLog("🎉 Tutti gli audio generati! Scarica lo ZIP qui sotto.");
    } else if (failed.length > 0) {
      setStatus("idle");
      setLog(`⚠️ ${failed.length} clip fallite — premi di nuovo Genera: riprende solo dalle mancanti.`);
    } else {
      setStatus("idle");
      setLog("⏸️ Fermato. Premi Genera per riprendere da dove eri.");
    }
  };

  const buildZip = () => {
    const files = manifest
      .filter((m) => resultsRef.current[m.file])
      .map((m) => ({ name: `audio/${m.file}`, data: resultsRef.current[m.file] }));
    files.push({
      name: "manifest.json",
      data: new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
    });
    const blob = makeZip(files);
    setZipUrl(URL.createObjectURL(blob));
  };

  const pct = Math.round((doneCount / manifest.length) * 100);
  const generated = Object.keys(resultsRef.current).length;

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #ffffff26", background: "#ffffff10", color: "#F6F1FF", fontSize: 15, outline: "none" };
  const btnStyle = (primary) => ({ padding: "12px 22px", borderRadius: 999, border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer", color: primary ? "#2D1B4E" : "#E7DBFF", background: primary ? "linear-gradient(180deg,#F8D978,#E0AC3C)" : "#ffffff18", boxShadow: primary ? "0 4px 0 #B8892E" : "none", border: primary ? "none" : "2px solid #ffffff28" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1E1440,#2D1B4E 55%,#45307A)", fontFamily: "'Nunito', system-ui, sans-serif", display: "flex", justifyContent: "center", padding: "28px 16px" }}>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>
        <h1 style={{ color: "#F6F1FF", fontSize: 26, fontWeight: 800, margin: 0, textAlign: "center" }}>
          🎙️ Regno Incantato — <span style={{ color: "#F5C64F" }}>Generatore Audio</span>
        </h1>
        <p style={{ color: "#CDBBF2", fontSize: 14, textAlign: "center", margin: 0 }}>
          {manifest.length} clip · {totalChars.toLocaleString("it-IT")} caratteri totali · la API key resta solo in memoria
        </p>

        {/* credentials */}
        <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ color: "#9F8CC9", fontSize: 13, fontWeight: 700 }}>API KEY ELEVENLABS</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk_…" style={inputStyle} autoComplete="off" />
            <button onClick={() => setShowKey(!showKey)} style={btnStyle(false)}>👁</button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={loadVoices} style={btnStyle(false)} disabled={!apiKey}>Carica le tue voci</button>
            {voices.length > 0 && (
              <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option value="">— scegli la voce —</option>
                {voices.map((v) => (
                  <option key={v.voice_id} value={v.voice_id} style={{ color: "#222" }}>
                    {v.name} {v.labels?.gender ? `(${v.labels.gender})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
          {voices.length === 0 && (
            <input value={voiceId} onChange={(e) => setVoiceId(e.target.value)} placeholder="…oppure incolla direttamente un Voice ID" style={inputStyle} />
          )}
        </div>

        {/* settings */}
        <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: "#9F8CC9", fontSize: 13, fontWeight: 700 }}>IMPOSTAZIONI VOCE (preset "gioco per bambini")</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: "#CDBBF2", fontSize: 14, width: 110 }}>Modello</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              <option value="eleven_turbo_v2_5" style={{ color: "#222" }}>Turbo v2.5 (veloce, metà crediti)</option>
              <option value="eleven_multilingual_v2" style={{ color: "#222" }}>Multilingual v2 (massima qualità)</option>
            </select>
          </div>
          {[["stability", "Stability"], ["similarity", "Similarity"], ["style", "Style"]].map(([k, label]) => (
            <div key={k} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#CDBBF2", fontSize: 14, width: 110 }}>{label}</span>
              <input type="range" min="0" max="1" step="0.05" value={settings[k]} onChange={(e) => setSettings({ ...settings, [k]: parseFloat(e.target.value) })} style={{ flex: 1 }} />
              <span style={{ color: "#F0D98C", fontWeight: 700, width: 44, textAlign: "right" }}>{settings[k].toFixed(2)}</span>
            </div>
          ))}
          <p style={{ color: "#7A68A8", fontSize: 12, margin: 0 }}>
            Consiglio: voce femminile calda e allegra · Stability 0.55 (vivace ma stabile) · Style 0.30 (espressiva, da fiaba).
          </p>
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={playTest} style={btnStyle(false)} disabled={status === "running"}>🎧 Prova la voce</button>
          {status !== "running" ? (
            <button onClick={runAll} style={btnStyle(true)}>
              ⚡ Genera {generated > 0 ? `le ${manifest.length - generated} mancanti` : `tutte le ${manifest.length} clip`}
            </button>
          ) : (
            <button onClick={() => { abortRef.current = true; }} style={btnStyle(false)}>⏸️ Ferma</button>
          )}
        </div>
        <audio ref={audioRef} controls style={{ width: "100%", display: status === "idle" && !log.startsWith("✅ Prova") ? "none" : "block" }} />

        {/* progress */}
        {(status === "running" || generated > 0) && (
          <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18 }}>
            <div style={{ height: 16, borderRadius: 999, background: "#ffffff14", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#F5C64F,#F27EB6)", transition: "width .3s" }} />
            </div>
            <p style={{ color: "#CDBBF2", fontSize: 14, margin: "10px 0 0", textAlign: "center" }}>
              {doneCount}/{manifest.length} clip ({pct}%)
            </p>
          </div>
        )}

        {log && <p style={{ color: "#E7DBFF", fontSize: 14, textAlign: "center", margin: 0 }}>{log}</p>}

        {errors.length > 0 && (
          <div style={{ background: "#E8455A22", border: "2px solid #E8455A55", borderRadius: 16, padding: 14, color: "#FFD9DE", fontSize: 13 }}>
            {errors.slice(0, 5).map((e) => (<div key={e.file}>❌ {e.file}: {e.err}</div>))}
            {errors.length > 5 && <div>…e altre {errors.length - 5}</div>}
          </div>
        )}

        {(zipUrl || (status !== "running" && generated > 0)) && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {!zipUrl && <button onClick={buildZip} style={btnStyle(false)}>📦 Prepara ZIP con le {generated} pronte</button>}
            {zipUrl && (
              <a href={zipUrl} download="regno-incantato-audio.zip" style={{ ...btnStyle(true), textDecoration: "none", display: "inline-block" }}>
                ⬇️ Scarica regno-incantato-audio.zip
              </a>
            )}
          </div>
        )}

        <p style={{ color: "#7A68A8", fontSize: 12, textAlign: "center" }}>
          Dentro lo ZIP: cartella <b>audio/</b> con i {manifest.length} MP3 nominati per il gioco + <b>manifest.json</b> (mappa file → frase).
        </p>
      </div>
    </div>
  );
}
