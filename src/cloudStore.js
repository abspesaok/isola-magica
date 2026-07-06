/* ═══════════════════════════════════════════════════════════
   Sincronizzazione cloud dei PROFILI tra dispositivi.

   Modello: un solo account "famiglia" (Email/Password). Chi conosce la
   password entra e vede gli stessi profili su qualunque dispositivo.
   I profili vivono in un unico documento Firestore (families/main); l'ID del
   profilo attivo (chi sta giocando QUI) resta invece locale al dispositivo.
   ═══════════════════════════════════════════════════════════ */
import { auth, db, FAMILY_EMAIL, FAMILY_DOC } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";

const familyRef = doc(db, FAMILY_DOC);

/* Notifica lo stato di accesso: cb(user|null). Restituisce la funzione per annullare. */
export function onAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

/* Entra con la password di famiglia (l'email è fissa). Lancia errore se sbagliata. */
export function signInFamily(password) {
  return signInWithEmailAndPassword(auth, FAMILY_EMAIL, (password || "").trim());
}

export function signOutFamily() {
  return signOut(auth);
}

/* Si mette in ascolto dei profili condivisi. onProfiles(profiliArray) viene
   chiamata a ogni cambiamento (anche dagli altri dispositivi). Se il documento
   non esiste ancora restituisce un elenco vuoto (la creazione/migrazione la
   decide chi chiama, in App). Restituisce la funzione per annullare l'ascolto. */
export function subscribeProfiles(onProfiles) {
  return onSnapshot(
    familyRef,
    (snap) => {
      const data = snap.exists() ? snap.data() || {} : {};
      onProfiles(Array.isArray(data.profiles) ? data.profiles : []);
    },
    (err) => console.error("Sync profili fallita:", err)
  );
}

/* Scrive i profili nel cloud (merge, con timestamp per sapere l'ultimo aggiornamento). */
export function pushProfiles(profiles) {
  return setDoc(
    familyRef,
    { profiles: profiles || [], updatedAt: serverTimestamp() },
    { merge: true }
  );
}
