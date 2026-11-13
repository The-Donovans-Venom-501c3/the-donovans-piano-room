// TRACKS array matching exact audio filenames while displaying full title with artist credit
export const TRACKS = [
  {
    title: "Fantasie Impromptu by The Donovan",
    file: "Fantasie Impromptu.wav",
  },
  {
    title: "Gymnopédie by The Donovan",
    file: "Gymno.wav",
  },
  {
    title: "Moonlight Sonata by The Donovan",
    file: "Moonlight Sonata.wav",
  },
  {
    title: "Nocturne Op. 37, No. 2 in G Minor by The Donovan",
    file: "Nocturne Op. 37, No. 2 in G Minor.wav",
  },
  {
    title: "Posthumous Nocturne by The Donovan",
    file: "Posthumous Nocturne.wav",
  },
  {
    title: "Pour le Piano by The Donovan",
    file: "Pourle Piano.wav",
  },
  {
    title: "Prelude in C# minor by The Donovan",
    file: "Prelude in C# minor.wav",
  },
  {
    title: "The Seasons Op. 37a August (Harvest) by The Donovan",
    file: "The Seasons Op. 37a August (Harvest) copy.wav",
  },
];

// Encodes spaces and "#" (e.g. "Prelude in C# minor"), which would otherwise end the path
export const trackUrl = (file: string) => `/audio/${encodeURIComponent(file)}`;
