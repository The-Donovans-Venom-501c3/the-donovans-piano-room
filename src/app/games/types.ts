export type GameType =
  | "major-minor"
  | "key"
  | "note"
  | "scale"
  | "chord"
  | "ledger"
  | "interval"
  | "reading";

export type Level = "easy" | "medium" | "hard";

export interface Question {
  questionImage: string;
  correctOption: string;
  sentence: string;
}

export type OptionClickHandler = (option: string) => void;
