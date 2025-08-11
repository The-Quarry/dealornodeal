
import React from 'react'
import { fmtGBP } from '../utils'

export type ScoreRow = { id:number; name:string; amount_cents:number; took_deal:boolean; seed:number|null; duration_ms:number|null; created_at:string }

export function Leaderboard({ items }:{ items: ScoreRow[] }){
  return (
    <div className="rounded-2xl glass p-4 shadow-sm">
      <div className="text-xl font-bold mb-2">🏆 Leaderboard</div>
      {items.length === 0 ? (
        <div className="text-neutral-600 text-sm">No scores yet — be the first!</div>
      ) : (
        <ol className="space-y-2">
          {items.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2 border">
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-bold">{i+1}</span>
                <span className="font-semibold">{r.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{fmtGBP(r.amount_cents / 100)}</div>
                <div className="text-[11px] text-neutral-600">{new Date(r.created_at).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
