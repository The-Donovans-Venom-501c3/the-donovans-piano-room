"use client"
import { authorizedWrapperTitles, profile, settingsNavigation } from "@/utils/general";
import AccountForm from "./components/AccountForm"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { useState } from "react";
import AvatarSelectPopup from "./components/AvatarSelectPopup";
import Calender from "./components/Calender";
export default function Page() {

  const [avatar, setAvatar] = useState(profile.imageSrc)
  const [selectingAvatar, setSelectingAvatar] = useState(false)
  const closeSelectingAvatar = () => {
    setSelectingAvatar(false)
  }
  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings}>
      <AccountAndSettingsNav currentPage={settingsNavigation.profile}/>
        <div className="w-full h-[85%] mt-[1%]">
          <div className="flex w-full justify-between">
            <AccountForm />
            {selectingAvatar && <AvatarSelectPopup avatar={avatar} setAvatar={setAvatar} closeSelectingAvatar={closeSelectingAvatar} />}
            <Calender highlightedDays={['2024-07-30', '2024-07-03', '2024-07-04', '2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18']}/>
          </div>
        </div>
    </AuthorizedWrapper1>
  )
}
