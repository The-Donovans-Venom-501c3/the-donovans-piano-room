import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";

///////////////
////SIGN UP////
///////////////

export const signupStepAtom = atom<number>(1);

export const signupFormDataAtom = atom({
    fullName: "",
    email: "",
    password: "",
    scholarshipCode: "",
    totalCost: "0.00",
    endDate: "September 25, 2026",
});

export const couponVerifiedAtom = atom<boolean>(false);
export const membershipChoiceAtom = atom<string>("");

export const membershipTypes = {
    "24-hours": "24-hours",
    "yearly-access": "yearly-access",
    "monthly-access": "monthly-access",
    "basic-access": "basic-access",
    scholarship: "scholarship",
} as const;

export type MembershipType = typeof membershipTypes[keyof typeof membershipTypes];

export const forgotPasswordStepAtom = atom<number>(1);
export const resetPasswordStepAtom = atom<number>(1);

//****************//
//***** AUTH *****//
//****************//

export const profileAtom = atomWithStorage<profileInterface | null>(
    "profile",
    null,
    createJSONStorage(() => sessionStorage)
);

export const lockoutUntilAtom = atomWithStorage<number | null>(
    "lockout_until",
    null,
    createJSONStorage(() => sessionStorage)
);

export const failedAttemptsAtom = atomWithStorage<number>(
    "failed_attempts",
    0,
    createJSONStorage(() => sessionStorage)
);

//////////////
///// NAV ////
//////////////

export const isNavOpenAtom = atom<boolean>(false);

export const nav4leftLinks = {
    dashboard: "dashboard",
    lessons: "lessons",
    games: "games",
    musicTools: "music-tools",
    planner: "planner",
    contactUs: "contact-us",
} as const;

export const hasUnreadAtom = atom<boolean>(false);
export const showNotificationAtom = atom<boolean>(false);

//*************//
//**** SHOP ****//
//*************//

export const highlightBookAtom = atom<number>(2);
export const highlightShopItemAtom = highlightBookAtom;