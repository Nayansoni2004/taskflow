// Web Audio API synthesized sounds (offline, 0 external assets)
let audioCtx = null

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playCompletionSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Pleasant double pop chime (E5 -> B5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, now) // E5
    osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.08) // B5

    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.25)
  } catch (err) {
    // Ignore audio errors if blocked by browser policy
  }
}

export function playTimerEndSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Harmonious 3-tone alert (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const startTime = now + idx * 0.12

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.12, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
  } catch (err) {
    // Ignore audio errors
  }
}

export function playClickSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.03)
  } catch (err) {
    // Ignore audio errors
  }
}
