/* ═══════════════════════════════════════════════════════════
   Firebase — sincronizzazione dei profili tra dispositivi.

   NB: questa configurazione NON è segreta. Le "apiKey" di Firebase Web
   sono identificatori pubblici pensati per stare nel codice del client;
   la sicurezza vera la fanno l'autenticazione (password) e le regole di
   sicurezza di Firestore. Quindi è corretto che sia versionata qui.
   ═══════════════════════════════════════════════════════════ */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlljJJ9HzY5WjXc4IPuzWAUPECNdmZ8Ss",
  authDomain: "isola-magica.firebaseapp.com",
  projectId: "isola-magica",
  storageBucket: "isola-magica.firebasestorage.app",
  messagingSenderId: "1049491324699",
  appId: "1:1049491324699:web:74a9a916f19c1056901dbe",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore con cache locale persistente → funziona anche offline e
// riallinea al cloud appena torna la connessione. Se il browser blocca la
// persistenza (es. navigazione privata), si ripiega su Firestore "in memoria".
export const db = (() => {
  try {
    return initializeFirestore(app, { localCache: persistentLocalCache() });
  } catch {
    return getFirestore(app);
  }
})();

/* Account unico di famiglia: l'utente digita SOLO la password; l'email è fissa
   e serve solo a Firebase come identificatore dell'unico account condiviso. */
export const FAMILY_EMAIL = "famiglia@isola-magica.app";

/* Dove vivono i profili condivisi in Firestore: un solo documento. */
export const FAMILY_DOC = "families/main";
