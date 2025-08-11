
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfferModal({ open, amount, onDeal, onNoDeal }: { open: boolean; amount: string; onDeal: () => void; onNoDeal: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="glass rounded-2xl w-full max-w-md p-6 shadow-xl"
          >
            <div className="text-xl font-bold">📞 The Banker is calling…</div>
            <div className="text-neutral-700 mt-1">Based on what’s left, the Banker offers:</div>
            <div className="text-center text-4xl font-extrabold tracking-tight my-4">{amount}</div>
            <div className="flex justify-center gap-3">
              <button className="btn-primary" onClick={onDeal}>Deal</button>
              <button className="btn-ghost" onClick={onNoDeal}>No Deal</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
