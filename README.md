# 🏰 Silvana e il Regno Incantato

PWA per imparare l'inglese giocando (Cambridge YLE, da Starters a Flyers).
Motore a isole, giochi *listen & tap / count / memory*, sistema di ripasso
"gemme perdute", progressi salvati in locale e voce inglese (MP3 ElevenLabs
con riserva `speechSynthesis`).

## 🚀 Sviluppo

```bash
npm install
npm run dev        # http://localhost:5173
```

Build di produzione e anteprima:

```bash
npm run build
npm run preview
```

## 🔊 Audio

Le voci del gioco stanno in `public/audio/` come MP3 + `manifest.json`
(prodotti da `reference/generatore-audio-regno.jsx`). Vedi
`public/audio/README.md`. **Senza quei file il gioco funziona lo stesso**:
usa la voce sintetica del dispositivo.

## 🎨 Icone

Gli SVG sorgente sono in `public/icons/`. Per rigenerare i PNG:

```bash
npm install --no-save sharp
npm run gen:icons
```

I PNG vanno committati (il deploy non dipende da `sharp`).

## 📲 Installazione su tablet ("Aggiungi a Home")

Apri il sito pubblicato, poi:
- **iPad/Safari** → Condividi → *Aggiungi alla schermata Home*
- **Android/Chrome** → menu ⋮ → *Installa app* / *Aggiungi a schermata Home*

Parte a schermo intero, in verticale, e funziona offline.

## ☁️ Deploy su GitHub Pages

Il workflow `.github/workflows/deploy.yml` builda e pubblica a ogni push su
`main`. La `base` viene impostata automaticamente a `/<nome-repo>/`.

Prima volta:

```bash
git remote add origin https://github.com/<utente>/<repo>.git
git push -u origin main
```

Poi su GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Il sito sarà su `https://<utente>.github.io/<repo>/`.

## 🗂️ Struttura

```
src/
├── App.jsx      Il gioco (motore a isole, 6 isole giocabili + 4 in arrivo)
├── audio.js     Motore audio: MP3 dal manifest + fallback speechSynthesis
├── storage.js   Progressi su localStorage
├── main.jsx     Entry + registrazione service worker
└── index.css    Tailwind
public/
├── icons/       Icone PWA (SVG sorgente + PNG generati)
└── audio/       MP3 + manifest.json (da popolare)
reference/        Piano delle 30 isole + generatore audio (materiale di lavoro)
```

## 🧭 Prossimi passi

- Level-up: XP, titoli, streak "Fiamma Magica", negozio gemme
- Isole 7–10 (Ballo, Giardino, Guardaroba, BOSS Drago)

Il piano completo è in `reference/silvana-mappa-del-regno.md`.
