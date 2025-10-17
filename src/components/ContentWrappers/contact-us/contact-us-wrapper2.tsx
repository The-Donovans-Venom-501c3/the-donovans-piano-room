import React from 'react'
import BackgroundContactUs from './background-contact-us'
import { nav4leftLinks } from "@/utils/stores";
import Navbar4Left from "../../navbars/Navbar4Left";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";
import Image from "next/image";
import Footer5 from "@/components/footers/Footer5";

export default function ContactUsContentWrapper({
  children,
  openedLink = nav4leftLinks.contactUs
}: {
  children: React.ReactNode,
  openedLink?: string
}) {
  const profile = useAtomValue(profileAtom)

  return (
    <div className="flex w-screen h-screen bg-[#8B24CC] relative overflow-hidden">
      {/* Sidebar */}
      <Navbar4Left openedLink={openedLink} />

      {/* Main layout: column */}
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="relative z-40 h-[9.7vh] border-b border-purple-800 bg-purple-800/20 flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-white text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">
              Contact
            </h1>
            {profile && (
              <div className="bg-[#FED2AA] p-3 rounded-full flex items-center gap-[.5vw]">
                <div className="relative h-[3vh] w-[3vh]">
                  <Image
                    src={profile.picture || "/default-avatar.png"}
                    fill
                    alt="Profile"
                  />
                </div>
                <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium">
                  {profile.fullName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex justify-center items-center overflow-auto">
          <div className="w-full relative z-10">
            {children}
          </div>
        </div>

        {/* Footer (always bottom) */}
        <Footer5 />
      </div>

      {/* Background fixed to right side of screen */}
      <div className="absolute top-0 right-0 bottom-0 w-full z-0 pointer-events-none">
        <BackgroundContactUs />
      </div>
    </div>
  );
}
