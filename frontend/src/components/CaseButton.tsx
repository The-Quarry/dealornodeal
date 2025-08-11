
import React from 'react'
import { motion } from 'framer-motion'

export function CaseButton({ id, opened, isPlayer, onClick }: { id: number; opened: boolean; isPlayer: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={opened || (isPlayer && !opened)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!opened ? { scale: 1.03 } : undefined}
      whileTap={!opened ? { scale: 0.98 } : undefined}
      className={
        'relative h-16 rounded-2xl border shadow-sm font-semibold tracking-wide ' +
        (opened ? 'bg-neutral-100 text-neutral-400 border-dashed' : isPlayer ? 'bg-yellow-200/80 border-yellow-500' : 'bg-white')
      }
    >
      <span className="text-lg">#{id}</span>
      {isPlayer && !opened && <span className="absolute -top-2 -right-2 text-[10px] px-2 py-1 rounded-full bg-yellow-500 text-white shadow">Your case</span>}
    </motion.button>
  )
}
