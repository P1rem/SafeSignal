/**
 * Generates a short emergency alert tone using the Web Audio API.
 * No external audio file required. Handles browser autoplay restrictions gracefully.
 */
export function playSosSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Two short high-pitched beeps — emergency alert pattern
    const frequencies = [880, 660];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.25;

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
      gain.gain.linearRampToValueAtTime(0, start + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.22);
    });

    // Close context after sound finishes
    setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    // Audio not available — fail silently, visual state still works
  }
}
