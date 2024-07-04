"use client"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, profile, settingsNavigation } from "@/utils/general";
import { profileAtom } from "@/utils/stores";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import AllOrUnread from "./components/AllOrUnread";
import AllCatchUp from "./components/AllCatchUp";

export default function Page() {
    const setProfile = useSetAtom(profileAtom)
    useEffect(()=>{
        setProfile(profile)
    }, [])
  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings} openedLink="">
        <AccountAndSettingsNav currentPage={settingsNavigation.notification}/>
        <div className="w-[60%] h-[85%] mt-[1%]">
            <h2 className="text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]">Notifications</h2>
            <AllOrUnread/>
            <AllCatchUp />
        </div>
    </AuthorizedWrapper1>
  )
}
