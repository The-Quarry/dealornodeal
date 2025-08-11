
export const AMOUNTS = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000,
  5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000,
  500000, 750000, 1000000,
] as const

export const ROUNDS = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1]

export function shuffle<T>(arr: T[], seed?: number): T[] {
  if (seed !== undefined) {
    let a = [...arr]
    let m = 2 ** 31 - 1
    let s = (seed % m + m) % m
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 48271) % m
      const j = s % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  let a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function fmtGBP(n: number) {
  return n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: n < 1 ? 2 : 0 })
}

export function bankerOffer(remaining: number[], openedThisRound: number[]): number {
  const ev = remaining.reduce((a, b) => a + b, 0) / remaining.length
  const pctHighLeft = remaining.filter((v) => v >= 100000).length / remaining.length
  const roundsLeftScale = 0.65 + 0.35 * (1 - remaining.length / AMOUNTS.length)
  const momentum = openedThisRound.some((v) => v >= 300000) ? 0.92 : 1.05
  const riskBias = 0.9 + pctHighLeft * 0.25
  return Math.round(ev * roundsLeftScale * riskBias * momentum)
}

export function clickTone(good = true) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = good ? 880 : 220
  o.connect(g); g.connect(ctx.destination)
  g.gain.setValueAtTime(0.0001, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)
  o.start()
  o.stop(ctx.currentTime + 0.21)
}
