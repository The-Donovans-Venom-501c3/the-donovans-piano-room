import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";

///////////////
////SIGN UP////
///////////////

export const signupStepAtom = atom(1);

// Membership
export const membershipChoiceAtom = atom("");

export const membershipTypes = {
    "24-hours": "24-hours",
    "yearly-access": "yearly-access",
    "monthly-access": "monthly-access",
    scholarship: "scholarship"
} as const;

// Forgot Password / Reset Password
export const forgotPasswordStepAtom = atom(1);
export const resetPasswordStepAtom = atom(1);

//****************//
//***** AUTH *****//
//****************//

export const profileAtom = atomWithStorage<profileInterface>("profile", {
    id: "",
    fullName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    picture: "",
    DOB: "",
    pronouns: ""
});

// Stores lockout timestamp to persist the 15-minute timer across page refreshes
export const lockoutUntilAtom = atomWithStorage<number | null>("lockout_until", null);

// Stores failed attempts counter across page refreshes
export const failedAttemptsAtom = atomWithStorage<number>("failed_attempts", 0);

//////////////
///// NAV ////
//////////////

export const isNavOpenAtom = atom(false);

export const nav4leftLinks = {
    dashboard: "dashboard",
    lessons: "lessons",
    games: "games",
    musicTools: "music-tools",
    planner: "planner",
    contactUs: "contact-us"
} as const;

export const hasUnreadAtom = atom(false);
export const showNotificationAtom = atom(false);

//*************//
//**BOOKSTORE**//
//*************//

export const highlightBookAtom = atom(2);