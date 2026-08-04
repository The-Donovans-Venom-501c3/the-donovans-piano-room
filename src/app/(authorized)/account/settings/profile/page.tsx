"use client"
import { authorizedWrapperTitles, settingsNavigation } from "@/utils/general";
import { profileAtom } from "@/utils/stores";
import AccountForm from "./components/AccountForm"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { useState, useEffect } from "react";
import AvatarSelectPopup from "./components/AvatarSelectPopup";
import Calender from "./components/Calender";
import { useAtomValue } from "jotai";

export default function Page() {
  const profile = useAtomValue(profileAtom)
  
  // Safely fallback to default image if profile or profile.picture is null/undefined
  const [avatar, setAvatar] = useState(
    profile?.picture || "/profile/Settings/Avatar default.svg"
  )
  const [selectingAvatar, setSelectingAvatar] = useState(false)

  // Sync avatar state once profileAtom finishes loading/updating asynchronously
  useEffect(() => {
    if (profile?.picture) {
      setAvatar(profile.picture)
    }
  }, [profile?.picture])

  const closeSelectingAvatar = () => {
    setSelectingAvatar(false)
  }

  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings}>
      <div className="h-[80.8vh] overflow-y-auto">
        <AccountAndSettingsNav currentPage={settingsNavigation.profile}/>
        <div className="w-full mt-[1%]">
          <div className="flex w-full justify-between">
            <AccountForm />
            {/* {selectingAvatar && <AvatarSelectPopup avatar={avatar} setAvatar={setAvatar} closeSelectingAvatar={closeSelectingAvatar} />} */}
            <Calender highlightedDays={['2024-07-30', '2024-07-03', '2024-07-04', '2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18']}/>
          </div>
        </div>
      </div>
    </AuthorizedWrapper1>
  )
}