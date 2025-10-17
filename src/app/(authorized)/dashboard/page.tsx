"use client"
import { authorizedWrapperTitles, profile } from "@/utils/general";
import { nav4leftLinks, profileAtom } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import FirstLesson from "./components/FirstLesson";
import GamesHighlights from "./components/GamesHighlights";
// import MusicNotes from "./components/MusicNotes";
import "@/styles/primary-purple-scrollbar.css"
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";

export default function Page() {
    const [profile, setProfile] = useAtom(profileAtom);
    const [greeting, setGreeting] = useState('');

    const updateGreeting = () => {
        const currentHour = new Date().getHours();
        let newGreeting = '';

        if (currentHour >= 5 && currentHour < 12) {
            newGreeting = 'Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            newGreeting = 'Afternoon';
        } else {
            newGreeting = 'Evening';
        }

        setGreeting(newGreeting);
    };

    useEffect(() => {
        updateGreeting();
    })
    return (
        <AuthorizedWrapper2 pageTitle={authorizedWrapperTitles.Dashboard} openedLink={nav4leftLinks.dashboard}>
            <div className="relative flex h-[75vh] mt-[1.5%] overflow-y-auto z-[30] gap-[8%]">
                <div className="w-[60%]">
                    <h1 className="text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold montserrat">{greeting? `${greeting} ${profile.displayName}!`: ""}</h1>
                    <p className="text-3xl 3xl:text-4xl 4xl:text-5xl mt-[2%]">Check out the latest stuff we have ready for you.</p>
                    <FirstLesson />
                    <GamesHighlights />

                </div>

            </div>
        </AuthorizedWrapper2>
    )
}
