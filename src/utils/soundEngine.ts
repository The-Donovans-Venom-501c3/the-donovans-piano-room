const NOTE_FREQUENCIES: Record<string, number> = {
  C2: 65.41, "Db2": 69.30, D2: 73.42, "Eb2": 77.78, E2: 82.41, F2: 87.31, "Gb2": 92.50, G2: 98.00, "Ab2": 103.83, A2: 110.00, "Bb2": 116.54, B2: 123.47,
  C3: 130.81, "Db3": 138.59, D3: 146.83, "Eb3": 155.56, E3: 164.81, F3: 174.61, "Gb3": 185.00, G3: 196.00, "Ab3": 207.65, A3: 220.00, "Bb3": 233.08, B3: 246.94,
  C4: 261.63, "Db4": 277.18, D4: 293.66, "Eb4": 311.13, E4: 329.63, F4: 349.23, "Gb4": 369.99, G4: 392.00, "Ab4": 415.30, A4: 440.00, "Bb4": 466.16, B4: 493.88,
  C5: 523.25, "Db5": 554.37, D5: 587.33, "Eb5": 622.25, E5: 659.25, F5: 698.46, "Gb5": 739.99, G5: 783.99, "Ab5": 830.61, A5: 880.00, "Bb5": 932.33, B5: 987.77,
  C6: 1046.50, "Db6": 1108.73, D6: 1174.66, "Eb6": 1244.51, E6: 1318.51, F6: 1396.91, "Gb6": 1479.98, G6: 1567.98, "Ab6": 1661.22, A6: 1760.00, "Bb6": 1864.66, B6: 1975.53,
  C7: 2093.00, "Db7": 2217.46, D7: 2349.32, "Eb7": 2489.02, E7: 2637.02, F7: 2793.83, "Gb7": 2959.96, G7: 3135.96, "Ab7": 3322.44, A7: 3520.00, "Bb7": 3729.31, B7: 3951.07
};

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSynthesizedNote = (note: string, instrument: string, volume: number) => {
  if (volume <= 0) return;

  const ctx = getAudioContext();
  const freq = NOTE_FREQUENCIES[note];
  if (!freq) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  const normalizedVolume = (volume / 100) * 0.4;

  masterGain.connect(ctx.destination);

  // 1. ACOUSTIC PIANO: Multi-harmonic strike with exponential dampening lowpass filter
  if (instrument.includes("Acoustic")) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 1.2);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(normalizedVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(normalizedVolume * 0.3, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    gain1.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.8);
    osc2.stop(now + 1.8);
  } 
  // 2. ELECTRIC PIANO: Warm Rhodes-style FM synthesis
  else if (instrument.includes("Electric")) {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();

    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, now);

    modulator.type = "sine";
    modulator.frequency.setValueAtTime(freq * 14, now);

    modGain.gain.setValueAtTime(freq * 0.5, now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    modulator.connect(carrier.frequency);

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(normalizedVolume * 0.9, now);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    carrier.connect(envGain);
    envGain.connect(masterGain);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + 2.2);
    carrier.stop(now + 2.2);
  } 
  // 3. SYNTH: Resonant saw/square pad with filter sweep
  else {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "square";
    osc2.frequency.setValueAtTime(freq * 1.003, now);

    filter.type = "lowpass";
    filter.Q.setValueAtTime(4, now);
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.01, now);
    envGain.gain.linearRampToValueAtTime(normalizedVolume * 0.6, now + 0.04);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(envGain);
    envGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  }
};