import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import { backendBookInterface, bookInterface } from "@/interfaces/bookInterface";

export const aboutNavigationPages = {
    whyChooseUs: "why-choose-us",
    whoWeServe: "who-we-serve",
    membership: "membership",
    scholarship: "scholarship",
    FAQs: "faqs",
};

export const navigationPages = {
    home: "home",
    about: "about",
    games: "games",
    shop: "shop",
    contact: "contact",
    cart: "cart",
};

export const aboutScholarshipNavigation = {
    whatsIncluded: "what's included",
    whosEligible: "who's eligible",
};

export const settingsNavigation = {
    profile: "Profile",
    membership: "Membership",
    paymentMethods: "PaymentMethods",
    notification: "Notification",
    timeSpent: "TimeSpent",
};

export const testPassword = (password: string) => {
    const lowerCase = /[a-z]/.test(password);
    const upperCase = /[A-Z]/.test(password);
    const numberCase = /[0-9]/.test(password);
    const symbolCase = /[!@#$%^&*()\[_\]+={}.'"~²`%¨)°:,?§/-]/.test(password);
    return { correctLength: password.length >= 12, lowerCase, upperCase, numberCase, symbolCase };
};

/*************/
/***Profile***/
/*************/

export const profile = {
    fullName: "Jack Stuart",
    imageSrc: "/ToBeRemoved/avatar/1.svg",
    pronouns: "He/Him/His",
    email: "jacks@email.com",
    birthDate: "2000-12-24",
    phoneNumber: "1-234-567-8910",
};

export const pronouns = [
    "She/Her/Hers",
    "He/Him/His",
    "They/Them/Theirs",
];

export const authorizedWrapperTitles = {
    AccountAndSettings: "Account & Settings",
    Lessons: "Lessons",
    Dashboard: "Dashboard",
};

/*******************/
/***Notifications***/
/*******************/

export function beenTimeAgo(date: Date | string): { timeAgo: string; underADay: boolean } {
    const validDate = typeof date === "string" ? new Date(date) : date;
    const then = validDate.getTime();
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
            return {
                timeAgo: `${interval} ${unit}${suffix} ago`,
                underADay: seconds < 86400,
            };
        }
    }
    return { timeAgo: 'just now', underADay: true };
}

export const mapBackendToFrontend = (backendBook: backendBookInterface): bookInterface => {
    return {
        id: backendBook.id,
        title: backendBook.title,
        color: backendBook.color,
        imageSrc: backendBook.picture,
        coverImageSrc: backendBook.picture2,
        titleColor: backendBook.tdprColor,
        type: backendBook.comments,
        price: backendBook.price,
        description: backendBook.intro,
    };
};