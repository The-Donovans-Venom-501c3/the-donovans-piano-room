import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";
import { notification } from "@/interfaces/notificationInterface";
import type {
  CompletedLevels,
  HighScores,
  PlayCounts,
  FastestTimes,
  ScoreSummary,
} from "@/app/games/types";

const dummyStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

const getSessionStorage = () =>
  typeof window !== "undefined" ? sessionStorage : dummyStorage;

const getLocalStorage = () =>
  typeof window !== "undefined" ? localStorage : dummyStorage;

///////////////
////SIGN UP////
///////////////

const INITIAL_SIGNUP_FORM_DATA = {
  fullName: "",
  email: "",
  scholarshipCode: "",
  totalCost: "0.00",
  endDate: "September 25, 2026",
};

export type SignupFormData = typeof INITIAL_SIGNUP_FORM_DATA;

export const signupStepAtom = atomWithStorage<number>(
  "signup_step",
  1,
  createJSONStorage<number>(getSessionStorage),
);

export const signupFormDataAtom = atomWithStorage<SignupFormData>(
  "signup_form_data",
  INITIAL_SIGNUP_FORM_DATA,
  createJSONStorage<SignupFormData>(getSessionStorage),
);

export const couponVerifiedAtom = atom<boolean>(false);

/** Clear every piece of persisted signup state in one place. */
export const resetSignupStateAtom = atom(null, (_get, set) => {
  set(signupStepAtom, 1);
  set(signupFormDataAtom, INITIAL_SIGNUP_FORM_DATA);
  set(membershipChoiceAtom, "");
  set(signupPaymentMethodAtom, null);
  set(couponVerifiedAtom, false);
});

export const membershipChoiceAtom = atomWithStorage<string>(
  "signup_membership_choice",
  "",
  createJSONStorage<string>(getSessionStorage),
);

// Masked payment-method summary captured during signup (step 4).
// TODO(backend/payments): once PSP tokenization is wired, store ONLY the
// returned vault token id here — never raw card data.
export interface SignupPaymentMethod {
  paymentMethodType: "card" | "paypal";
  cardholderName?: string;
  brand?: string;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  billingZip?: string;
  paypalEmail?: string;
  vaultTokenId?: string;
}

export const signupPaymentMethodAtom = atom<SignupPaymentMethod | null>(null);

export const membershipTypes = {
  "24-hours": "24-hours",
  "yearly-access": "yearly-access",
  "monthly-access": "monthly-access",
  "basic-access": "basic-access",
  scholarship: "scholarship",
} as const;

export type MembershipType =
  (typeof membershipTypes)[keyof typeof membershipTypes];

export const forgotPasswordStepAtom = atom<number>(1);
export const resetPasswordStepAtom = atom<number>(1);

//****************//
//***** SSR SAFE STORAGES *****//
//****************//

//****************//
//***** FORGOT PASSWORD *****//
//****************//

export const userEmailAtom = atomWithStorage<string>(
  "user_email",
  "",
  createJSONStorage<string>(getSessionStorage),
);

//****************//
//***** AUTH *****//
//****************//

export const profileAtom = atomWithStorage<profileInterface | null>(
  "profile",
  null,
  createJSONStorage<profileInterface | null>(getSessionStorage),
);

export const lockoutUntilAtom = atomWithStorage<number | null>(
  "lockout_until",
  null,
  createJSONStorage<number | null>(getSessionStorage),
);

export const failedAttemptsAtom = atomWithStorage<number>(
  "failed_attempts",
  0,
  createJSONStorage<number>(getSessionStorage),
);

//////////////
///// NAV ////
//////////////

export const isNavOpenAtom = atom<boolean>(true);

export const nav4leftLinks = {
  dashboard: "dashboard",
  lessons: "lessons",
  games: "games",
  musicTools: "music-tools",
  planner: "planner",
  contactUs: "contact-us",
  admin: "admin",
} as const;

export const hasUnreadAtom = atomWithStorage<boolean>(
  "user_has_unread_notifications",
  false,
);
export const showNotificationAtom = atom<boolean>(false);

//*************//
//**** SHOP ****//
//*************//

export const highlightBookAtom = atom<number>(2);
export const highlightShopItemAtom = highlightBookAtom;

//*******************//
//** NOTIFICATIONS **//
//*******************//

const safeLocalStorage = createJSONStorage<notification[]>(getLocalStorage, {
  reviver: (_key, value) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return value;
    }
    return value;
  },
});

export const notificationsAtom = atomWithStorage<notification[]>(
  "user_notifications_list_v3",
  [],
  safeLocalStorage,
  { getOnInit: true },
);

//************//
//** GAMES **//
//**********//

export const highScoresAtom = atomWithStorage<HighScores>(
  "tdpr_high_scores",
  {},
  createJSONStorage<HighScores>(getLocalStorage),
  { getOnInit: true },
);

export const completedLevelsAtom = atomWithStorage<CompletedLevels>(
  "tdpr_completed_levels",
  {},
  createJSONStorage<CompletedLevels>(getLocalStorage),
  { getOnInit: true },
);

export const playCountsAtom = atomWithStorage<PlayCounts>(
  "tdpr_play_counts",
  {},
  createJSONStorage<PlayCounts>(getLocalStorage),
  { getOnInit: true },
);

export const fastestTimesAtom = atomWithStorage<FastestTimes>(
  "tdpr_fastest_times",
  {},
  createJSONStorage<FastestTimes>(getLocalStorage),
  { getOnInit: true },
);

export const scoreSummaryAtom = atomWithStorage<ScoreSummary>(
  "tdpr_score_summary",
  { total: 0, count: 0 },
  createJSONStorage<ScoreSummary>(getLocalStorage),
  { getOnInit: true },
);
