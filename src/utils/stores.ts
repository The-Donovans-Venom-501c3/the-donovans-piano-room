import {
  bookCartItemInterface,
  bookInterface,
} from "../interfaces/bookInterface";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { profileInterface } from "@/interfaces/profileInterface";

///////////////
////SIGN UP////
///////////////
export const singupStepAtom = atom(3);
//Membership//
export type MembershipType =
  | "24-hours"
  | "yearly-access"
  | "monthly-access"
  | "scholarship"
  | "basic"
  | null;
export const membershipChoiceAtom = atom<MembershipType>(null);

export type membershipTypes = {
  "24-hours": "24-hours";
  "yearly-access": "yearly-access";
  "monthly-access": "monthly-access";
  scholarship: "scholarship";
  baisc: "basic";
};

//forgot-password//
export const forgotPasswordStepAtom = atom(1);

//reset-password//
export const resetPasswordStepAtom = atom(1);

//****************//
//*****Auth*******//
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

//////////////
/////NAV//////
//////////////

export const IsNavOpenAtom = atom(false);

export const nav4leftLinks = {
  dashboard: "dashboard",
  lessons: "lessons",
  games: "games",
  musicTools: "music-tools",
  planner: "planner",
  contactUs: "contact-us",
};

export const hasUnreadAtom = atom(false);

export const showNotificationAtom = atom(false);

//*************//
//**bookstore**//
//*************//

export const highlightBookAtom = atom(2);

//*************//
//**Guest_User**//
//*************//

export const guestUser = atom(false);

export const modalShow = atom(false);
