
import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import { z } from 'zod'

const { Pool } = pkg

const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL')
  process.exit(1)
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 20),
      amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
      took_deal BOOLEAN NOT NULL,
      seed BIGINT,
      duration_ms INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS scores_amount_idx ON scores (amount_cents DESC, created_at DESC);
  `)
  console.log('DB ready')
}

const app = express()
app.use(express.json())
app.use(cors({ origin: ALLOWED_ORIGIN === '*' ? true : [ALLOWED_ORIGIN] }))

const scoreSchema = z.object({
  name: z.string().min(1).max(20),
  amount: z.number().nonnegative(),
  tookDeal: z.boolean(),
  seed: z.number().int().optional(),
  durationMs: z.number().int().nonnegative().optional()
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/leaderboard', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100)
  try {
    const { rows } = await pool.query('SELECT id, name, amount_cents, took_deal, seed, duration_ms, created_at FROM scores ORDER BY amount_cents DESC, created_at DESC LIMIT $1', [limit])
    res.json({ data: rows })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/score', async (req, res) => {
  const parsed = scoreSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid', details: parsed.error.flatten() })
  }
  const { name, amount, tookDeal, seed, durationMs } = parsed.data
  const amountCents = Math.round(amount * 100)
  try {
    const { rows } = await pool.query(
      'INSERT INTO scores (name, amount_cents, took_deal, seed, duration_ms) VALUES ($1,$2,$3,$4,$5) RETURNING id, created_at',
      [name, amountCents, tookDeal, seed ?? null, durationMs ?? null]
    )
    res.json({ ok: true, id: rows[0].id, created_at: rows[0].created_at })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'db_error' })
  }
})

init().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
}).catch(err => {
  console.error('Failed to init DB', err)
  process.exit(1)
})
