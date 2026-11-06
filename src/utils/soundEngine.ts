const NOTE_FREQUENCIES: Record<string, number> = {
  C2: 65.41, "Db2": 69.30, D2: 73.42, "Eb2": 77.78, E2: 82.41, F2: 87.31, "Gb2": 92.50, G2: 98.00, "Ab2": 103.83, A2: 110.00, "Bb2": 116.54, B2: 123.47,
  C3: 130.81, "Db3": 138.59, D3: 146.83, "Eb3": 155.56, E3: 164.81, F3: 174.61, "Gb3": 185.00, G3: 196.00, "Ab3": 207.65, A3: 220.00, "Bb3": 233.08, B3: 246.94,
  C4: 261.63, "Db4": 277.18, D4: 293.66, "Eb4": 311.13, E4: 329.63, F4: 349.23, "Gb4": 369.99, G4: 392.00, "Ab4": 415.30, A4: 440.00, "Bb4": 466.16, B4: 493.88,
  C5: 523.25, "Db5": 554.37, D5: 587.33, "Eb5": 622.25, E5: 659.25, F5: 698.46, "Gb5": 739.99, G5: 783.99, "Ab5": 830.61, A5: 880.00, "Bb5": 932.33, B5: 987.77,
  C6: 1046.50, "Db6": 1108.73, D6: 1174.66, "Eb6": 1244.51, E6: 1318.51, F6: 1396.91, "Gb6": 1479.98, G6: 1567.98, "Ab6": 1661.22, A6: 1760.00, "Bb6": 1864.66, B6: 1975.53,
  C7: 2093.00, "Db7": 2217.46, D7: 2349.32, "Eb7": 2489.02, E7: 2637.02, F7: 2793.83, "Gb7": 2959.96, G7: 3135.96, "Ab7": 3322.44, A7: 3520.00, "Bb7": 3729.31, B7: 3951.07
};

let audioCtx: AudioContext | null = null;
const audioSampleCache: Record<string, AudioBuffer> = {};

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

// Loudness Compensation based on psychoacoustic Equal-Loudness curves
const getFrequencyLoudnessCompensation = (freq: number): number => {
  if (freq < 85) return 4.5;   // Octave 2 lower notes
  if (freq < 130) return 3.2;  // Octave 2 upper notes
  if (freq < 200) return 2.1;  // Octave 3 lower notes
  if (freq < 270) return 1.5;  // Octave 3 upper notes
  return 1.0;                  // Mid and high octaves remain balanced
};

export const playSynthesizedNote = async (
  note: string,
  instrument: string,
  volume: number
) => {
  if (volume <= 0) return;

  const ctx = getAudioContext();
  const freq = NOTE_FREQUENCIES[note];
  if (!freq) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();

  // Equalized Volume Base calculation
  const baseVolume = (volume / 100) * 0.35;
  const loudnessBoost = getFrequencyLoudnessCompensation(freq);
  const normalizedVolume = baseVolume * loudnessBoost;

  masterGain.connect(ctx.destination);

  // -------------------------------------------------------------
  // 1. ACOUSTIC PIANO (Sample Playback with Bass Sub-Oscillator)
  // -------------------------------------------------------------
  if (instrument.includes("Acoustic")) {
    try {
      const sampleUrl = "/sounds/Piano.wav";
      if (!audioSampleCache[sampleUrl]) {
        const res = await fetch(sampleUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          audioSampleCache[sampleUrl] = await ctx.decodeAudioData(buffer);
        }
      }

      if (audioSampleCache[sampleUrl]) {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        source.buffer = audioSampleCache[sampleUrl];

        // Pitch shift from A4 (440Hz)
        source.playbackRate.value = freq / 440;

        // Dynamic decay boost for low notes
        const decayTime = freq < 150 ? 3.5 : 2.5;

        gainNode.gain.setValueAtTime(normalizedVolume * 1.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

        // Low Bass Fundamental Reinforcement Node for low notes
        if (freq < 200) {
          const bassSub = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassSub.type = "sine";
          bassSub.frequency.setValueAtTime(freq, now);

          bassGain.gain.setValueAtTime(normalizedVolume * 0.8, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

          bassSub.connect(bassGain);
          bassGain.connect(masterGain);
          bassSub.start(now);
          bassSub.stop(now + 2.0);
        }

        source.connect(gainNode);
        gainNode.connect(masterGain);
        source.start(now);
        source.stop(now + decayTime);
        return;
      }
    } catch {
      // Fallback to synthesis if sample fails
    }

    // Acoustic Synthesis Fallback
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.max(freq * 5, 450), now);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(normalizedVolume * 1.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    gain1.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }
  // -------------------------------------------------------------
  // 2. ELECTRIC PIANO (Warmer Sub-bass Sine Carrier + FM Modulation)
  // -------------------------------------------------------------
  else if (instrument.includes("Electric")) {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const subOsc = ctx.createOscillator(); // Sub fundamental warmth for low notes

    const modGain = ctx.createGain();
    const envGain = ctx.createGain();
    const subGain = ctx.createGain();

    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, now);

    modulator.type = "sine";
    modulator.frequency.setValueAtTime(freq, now); // 1:1 ratio for warm electric bass tine

    // Keep FM modulation balanced so lower notes don't thin out
    modGain.gain.setValueAtTime(freq * 0.3, now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    modulator.connect(carrier.frequency);

    envGain.gain.setValueAtTime(normalizedVolume * 1.4, now);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    carrier.connect(envGain);
    envGain.connect(masterGain);

    // Dynamic fundamental sine body for low notes
    if (freq < 250) {
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(freq, now);
      subGain.gain.setValueAtTime(normalizedVolume * 0.9, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      subOsc.connect(subGain);
      subGain.connect(masterGain);

      subOsc.start(now);
      subOsc.stop(now + 2.5);
    }

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + 2.8);
    carrier.stop(now + 2.8);
  }
  // -------------------------------------------------------------
  // 3. SYNTH PIANO
  // -------------------------------------------------------------
  else {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "square";
    osc2.frequency.setValueAtTime(freq * 1.003, now);

    filter.type = "lowpass";
    filter.Q.setValueAtTime(3, now);
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3500, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(700, now + 1.8);

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.01, now);
    envGain.gain.linearRampToValueAtTime(normalizedVolume * 0.8, now + 0.04);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(envGain);
    envGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.2);
    osc2.stop(now + 2.2);
  }
};