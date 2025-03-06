import React from "react";
import Footer4 from "../../footers/Footer4";
import Navbar4Left from "../../navbars/Navbar4Left";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { profileAtom, showNotificationAtom } from "@/utils/stores";
import NotificationPopup from "@/components/atoms/NotificationPopup";

export default function AuthorizedWrapper1({children, pageTitle, openedLink=""}: {children: React.ReactNode, pageTitle: string, openedLink?: string}) {
  const profile = useAtomValue(profileAtom)
  const showNotification = useAtomValue(showNotificationAtom)
  return (
    <div className="flex bg-[#FFEBD5]">
      {showNotification && <NotificationPopup/>}
      <Navbar4Left openedLink={openedLink}/>
      <div className="w-full">
        <div className="relative z-40 h-[9.7vh] border-b border-[#FED2AA] flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">{pageTitle}</h1>
            <div className="bg-[#FED2AA] p-3 rounded-full flex items-center gap-[.5vw]">
              <div className="relative h-[3vh] w-[3vh]">
                <Image src={profile.picture} fill alt=""/>
              </div>
              <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium">{profile.fullName}</p>
            </div>
          </div>
        </div>
          <div className="h-[80.8vh] flex justify-center">
            <div className="w-[84.7%] relative">
              {children}
            </div>
          </div>
        <Footer4 />
      </div>
      {/* background images */}
      <div className="absolute h-[20vh] w-[15vw] top-0 right-0">
        <Image src="/background-icons/account-and-settings/WhiteTopRight.svg" fill alt=""/>
      </div>
      <div className="absolute h-[20vh] w-[15vw] bottom-0 left-0">
        <Image src="/background-icons/account-and-settings/WhiteBottomLeft.svg" fill alt=""/>
      </div>
    </div>
  )
}
