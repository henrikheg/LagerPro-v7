# LagerPro v7.3 – Komplett (Norsk)
- 🔐 JWT + roller (admin/worker)
- 🧱 Lager + SMS-lavbeholdning + e-post
- 📁 Prosjekter (materialer, verktøy, bestillinger)
- 🧮 Kalkulatorer + 3D, og **lagre til prosjekt** med automatisk **uttak fra Hovedlager**
- 📄 Prosjektrapport (PDF) + e-post
- 🔧 Admin: hash alle passord, DB eksport/import
- 🖼️ Logo inkludert

## Mobil-oppsett (kort)
**Backend (Render)**: Root `inventory-server` → Build `npm install` → Start `npm start` → sett env fra `.env.sample`  
**Frontend (Vercel)**: Root `inventory-web` → Build `vite build` → Output `dist` → i `inventory-web/index.html`: sett `window.__API__` til din Render-URL.

## Opplastingsrekkefølge (GitHub → Render/Vercel)
1. Last opp **hele ZIP** til GitHub (`Upload files` → velg ZIP → Commit)
2. Render: pek mot `inventory-server` og deploy
3. Vercel: pek mot `inventory-web` og deploy
4. I GitHub, rediger `inventory-web/index.html` → sett `window.__API__`

## Standard login
- admin / lagerpro123
