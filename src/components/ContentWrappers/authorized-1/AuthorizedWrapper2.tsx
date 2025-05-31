import React from "react";
import Footer4 from "../../footers/Footer4";
import Navbar4Left from "../../navbars/Navbar4Left";
import Image from "next/image";
import Profile from "@/components/atoms/Profile";

export default function AuthorizedWrapper2({ children, pageTitle, openedLink = "" }: { children: React.ReactNode, pageTitle: string, openedLink?: string }) {

  // const showNotification = useAtomValue(showNotificationAtom)
  return (
    <div className="flex w-[100vw] h-[100vh] bg-[#F5E8FF]">
      {/* {showNotification && <NotificationPopup />} */}
      <Navbar4Left openedLink={openedLink} />
      <div className="w-full">
        <div className="relative z-40 h-[9.7vh] border-b border-[#ECD6FE] flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">{pageTitle}</h1>
            <Profile />
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
      <div className="absolute h-[20vh] w-[12vw] top-0 right-0">
        <Image src="/background-icons/authorized-wrapper-2/top-right.svg" fill alt="" />
      </div>
    </div>
  )
}
