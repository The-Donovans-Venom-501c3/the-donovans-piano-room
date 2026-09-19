import { atom } from "jotai";
import type { GameType, Level } from "../app/games/types";

export const livesAtom = atom(3);
export const scoreAtom = atom(0);
export const musicStateAtom = atom(true);

export const levelStateAtom = atom<Level>("easy");
export const levelAtom = levelStateAtom; // Alias for backward compatibility

export const timerOnAtom = atom(false);
export const resetTimerAtom = atom(0);
export const seconds = atom(0);
export const countDownOnAtom = atom(false);
export const questionAtom = atom(1);
export const totalQuestionsAtom = atom(0);
export const correctOptionAtom = atom("");
export const currentCorrectOptionAtom = atom("");
export const hasAnsweredWrongAtom = atom(false);
export const affirmationAtom = atom<"success" | "tryAgain" | "fail" | "">("");
export const quizStateAtom = atom<"quiz" | "affirmation" | "overlay" | "popup" | "rules">("quiz");

export const appStateAtom = atom<"home" | "welcome" | "loading" | "quiz" | "game-finished">("home");

export const gameStateAtom = atom<GameType>("note");
export const loadingStateAtom = atom<"loading" | "loaded">("loaded");
export const overlayAtom = atom<"exit" | "lives" | "restart">("exit");
export const popupAtom = atom<"play" | "pause">("play");
export const gameFinishedAtom = atom<"score" | "end-game">("score");