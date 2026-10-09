/**
 * Pure Web Audio harmonic chime synthesizer.
 * Creates tranquil acoustic resonance (singing bowl / bell) with zero asset downloads.
 */

export interface ChimeOptions {
  frequencies?: number[];
  duration?: number;
  gainScale?: number;
}

export function playZenChime(options: ChimeOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // F# major pentatonic harmonic series for serene natural resonance
      const freqs = options.frequencies || [370.0, 554.37, 739.99, 1108.73];
      const duration = options.duration || 3.2;
      const gainScale = options.gainScale || 0.08;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gainScale / (idx + 1), now + 0.15 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + duration + 0.3);
      });

      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore already closed
        }
        resolve();
      }, (duration + 0.3) * 1000);
    } catch (err) {
      console.warn('[Audio] Zen chime playback error:', err);
      resolve();
    }
  });
}
