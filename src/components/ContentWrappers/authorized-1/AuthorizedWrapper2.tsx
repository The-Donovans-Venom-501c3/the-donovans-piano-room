import React, { useEffect } from "react";
import Footer4 from "../../footers/Footer4";
import Navbar4Left from "../../navbars/Navbar4Left";
import Image from "next/image";
import Profile from "@/components/atoms/Profile";
import { guestUser, nav4leftLinks } from "@/utils/stores";
import { useSetAtom } from "jotai";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

export default function AuthorizedWrapper2({
  children,
  pageTitle,
  openedLink = "",
}: {
  children: React.ReactNode;
  pageTitle: string;
  openedLink?: string;
}) {
  return (
    <div className="flex h-[100vh] w-[100vw] bg-[#F5E8FF]">
      {/* {showNotification && <NotificationPopup />} */}
      <Navbar4Left openedLink={openedLink} />
      <div className="w-full">
        <div className="relative z-40 flex h-[9.7vh] items-center justify-center border-b border-[#ECD6FE] backdrop-blur-sm">
          <div className="flex w-[84.7%] items-center justify-between">
            <h1 className="font-montserrat text-5xl font-medium 3xl:text-6xl 4xl:text-7xl">
              {pageTitle}
            </h1>
            <Profile />
          </div>
        </div>
        <div className="flex h-[80.8vh] justify-center">
          <div className="relative w-[84.7%]">{children}</div>
        </div>
        <Footer4 />
      </div>
      {/* background images */}
      <div className="absolute right-0 top-0 h-[20vh] w-[12vw]">
        <Image
          src="/background-icons/authorized-wrapper-2/top-right.svg"
          fill
          alt=""
        />
      </div>
    </div>
  );
}
