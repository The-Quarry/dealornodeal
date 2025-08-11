
# Deal or No Deal — GBP + Persistent Leaderboard (Render-ready)

This package has two projects:

- `frontend/` — React + Vite static site (GBP currency), with animations/confetti and a leaderboard UI.
- `server/` — Express API + PostgreSQL (auto-creates the `scores` table).

## Quick Start (local)

```bash
# 1) Server
cd server
npm i
# Create a Postgres DB (e.g. via Docker or local), then set DATABASE_URL:
export DATABASE_URL=postgres://USER:PASS@HOST:5432/DB
export ALLOWED_ORIGIN=http://localhost:5173
npm start

# 2) Frontend
cd ../frontend
npm i
# Point frontend to server:
echo 'VITE_API_BASE=http://localhost:3000' > .env
npm run dev
```

## Deploy on Render

### A) Database
1. Create a **PostgreSQL** instance on Render.
2. Copy the **Internal Database URL** (or External if using different regions).

### B) API (server)
1. Create a **Web Service** from `server/` repo folder.
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. **Environment Variables:**
   - `DATABASE_URL` = (from Render Postgres)
   - `ALLOWED_ORIGIN` = your frontend URL (e.g. `https://your-game.onrender.com`)
5. Deploy. Check `/api/health` returns `{ ok: true }`.

### C) Frontend (static site)
1. Create a **Static Site** from `frontend/` folder.
2. **Build Command:** `npm ci && npm run build`
3. **Publish directory:** `dist`
4. **Environment Variable:** `VITE_API_BASE` = your server URL (e.g. `https://your-api.onrender.com`)
5. Deploy. The leaderboard should populate once scores are submitted.

### Embedding on your website
```html
<iframe src="https://your-game.onrender.com"
        style="width:100%;height:720px;border:0;border-radius:12px;overflow:hidden"
        allow="clipboard-write; fullscreen"></iframe>
```

## Customization
- Currency: already GBP. Adjust locale/precision in `fmtGBP()` inside `frontend/src/utils.ts` if needed.
- Name length: change 20-char limit in `server/index.js` and the frontend input.
- Leaderboard size: tweak `limit` query in `frontend/src/App.tsx` and server default.
- Data kept: amount, tookDeal, seed, durationMs, created_at.

Enjoy!
