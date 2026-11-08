// Web Audio API context singleton
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
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a subtle soft wooden bead click sound
 */
export function playBeadSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle soft click tone
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.debug('Audio not allowed yet or error:', e);
  }
}

/**
 * Play completion bell chime (when hitting 33 or finishing a dua card)
 */
export function playMilestoneSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.debug('Milestone audio error:', e);
  }
}

/**
 * Trigger subtle haptic pulse
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light', enabled = true) {
  if (!enabled || typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    if (type === 'light') {
      navigator.vibrate(18);
    } else if (type === 'medium') {
      navigator.vibrate(45);
    } else if (type === 'heavy') {
      // Distinct double buzz on 33 count or card completion
      navigator.vibrate([60, 40, 90]);
    }
  } catch {
    // Ignore if vibration disallowed by browser permission
  }
}

/**
 * Arabic Text-to-Speech using Web Speech API
 */
export function speakArabic(text: string, onEnd?: () => void, onError?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.();
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip diacritics / markers slightly if needed for better TTS clarity
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.88; // Calm, respectful recitation speed
  utterance.pitch = 1.0;

  // Attempt to select an Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('ar-'));
  if (arVoice) {
    utterance.voice = arVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onError?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopArabicSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
