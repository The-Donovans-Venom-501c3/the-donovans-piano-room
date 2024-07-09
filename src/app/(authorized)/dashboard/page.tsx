"use client"
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, profile } from "@/utils/general";
import { nav4leftLinks, profileAtom } from "@/utils/stores";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import FirstLesson from "./components/FirstLesson";
import GamesInProgress from "./components/GamesInProgress";
import MusicNotes from "./components/MusicNotes";

import "./page.css"

export default function Page() {
    const setProfile = useSetAtom(profileAtom)
    const [displayName, setDisplayName] = useState('')
    useEffect(()=>{
        setProfile(profile)
        const name = profile.fullName.split(" ")[0]
        setDisplayName(name)
    })
  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.Dashboard} openedLink={nav4leftLinks.dashboard}>
        <div className="relative flex h-[75vh] mt-[1.5%] overflow-y-auto z-[30]">
            <div className="w-[60%]">
                    <h1 className="text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold">Hello {displayName}!</h1>
                    <p className="text-3xl 3xl:text-4xl 4xl:text-5xl mt-[2%]">Check out the latest stuff we have ready for you.</p>
                    <FirstLesson/>
                    <GamesInProgress/>
            </div>
            <div>
                <MusicNotes/>
            </div>
        </div>
    </AuthorizedWrapper1>
  )
}
