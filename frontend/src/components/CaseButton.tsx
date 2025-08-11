import React from 'react'
import { motion } from 'framer-motion'
import { fmtGBP } from '../utils'

type Props = {
  id: number
  amount: number
  opened: boolean
  isPlayer: boolean
  onClick: () => void
}

export function CaseButton({ id, amount, opened, isPlayer, onClick }: Props) {
  // Disable clicks if already opened or it's the chosen player case
  const disabled = opened || isPlayer

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={opened ? `Case ${id} contains ${fmtGBP(amount)}` : `Open case ${id}`}
      className="relative h-24 [perspective:1000px] focus:outline-none"
    >
      <motion.div
        className="h-full w-full preserve-3d"
        initial={false}
        animate={{ rotateY: opened ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* FRONT (number) */}
        <div className="backface-hidden absolute inset-0 briefcase-body flex items-center justify-center">
          {/* Handle */}
          <div className="briefcase-handle"></div>

          {/* Latches */}
          <div className="briefcase-latch left-3"></div>
          <div className="briefcase-latch right-3"></div>

          {/* Number plate */}
          <div className={`briefcase-plate text-lg font-extrabold tracking-wide ${isPlayer ? 'ring-2 ring-yellow-400' : ''}`}>
            #{id}
          </div>

          {isPlayer && !opened && (
            <span className="absolute -top-2 -right-2 text-[10px] px-2 py-1 rounded-full bg-yellow-500 text-white shadow">
              Your case
            </span>
          )}
        </div>

        {/* BACK (revealed amount) */}
        <div
          className="backface-hidden absolute inset-0 briefcase-body flex items-center justify-center rotate-y-180 bg-white"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="text-2xl sm:text-3xl font-extrabold">
            {fmtGBP(amount)}
          </div>
        </div>
      </motion.div>
    </button>
  )
}
