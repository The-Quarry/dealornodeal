
import React, { useState } from 'react'
import { fmtGBP } from '../utils'

export function EndPanel({ tookDeal, offerAccepted, playerAmount, onNewGame, onSubmitScore }:{ tookDeal:boolean; offerAccepted?:number; playerAmount:number; onNewGame:()=>void; onSubmitScore:(name:string)=>Promise<void> }){
  const won = tookDeal ? (offerAccepted ?? 0) : playerAmount
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      setStatus('saving')
      await onSubmitScore(name.trim())
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl glass shadow-sm">
        <div className="p-6 text-center space-y-3">
          <div className="text-sm uppercase tracking-widest text-neutral-500">Game Over</div>
          <div className="text-3xl sm:text-5xl font-extrabold">You won {fmtGBP(won)}</div>
          <div className="text-sm text-neutral-700">
            {tookDeal ? (
              <>You took the Banker’s deal of <strong>{fmtGBP(offerAccepted ?? 0)}</strong>. Your case contained <strong>{fmtGBP(playerAmount)}</strong>.</>
            ) : (
              <>You rejected all deals and revealed your case: <strong>{fmtGBP(playerAmount)}</strong>.</>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex items-center justify-center gap-2">
            <input
              className="px-3 py-2 rounded-xl border bg-white w-48"
              placeholder="Your name"
              maxLength={20}
              value={name}
              onChange={(e)=>setName(e.target.value)}
              disabled={status!=='idle' && status!=='error'}
            />
            <button className="btn-primary" disabled={!name.trim() || status==='saving' || status==='saved'}>
              {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved!' : 'Submit score'}
            </button>
          </form>

          <button className="btn-primary mt-3" onClick={onNewGame}>Play again</button>
        </div>
      </div>
    </div>
  )
}
