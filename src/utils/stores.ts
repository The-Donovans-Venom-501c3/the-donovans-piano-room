import { atom } from "jotai";

///////////////
////SIGN UP////
///////////////
export const singupStepAtom = atom(1)
//Membership//
export const membershipChoiceAtom = atom("")

export const membershipTypes = {
    "24-hours": "24-hours",
    "yearly-access": "yearly-access",
    "monthly-access": "monthly-access",
    "scholarship": "scholarship"
}

//forgot-password//
export const forgotPasswordStepAtom = atom(1);


//////////////
/////NAV//////
//////////////

export const IsNavOpenAtom = atom(false) 