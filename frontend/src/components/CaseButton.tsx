import React from "react";
import { motion } from "framer-motion";
import { fmtGBP } from "../utils";

type Props = {
  id: number;
  amount: number;
  opened: boolean;
  isPlayer: boolean;
  onClick: () => void;
};

export function CaseButton({ id, amount, opened, isPlayer, onClick }: Props) {
  // High threshold: £100,000+ shows RED reveal; lower shows BLUE
  const isHigh = amount >= 100_000;
  const disabled = opened || isPlayer;

  // Build label once
  const label = fmtGBP(amount);

  // Scale text so big values fit on the briefcase
  // <= £9,999: largest, £10k–£750k: medium, £1,000,000: smallest
  let amountClass = "text-2xl sm:text-3xl";      // £0–£4,999
  if (amount >= 1_000_000) {
    amountClass = "text-sm sm:text-lg";          // £1,000,000 (smallest)
  } else if (amount >= 100_000) {
    amountClass = "text-base sm:text-xl";        // £100k–£750k (now a bit smaller)
  } else if (amount >= 10_000) {
    amountClass = "text-lg sm:text-2xl";         // £10k–£99,999
  } else if (amount >= 5_000) {
    amountClass = "text-xl sm:text-3xl";         // £5k–£9,999
  }

  const aria = opened ? `Case ${id} contains ${label}` : `Open case ${id}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      className="relative h-24 [perspective:1000px] focus:outline-none w-full"
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
          {/* Handle & latches */}
          <div className="briefcase-handle" />
          <div className="briefcase-latch left-3" />
          <div className="briefcase-latch right-3" />

          {/* Number plate (no #) */}
          <div className="briefcase-plate text-lg font-extrabold tracking-wide">
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
            "backface-hidden absolute inset-0 briefcase-body flex items-center justify-center bg-gradient-to-b rotate-y-180 " +
            (isHigh ? " briefcase-reveal high" : " briefcase-reveal low")
          }
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className={"briefcase-amount font-extrabold leading-tight tracking-tight px-2 whitespace-nowrap " + amountClass}>
            {label}
          </div>
        </div>
      </motion.div>
    </button>
  );
}
