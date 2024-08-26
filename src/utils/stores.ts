import {bookCartItemInterface, bookInterface} from "../interfaces/bookInterface";
import { atom } from "jotai";
import { membershipInterface } from "./interfaces/membership";




///////////////
////SIGN UP////
///////////////
export const singupStepAtom = atom(1)
export const emailAtom = atom("")

//Membership//
export const membershipChoiceAtom = atom<membershipInterface | null>(null)

//forgot-password//
export const forgotPasswordStepAtom = atom(1);

//reset-password//
export const resetPasswordStepAtom = atom(1)


//****************//
//*****Auth*******//
//****************//

export const profileAtom = atom({
    fullName: "",
    imageSrc: "",
    pronouns: "",
    email: "",
    birthDate: "",
    phoneNumber: ""
})

//////////////
/////NAV//////
//////////////

export const IsNavOpenAtom = atom(false)

export const nav4leftLinks = {
    dashboard: "dashboard",
    lessons: "lessons",
    games: "games",
    musicTools: "music-tools",
    planner: "planner",
    contactUs: "contact-us"
}

export const hasUnreadAtom = atom(false)

export const showNotificationAtom = atom(false)

//*************//
//**bookstore**//
//*************//

export const addedCartItemAtom = atom<null | bookInterface>(null) 


export const addedCartItemsAtom = atom<bookCartItemInterface[]>([]);

export const frequentlyPurchasedTogetherBooksAtom = atom<bookInterface[]>([])
