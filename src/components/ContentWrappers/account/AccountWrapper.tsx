import React from "react";
import Footer4 from "../../footers/Footer4";
import Navbar4Left from "../../navbars/Navbar4Left";
import Image from "next/image";
import AccountAndSettingsNav from "./AccountAndSettingsNav";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";

export default function AccountWrapper({children, currentPage}: {children: React.ReactNode, currentPage: string}) {
  const profile = useAtomValue(profileAtom)
  return (
    <div className="flex w-[100vw] h-[100vh] bg-[#FFEBD5]">
      <Navbar4Left />
      <div className="w-full">
        <div className="relative z-40 h-[9.7vh] border-b border-[#FED2AA] flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">Account & Settings</h1>
            <div className="bg-[#FED2AA] p-3 rounded-full flex items-center gap-[.5vw]">
              <div className="relative h-[3vh] w-[3vh]">
                <Image src={profile.imageSrc} fill alt=""/>
              </div>
              <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium">{profile.fullName}</p>
            </div>
          </div>
        </div>
          <div className="h-[80.8vh] flex justify-center">
            <div className="w-[84.7%] relative">
              <AccountAndSettingsNav currentPage={currentPage}/>
              <div className="w-full h-[85%] mt-[1%]">

                {children}
              </div>
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
