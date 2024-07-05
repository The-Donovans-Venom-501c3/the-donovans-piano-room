import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav"

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

/*************/
/***Profile***/
/*************/

export const profile = { // to be removed after BE Integration
    fullName: "Jack Stuart",
    imageSrc: "/ToBeRemoved/avatar/1.svg",
    pronouns: "He/Him/His",
    email: "jacks@email.com",
    birthDate: "2000-12-24",
    phoneNumber: "1-234-567-8910"
}

export const pronouns = [
    "She/Her/Hers",
    "He/Him/His",
    "They/Them/Theirs"
]

export const authorizedWrapperTitles = {
    AccountAndSettings: "Account & Settings",
    Dashboard: "Dashboard"
}


/*******************/
/***Notifications***/
/*******************/

export function beenTimeAgo(date: Date): {timeAgo: string, underADay: boolean} {
    const then = date.getTime();
    const now = new Date().getTime();
    const seconds = Math.floor((now - then) / 1000);
  
    const units: [string, number][] = [
      ['year', 31536000],
      ['month', 2592000],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1],
    ];
  
    for (const [unit, value] of units) {
      if (seconds >= value) {
        const interval = Math.floor(seconds / value);
        const suffix = interval === 1 ? '' : 's';
        return {timeAgo: `${interval} ${unit}${suffix} ago`, underADay: value <= 3600 ? true : false};
      }
    }
    return {timeAgo: 'just now', underADay: true};
  }

export const dummyNoticationsData = [
    {
        title: "9.0.1 new version launched",
        description: "Version 9.0.1 has launched, featuring enhanced stability, improved features, and critical bug fixes. Upgrade now for a smoother, more efficient user experience.",
        actionTitle: "Update",
        date: new Date('07-05-2024-12:10'),
        unread: true,
        imageSrc: "/ToBeRemoved/notification-icons/upgrade.svg"
    },
    {
        title: "Renew your annual program",
        description: "Renew your annual program today to continue enjoying all the benefits and features. Don't miss out on the latest updates and exclusive member services for another year!",
        actionTitle: "Renew",
        date: new Date('07-05-2024-10:00'),
        unread: false,
        imageSrc: "/ToBeRemoved/notification-icons/program.svg"
    },
    {
        title: "Upload your profile photo",
        description: "Upload your profile photo to personalize your account and enhance your visibility. A current photo helps others recognize and connect with you more effectively!",
        actionTitle: "Go to account",
        date: new Date('07-03-2024-10:00'),
        unread: true,
        imageSrc: "/ToBeRemoved/notification-icons/profile.svg"
    }
]