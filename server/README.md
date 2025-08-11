
# DoND Leaderboard Server (Express + PostgreSQL)

Env vars required:
- `DATABASE_URL` — Render PostgreSQL connection string
- `ALLOWED_ORIGIN` — your frontend URL (e.g. `https://your-game.onrender.com`) for CORS

Endpoints:
- `GET /api/leaderboard?limit=20`
- `POST /api/score` JSON body: `{ name, amount, tookDeal, seed?, durationMs? }`
