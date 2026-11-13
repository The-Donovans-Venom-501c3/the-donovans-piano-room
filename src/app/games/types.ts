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
  sentence?: string;
  // Optional fields for custom game questions
  title?: string;
  questionText?: string;
  options?: string[];
  notePosition?: string | number;
  answer?: string;
}

export type OptionClickHandler = (option: string) => void;