import { useState, useEffect } from "react";
import { onAuth, signInFamily } from "./cloudStore";

/*
 * Cancello d'accesso con la password di famiglia, verificata da Firebase.
 * Entrando con la password si ottiene l'accesso ai profili condivisi in cloud
 * (gli stessi su ogni dispositivo). L'accesso resta memorizzato: la password
 * si inserisce una sola volta per dispositivo.
 */
export default function Gate({ children }) {
  const [authState, setAuthState] = useState("loading"); // loading | in | out
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuth((user) => setAuthState(user ? "in" : "out")), []);

  if (authState === "in") return children;

  async function submit(e) {
    e.preventDefault();
    if (busy || !value.trim()) return;
    setBusy(true);
    setError("");
    try {
      await signInFamily(value);
      // onAuth aggiornerà lo stato → verranno mostrati i figli (il gioco)
    } catch (err) {
      const code = err?.code || "";
      if (code.includes("network"))
        setError("Nessuna connessione: la prima volta serve internet.");
      else if (code.includes("too-many-requests"))
        setError("Troppi tentativi, riprova tra un minuto.");
      else setError("Codice non corretto, riprova.");
      setValue("");
      setBusy(false);
    }
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
        @keyframes gateSpin { to { transform: rotate(360deg) } }
      `}</style>

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

      {authState === "loading" ? (
        <>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "3px solid #ffffff33",
              borderTopColor: "#F8D978",
              animation: "gateSpin .8s linear infinite",
            }}
            aria-label="Caricamento"
          />
          <p style={{ margin: 0, fontSize: 15, color: "#9F8CC9" }}>Un attimo…</p>
        </>
      ) : (
        <>
          <p
            style={{ margin: 0, fontSize: 18, color: "#CDBBF2", textAlign: "center" }}
          >
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
                setError("");
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
              <span style={{ color: "#F9B4B4", fontSize: 15 }}>{error}</span>
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
              {busy ? "Entro…" : "Entra ✨"}
            </button>
          </form>

          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#7A68A8",
              textAlign: "center",
            }}
          >
            Stessa password su ogni dispositivo → stessi profili.
          </p>
        </>
      )}
    </div>
  );
}
