import chordData from "../data/chord.json";
import intervalData from "../data/intervalIdentification.json";
import keySignatureData from "../data/keySignatureIdentification.json";
import ledgerData from "../data/ledgerLineAddition.json";
import majorMinorData from "../data/majorMinorIdentification.json";
import readingData from "../data/musicIsReading.json";
import noteData from "../data/noteIdentification.json";
import scaleData from "../data/scaleIdentification.json";

import type { GameType, Level, Question } from "../types";

export const normalizeGameKey = (rawGame: string): GameType => {
  if (!rawGame) return "reading";
  // Strip spaces, dashes, and underscores
  const clean = rawGame.trim().toLowerCase().replace(/[\s-_]/g, "");

  if (clean.includes("key")) return "key";
  if (clean.includes("majorminor")) return "major-minor";
  if (clean.includes("note")) return "note";
  if (clean.includes("scale")) return "scale";
  if (clean.includes("chord")) return "chord";
  if (clean.includes("ledger")) return "ledger";
  if (clean.includes("interval")) return "interval";
  if (clean.includes("reading")) return "reading";

  return (rawGame as GameType) || "reading";
};

// Every Unicode code point that could plausibly appear as a "flat" or
// "sharp" symbol, whether typed directly, pasted from a design tool, or
// copied from a rich-text editor.
const FLAT_CHARS = /[\u266D\u1D12B\uFE53\uFF0D\u02D3]/g; // ♭ and lookalikes
const SHARP_CHARS = /[\u266F\u1D12A\uFF03]/g; // ♯ and lookalikes

export const normalizeOptionString = (val?: string): string =>
  (val ?? "")
    .normalize("NFKC")
    .replace(FLAT_CHARS, "b")
    .replace(SHARP_CHARS, "#")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

interface RawLevelData {
  level: string;
  numberOfQuestions?: Record<string, number>;
  questions: Question[];
}

interface RawGameData {
  name: string;
  levels: RawLevelData[];
}

const gameDataMap: Record<GameType, RawGameData> = {
  chord: chordData as unknown as RawGameData,
  interval: intervalData as unknown as RawGameData,
  key: keySignatureData as unknown as RawGameData,
  ledger: ledgerData as unknown as RawGameData,
  "major-minor": majorMinorData as unknown as RawGameData,
  reading: readingData as unknown as RawGameData,
  note: noteData as unknown as RawGameData,
  scale: scaleData as unknown as RawGameData,
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestions(rawGame: string, level: Level): Question[] {
  const game = normalizeGameKey(rawGame);
  const gameData = gameDataMap[game];
  if (!gameData || !gameData.levels) return [];

  const levelConfig = gameData.levels.find(
    (l) => l.level.toLowerCase() === level.toLowerCase()
  );

  if (!levelConfig) return [];

  const levelMap = new Map<string, RawLevelData>();
  gameData.levels.forEach((l) => levelMap.set(l.level.toLowerCase(), l));

  const selectedQuestions: Question[] = [];
  const rules: Record<string, number> = levelConfig.numberOfQuestions || {};

  Object.entries(rules).forEach(([diffKey, count]) => {
    const targetPool = levelMap.get(diffKey.toLowerCase());
    if (targetPool && targetPool.questions && count > 0) {
      const randomized = shuffleArray(targetPool.questions);
      selectedQuestions.push(...randomized.slice(0, count));
    }
  });

  if (selectedQuestions.length === 0 && levelConfig.questions) {
    return shuffleArray(levelConfig.questions);
  }

  return shuffleArray(selectedQuestions);
}