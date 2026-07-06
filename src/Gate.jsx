import { useState } from "react";

/*
 * Cancello d'accesso "codice famiglia".
 * Il codice NON è scritto in chiaro nel sito: qui c'è solo il suo hash SHA-256,
 * così chi curiosa nel codice sorgente non lo trova. Non è sicurezza "da banca"
 * (l'app resta un file statico), ma blocca chiunque non conosca il codice.
 *
 * Cambiare codice = sostituire CODE_HASH con l'hash della nuova parola.
 * (Hash attuale = SHA-256 di "nanette".)
 */
const CODE_HASH = "3456f0ae06e4588d0198dcb76b15388e3f08c74c49b5c3842a81279d11db06bb";
const UNLOCK_KEY = "isola-magica-unlocked-v1";

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Gate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (unlocked) return children;

  async function submit(e) {
    e.preventDefault();
    if (busy || !value.trim()) return;
    setBusy(true);
    setError(false);
    try {
      const ok = (await sha256Hex(value.trim().toLowerCase())) === CODE_HASH;
      if (ok) {
        try {
          localStorage.setItem(UNLOCK_KEY, "1");
        } catch {}
        setUnlocked(true);
        return;
      }
    } catch {
      // crypto.subtle non disponibile (contesto non sicuro): trattiamo come errore
    }
    setError(true);
    setValue("");
    setBusy(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        padding: 24,
        background:
          "radial-gradient(120% 80% at 50% 0%, #3A2668 0%, #241a4d 45%, #1E1440 100%)",
        fontFamily: "'Baloo 2', 'Nunito', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes gateShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes gateFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      {/* Qualche stellina di sfondo, come nel gioco */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            fontSize: i % 3 ? 10 : 15,
            opacity: 0.45,
            color: "#E7DBFF",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>
      ))}

      <div
        style={{ fontSize: 68, animation: "gateFloat 4.5s ease-in-out infinite" }}
        aria-hidden="true"
      >
        🏝️
      </div>

      <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#F6F1FF" }}>
        Isola Magica
      </h1>
      <p style={{ margin: 0, fontSize: 18, color: "#CDBBF2", textAlign: "center" }}>
        Inserisci il codice per entrare
      </p>

      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: "100%",
          maxWidth: 320,
          animation: error ? "gateShake .35s ease-in-out" : "none",
        }}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          type="password"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Codice"
          aria-label="Codice di accesso"
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 16,
            border: error ? "2px solid #F58A8A" : "2px solid #ffffff30",
            background: "#ffffff12",
            color: "#F6F1FF",
            fontSize: 24,
            textAlign: "center",
            outline: "none",
            fontFamily: "'Baloo 2', 'Nunito', system-ui, sans-serif",
          }}
        />

        {error && (
          <span style={{ color: "#F9B4B4", fontSize: 15 }}>
            Codice non corretto, riprova.
          </span>
        )}

        <button
          type="submit"
          disabled={!value.trim() || busy}
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#2D1B4E",
            background: "linear-gradient(180deg,#F8D978,#E0AC3C)",
            border: "none",
            borderRadius: 999,
            padding: "14px 40px",
            boxShadow: "0 5px 0 #B8892E",
            opacity: value.trim() && !busy ? 1 : 0.5,
            cursor: value.trim() && !busy ? "pointer" : "default",
          }}
        >
          Entra ✨
        </button>
      </form>

      <p style={{ margin: 0, fontSize: 12, color: "#7A68A8", textAlign: "center" }}>
        Il codice va inserito una sola volta per dispositivo.
      </p>
    </div>
  );
}
