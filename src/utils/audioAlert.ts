/**
 * ARK Holographic Tek Sound & Notification System
 * Uses Web Audio API to synthesize authentic sci-fi alarm beeps
 * without relying on external mp3 assets that could fail.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTekAlarmSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Play a sequence of 3 rapid futuristic high-pitch TEK chirps
    const notes = [880, 1174.66, 1760, 2349.32]; // A5, D6, A6, D7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Fast attack, exponential decay
      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.15);
    });

    // Secondary pulse for urgent alarm feel
    setTimeout(() => {
      const ctx2 = getAudioContext();
      if (!ctx2) return;
      const t2 = ctx2.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx2.createOscillator();
        const gain = ctx2.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.2, t2 + idx * 0.08);
        gain.gain.setValueAtTime(0.3, t2 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t2 + idx * 0.08 + 0.14);
        osc.connect(gain);
        gain.connect(ctx2.destination);
        osc.start(t2 + idx * 0.08);
        osc.stop(t2 + idx * 0.08 + 0.16);
      });
    }, 400);

  } catch (err) {
    console.warn('Audio play warning:', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
}

export function sendBrowserNotification(title: string, body: string): void {
  if (typeof window === 'undefined') return;

  // Always play synthesized sound
  playTekAlarmSound();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'ark-timer-alert'
      });
    } catch (e) {
      console.warn('Notification error:', e);
    }
  }
}
