export const aboutNavigationPages = {
    whyChooseUs: "why-choose-us",
    whoWeServe: "who-we-serve",
    membership: "membership",
    scholarship: "scholarship",
    FAQs: "faqs" 
}

export const navigationPages = {
    home: "home",
    about: "about",
    games: "games",
    bookstore: "bookstore",
    contact: "contact",
}

export const aboutScholarshipNavigation = {
    whatsIncluded: "what's included",
    whosEligible: "who's eligible"
}

export const settingsNavigation = {
    profile: "Profile",
    membership: "Membership",
    paymentMethods: "PaymentMethods",
    notification: "Notification",
    timeSpent: "TimeSpent"
}


export const testPassword = (password: string) =>{
    const lowerCase = /[a-z]/.test(password)
    const upperCase = /[A-Z]/.test(password)
    const numberCase = /[0-9]/.test(password)
    const symbolCase = /[!@#$%^&*()\[_\]+={}.'"~²`%¨)°:,?§/-]/.test(password)
    return {correctLength: password.length >= 12, lowerCase, upperCase, numberCase, symbolCase}
}

export const profile = { // to be removed after BE Integration
    fullName: "Jack Stuart",
    imageSrc: "/ToBeRemoved/avatar/1.svg",
    pronouns: "Hi/Him/His"
}