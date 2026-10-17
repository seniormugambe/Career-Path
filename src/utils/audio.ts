/**
 * Web Audio API helper to generate subtle acoustic sonar radar pings
 */

let audioCtx: AudioContext | null = null;

export function playSonarPing(frequency: number = 960, duration: number = 0.22, volume: number = 0.08) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.75, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Gracefully ignore audio autoplay restrictions or uninitialized contexts
  }
}

export function playBlipDetected() {
  playSonarPing(1280, 0.18, 0.06);
}

export function playBlipHover() {
  playSonarPing(1440, 0.08, 0.04);
}
