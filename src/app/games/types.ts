export type GameType =
  | "major-minor"
  | "key"
  | "note"
  | "scale"
  | "chord"
  | "ledger"
  | "interval"
  | "reading"
  | "math";

export type SelectGameHandler = (gameKey: GameType, title: string) => void;

export type Level = "easy" | "medium" | "hard";

export interface Question {
  questionImage: string;
  correctOption: string;
  sentence?: string;
  // Optional fields for custom game questions
  title?: string;
  questionText?: string;
  options?: string[];
  notePosition?: string | number;
  answer?: string;
}

export type OptionClickHandler = (option: string) => void;

export type HighScore = {
  score: number;
  timeSeconds: number; // How long the run took. Tiebreaker: since the score caps at 100, two perfect runs are separated by speed.
  date: string;
};

export type LevelKey = `${GameType}:${Level}`;

export type HighScores = Partial<Record<LevelKey, HighScore>>;

// true once the level has been finished without running out of lives
export type CompletedLevels = Partial<Record<LevelKey, true>>;

// How many times each game has been played to the end
export type PlayCounts = Partial<Record<GameType, number>>;

// The fastest finish (in seconds) for each level, counting only games finished with lives left
export type FastestTimes = Partial<Record<LevelKey, number>>;

// Every finished game's score added up, and how many games that is,
// so the average is total / count
export type ScoreSummary = { total: number; count: number };