import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";

///////////////
////SIGN UP////
///////////////

export const signupStepAtom = atom<number>(1);

// Form Data Store (Full Name, Email, Scholarship Code, etc.)
export const signupFormDataAtom = atom({
    fullName: "",
    email: "",
    password: "",
    scholarshipCode: "",
    totalCost: "0.00",
    endDate: "September 25, 2026",
});

// Coupon verification status for step 3
export const couponVerifiedAtom = atom<boolean>(false);

// Membership
export const membershipChoiceAtom = atom<string>("");

export const membershipTypes = {
    "24-hours": "24-hours",
    "yearly-access": "yearly-access",
    "monthly-access": "monthly-access",
    "basic-access": "basic-access", // <-- Added key to resolve TS7053
    scholarship: "scholarship",
} as const;

export type MembershipType = typeof membershipTypes[keyof typeof membershipTypes];

// Forgot Password / Reset Password
export const forgotPasswordStepAtom = atom<number>(1);
export const resetPasswordStepAtom = atom<number>(1);

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
    pronouns: "",
});

export const lockoutUntilAtom = atomWithStorage<number | null>("lockout_until", null);
export const failedAttemptsAtom = atomWithStorage<number>("failed_attempts", 0);

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
export const highlightShopItemAtom = highlightBookAtom; // Alias for shop compatibility