import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";
import { notification } from "@/interfaces/notificationInterface";
import { dummyNoticationsData } from "@/utils/general";

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
//***** SSR SAFE STORAGES *****//
//****************//

const dummyStorage: Storage = {
    length: 0,
    clear: () => {},
    getItem: () => null,
    key: () => null,
    removeItem: () => {},
    setItem: () => {},
};

const getSessionStorage = () => (typeof window !== "undefined" ? sessionStorage : dummyStorage);
const getLocalStorage = () => (typeof window !== "undefined" ? localStorage : dummyStorage);

//****************//
//***** AUTH *****//
//****************//

export const profileAtom = atomWithStorage<profileInterface | null>(
    "profile",
    null,
    createJSONStorage<profileInterface | null>(getSessionStorage)
);

export const lockoutUntilAtom = atomWithStorage<number | null>(
    "lockout_until",
    null,
    createJSONStorage<number | null>(getSessionStorage)
);

export const failedAttemptsAtom = atomWithStorage<number>(
    "failed_attempts",
    0,
    createJSONStorage<number>(getSessionStorage)
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

//*******************//
//** NOTIFICATIONS **//
//*******************//

const safeLocalStorage = createJSONStorage<notification[]>(
    getLocalStorage,
    {
        reviver: (_key, value) => {
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                return new Date(value);
            }
            return value;
        },
    }
);

export const notificationsAtom = atomWithStorage<notification[]>(
    "user_notifications_list",
    dummyNoticationsData,
    safeLocalStorage,
    { getOnInit: true }
);