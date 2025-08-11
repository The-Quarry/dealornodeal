
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { AMOUNTS, ROUNDS, shuffle, fmtGBP, bankerOffer, clickTone } from './utils'
import { CaseButton } from './components/CaseButton'
import { OfferModal } from './components/OfferModal'
import { EndPanel } from './components/EndPanel'
import { AmountsPanel } from './components/AmountsPanel'
import { Leaderboard, type ScoreRow } from './components/Leaderboard'

const API_BASE = import.meta.env.VITE_API_BASE || ''

type Case = { id: number; amount: number; opened: boolean }

export default function App(){
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9))
  const [cases, setCases] = useState<Case[]>([])
  const [playerCaseId, setPlayerCaseId] = useState<number | null>(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [picksThisRound, setPicksThisRound] = useState(0)
  const [offer, setOffer] = useState<number | null>(null)
  const [offerHistory, setOfferHistory] = useState<number[]>([])
  const [lastOpenedThisRound, setLastOpenedThisRound] = useState<number[]>([])
  const [dealTaken, setDealTaken] = useState<boolean | null>(null)
  const [leaderboard, setLeaderboard] = useState<ScoreRow[]>([])
  const [startTime] = useState<number>(() => Date.now())

  async function fetchLeaderboard(){
    try {
      const r = await fetch(`${API_BASE}/api/leaderboard?limit=20`)
      const data = await r.json()
      setLeaderboard(data.data || [])
    } catch { /* noop */ }
  }

  useEffect(() => { fetchLeaderboard() }, [])

  useEffect(() => {
    const shuffled = shuffle(AMOUNTS as unknown as number[], seed)
    const c: Case[] = shuffled.map((amount, i) => ({ id: i + 1, amount, opened: false }))
    setCases(c)
    setPlayerCaseId(null)
    setRoundIndex(0)
    setPicksThisRound(0)
    setOffer(null)
    setOfferHistory([])
    setLastOpenedThisRound([])
    setDealTaken(null)
  }, [seed])

  const remainingAmounts = useMemo(
    () => cases.filter((c) => !c.opened && c.id !== playerCaseId).map((c) => c.amount),
    [cases, playerCaseId]
  )
  const unopenedCount = useMemo(
    () => cases.filter((c) => !c.opened && c.id !== playerCaseId).length,
    [cases, playerCaseId]
  )
  const playerCase = useMemo(() => cases.find((c) => c.id === playerCaseId) || null, [cases, playerCaseId])
  const gameOver = dealTaken !== null || (playerCase && unopenedCount === 0)

  useEffect(() => {
    if (playerCaseId === null) return
    if (gameOver) return
    const target = ROUNDS[roundIndex] ?? 1
    if (picksThisRound >= target) {
      const offerVal = bankerOffer([...(remainingAmounts), playerCase!.amount], lastOpenedThisRound)
      setOffer(offerVal)
    }
  }, [picksThisRound, roundIndex, playerCaseId, remainingAmounts, lastOpenedThisRound, gameOver])

  function onCaseClick(c: Case) {
    if (gameOver) return
    if (playerCaseId === null) {
      setPlayerCaseId(c.id)
      clickTone(true)
      return
    }
    if (c.opened || c.id === playerCaseId) return
    setCases((prev) => prev.map((x) => (x.id === c.id ? { ...x, opened: true } : x)))
    setPicksThisRound((n) => n + 1)
    setLastOpenedThisRound((arr) => [...arr, c.amount])
    clickTone(c.amount < 1000)
    if (c.amount >= 300000) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
    }
  }

  function proceedAfterOffer(accepted: boolean) {
    if (offer === null) return
    setOfferHistory((h) => [...h, offer])
    setOffer(null)
    if (accepted) {
      setDealTaken(true)
      confetti({ particleCount: 200, spread: 60, origin: { y: 0.6 } })
      return
    }
    setRoundIndex((i) => i + 1)
    setPicksThisRound(0)
    setLastOpenedThisRound([])
  }

  function revealPlayerCase() {
    if (!playerCase) return 0
    const amount = playerCase.amount
    if (!dealTaken) {
      confetti({ particleCount: 220, spread: 70, origin: { y: 0.7 } })
    }
    return amount
  }

  function reset(newSeed?: number) {
    setSeed(newSeed ?? Math.floor(Math.random() * 1e9))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const amountsActive = new Set<number>([...remainingAmounts, ...(playerCase ? [playerCase.amount] : [])])
  const targetThisRound = ROUNDS[roundIndex] ?? 1

  async function submitScore(name: string){
    const won = (dealTaken ? (offerHistory[offerHistory.length-1] ?? 0) : (playerCase?.amount ?? 0))
    const payload = { name, amount: won, tookDeal: !!dealTaken, seed, durationMs: Date.now() - startTime }
    const r = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!r.ok) throw new Error('failed')
    await fetchLeaderboard()
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:16px_16px] opacity-30"></div>

      <div className="min-h-screen w-full p-4 sm:p-8 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            <header className="glass rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Deal or No Deal</h1>
                <p className="text-sm text-neutral-700">By The Quarry.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost" onClick={() => reset(seed)} title="Replay with same layout">Replay seed</button>
                <button className="btn-primary" onClick={() => reset()}>New game</button>
              </div>
            </header>

            {gameOver ? (
              <EndPanel
                tookDeal={dealTaken === true}
                offerAccepted={offerHistory[offerHistory.length - 1]}
                playerAmount={revealPlayerCase()}
                onNewGame={() => reset()}
                onSubmitScore={submitScore}
              />
            ) : (
              <motion.div
                className="grid grid-cols-4 sm:grid-cols-6 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                {cases.map((c) => {
                  const isPlayer = c.id === playerCaseId
                  return (
                    <CaseButton
                        key={c.id}
                        id={c.id}
                        amount={c.amount}
                      amount={c.amount}
                        opened={c.opened}
                      isPlayer={isPlayer}
                      onClick={() => onCaseClick(c)}
                    />
                  )
                })}
              </motion.div>
            )}
          </div>

          <aside className="sticky top-2 space-y-4">
            <div className="glass rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">Amounts</div>
                <button className="btn-ghost" onClick={() => reset()} title="New game">New game</button>
              </div>

              <AmountsPanel active={amountsActive} />

              <div className="space-y-1">
                <div className="text-sm font-medium">Round</div>
                <div className="text-2xl font-bold">{roundIndex + 1}</div>
                <div className="text-xs text-neutral-600">Open {targetThisRound} case(s)</div>
                <div className="text-xs text-neutral-600">This round: {picksThisRound}/{targetThisRound}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Offers</div>
                <div className="flex flex-wrap gap-2">
                  {offerHistory.length === 0 && <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs">—</span>}
                  {offerHistory.map((o, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-neutral-100 text-sm font-semibold">{fmtGBP(o)}</span>
                  ))}
                </div>
              </div>
            </div>

            <Leaderboard items={leaderboard} />
          </aside>
        </div>
      </div>

      <OfferModal
        open={offer !== null && !gameOver}
        amount={offer !== null ? fmtGBP(offer) : ''}
        onDeal={() => proceedAfterOffer(true)}
        onNoDeal={() => proceedAfterOffer(false)}
      />
    </div>
  )
}
