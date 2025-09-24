"use client"
import { authorizedWrapperTitles, settingsNavigation } from "@/utils/general";
import { profileAtom } from "@/utils/stores";
import AccountForm from "./components/AccountForm"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { useState } from "react";
import AvatarSelectPopup from "./components/AvatarSelectPopup";
import Calender from "./components/Calender";
import { useAtomValue } from "jotai";
export default function Page() {
  const profile = useAtomValue(profileAtom)
  const [avatar, setAvatar] = useState(profile.picture)
  const [selectingAvatar, setSelectingAvatar] = useState(false)
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
