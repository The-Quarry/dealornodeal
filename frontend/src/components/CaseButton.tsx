import React from react
import { motion } from framer-motion
import { fmtGBP } from ../utils

type Props = {
  id: number
  amount: number
  opened: boolean
  isPlayer: boolean
  onClick: () => void
}

export function CaseButton({ id, amount, opened, isPlayer, onClick }: Props) {
  // Treat >= £100,000 as a "high" amount for red reveal
  const isHigh = amount >= 100000
  const disabled = opened || isPlayer

  // Slightly smaller font for very large numbers to prevent overflow
  const amountClass =
    amount >= 100000
      ? "text-xl sm:text-2xl"
      : "text-2xl sm:text-3xl"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={
        opened
          ? `Case ${id} contains ${fmtGBP(amount)}`
          : `Open case ${id}`
      }
      className="relative h-24 [perspective:1000px] focus:outline-none"
    >
      <motion.div
        className="h-full w-full preserve-3d"
        initial={false}
        animate={{ rotateY: opened ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* FRONT (number) */}
        <div
          className={
            "backface-hidden absolute inset-0 briefcase-body flex items-center justify-center " +
            (isPlayer && !opened ? " player" : "")
          }
        >
          {/* Handle */}
          <div className="briefcase-handle"></div>
          {/* Latches */}
          <div className="briefcase-latch left-3"></div>
          <div className="briefcase-latch right-3"></div>

          {/* Number plate (no #) */}
          <div
            className={
              "briefcase-plate text-lg font-extrabold tracking-wide"
            }
          >
            {id}
          </div>

          {isPlayer && !opened && (
            <span className="absolute -top-2 -right-2 text-[10px] px-2 py-1 rounded-full bg-emerald-600 text-white shadow">
              Your case
            </span>
          )}
        </div>

        {/* BACK (revealed amount) */}
        <div
          className={
            "backface-hidden absolute inset-0 briefcase-body flex items-center justify-center rotate-y-180 bg-gradient-to-b " +
            (isHigh ? " briefcase-reveal high" : " briefcase-reveal low")
          }
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className={"briefcase-amount font-extrabold " + amountClass}>
            {fmtGBP(amount)}
          </div>
        </div>
      </motion.div>
    </button>
  )
}
