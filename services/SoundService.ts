
// Web Audio API Context
const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

// Helper: Play a tone
const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0) => {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const SoundService = {
  playClick: () => {
    playTone(800, 'sine', 0.05);
  },

  playHover: () => {
    playTone(400, 'triangle', 0.02);
  },

  playSuccess: () => {
    const ctx = getContext();
    const now = ctx.currentTime;
    playTone(523.25, 'sine', 0.1, 0); // C5
    playTone(659.25, 'sine', 0.1, 0.1); // E5
    playTone(783.99, 'sine', 0.2, 0.2); // G5
  },

  playError: () => {
    const ctx = getContext();
    playTone(150, 'sawtooth', 0.2);
    playTone(100, 'sawtooth', 0.2, 0.1);
  },

  playCoin: () => {
    const ctx = getContext();
    playTone(1200, 'sine', 0.1);
    playTone(1600, 'sine', 0.3, 0.05);
  },

  playLevelUp: () => {
    const ctx = getContext();
    // Victory Fanfare
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        playTone(freq, 'square', 0.1, i * 0.08);
    });
    playTone(1046.50, 'square', 0.4, 0.32);
  }
};
