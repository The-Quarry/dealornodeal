
import React from 'react'
import { AMOUNTS, fmtGBP } from '../utils'

export function AmountsPanel({ active }:{ active:Set<number> }){
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {AMOUNTS.map((amt) => (
        <div key={amt} className={'px-3 py-1 rounded-full border text-right font-semibold ' + (active.has(amt) ? 'bg-white' : 'bg-neutral-100 text-neutral-400 line-through')}>
          {fmtGBP(amt)}
        </div>
      ))}
    </div>
  )
}
