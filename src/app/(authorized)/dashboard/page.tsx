"use client"
import { authorizedWrapperTitles, profile } from "@/utils/general";
import { nav4leftLinks, profileAtom } from "@/utils/stores";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import FirstLesson from "./components/FirstLesson";
import GamesHighlights from "./components/GamesHighlights";
import MusicNotes from "./components/MusicNotes";
import "../../../styles/primary-purple-scrollbar.css"
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { getUser } from "@/lib/api/userService";

export default function Page() {
    const [profile, setProfile] = useAtom(profileAtom)
    const fetchUserData = async () =>{
        try{
            const {data, ok} = await getUser()
            if(ok){
                setProfile(data)
            }
        }catch(e){
            console.log(e)
        }
        
    }
     useEffect(() =>{
        fetchUserData()
     }, []) 
  return (
    <AuthorizedWrapper2 pageTitle={authorizedWrapperTitles.Dashboard} openedLink={nav4leftLinks.dashboard}>
        <div className="relative flex h-[75vh] mt-[1.5%] overflow-y-auto z-[30] gap-[8%]">
            <div className="w-[60%]">
                <h1 className="text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold montserrat">Morning {profile.displayName}!</h1>
                <p className="text-3xl 3xl:text-4xl 4xl:text-5xl mt-[2%]">Check out the latest stuff we have ready for you.</p>
                <FirstLesson/>
                <GamesHighlights/>
                
            </div>
            <div>
                <MusicNotes/>
            </div>
            
        </div>
    </AuthorizedWrapper2>
  )
}
