import type { GameType, Level, Question } from "../types";

const questions: Record<GameType, Question> = {
  note: { questionImage: "/games/NoteQuestionGraph.svg", correctOption: "C", sentence: "_" },
  key: { questionImage: "/games/NoteQuestionGraph.svg", correctOption: "C#", sentence: "_" },
  "major-minor": {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "Major",
    sentence: "_",
  },
  scale: {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "C Major",
    sentence: "_",
  },
  interval: {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "M2",
    sentence: "_",
  },
  chord: {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "C Major",
    sentence: "_",
  },
  ledger: {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "C",
    sentence: "_",
  },
  reading: {
    questionImage: "/games/NoteQuestionGraph.svg",
    correctOption: "c,a,t",
    sentence: "_ _ _",
  },
};

export function getQuestions(game: GameType, _level: Level): Question[] {
  return [questions[game]];
}
