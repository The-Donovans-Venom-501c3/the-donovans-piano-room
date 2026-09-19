import chordData from "../data/chord.json";
import intervalData from "../data/intervalIdentification.json";
import keySignatureData from "../data/keySignatureIdentification.json";
import ledgerData from "../data/ledgerLineAddition.json";
import majorMinorData from "../data/majorMinorIdentification.json";
import readingData from "../data/musicIsReading.json";
import noteData from "../data/noteIdentification.json";
import scaleData from "../data/scaleIdentification.json";

import type { GameType, Level, Question } from "../types";

// Type definitions for raw JSON file structures
interface RawLevelData {
  level: string;
  numberOfQuestions?: Record<string, number>;
  questions: Question[];
}

interface RawGameData {
  name: string;
  levels: RawLevelData[];
}

// Map GameType strings to imported JSON files cast to RawGameData
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

// Generic Fisher-Yates array shuffling algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestions(game: GameType, level: Level): Question[] {
  const gameData = gameDataMap[game];
  if (!gameData || !gameData.levels) return [];

  // Find configuration matching selected level (case-insensitive)
  const levelConfig = gameData.levels.find(
    (l) => l.level.toLowerCase() === level.toLowerCase()
  );

  if (!levelConfig) return [];

  // Map levels for cross-level question lookup (e.g. Medium pulling from Easy pool)
  const levelMap = new Map<string, RawLevelData>();
  gameData.levels.forEach((l) => levelMap.set(l.level.toLowerCase(), l));

  const selectedQuestions: Question[] = [];
  const rules: Record<string, number> = levelConfig.numberOfQuestions || {};

  // Gather required question counts per difficulty key
  Object.entries(rules).forEach(([diffKey, count]) => {
    const targetPool = levelMap.get(diffKey.toLowerCase());
    if (targetPool && targetPool.questions && count > 0) {
      const randomized = shuffleArray(targetPool.questions);
      selectedQuestions.push(...randomized.slice(0, count));
    }
  });

  // Fallback: If no rules are defined, return all questions for the level
  if (selectedQuestions.length === 0 && levelConfig.questions) {
    return shuffleArray(levelConfig.questions);
  }

  return shuffleArray(selectedQuestions);
}