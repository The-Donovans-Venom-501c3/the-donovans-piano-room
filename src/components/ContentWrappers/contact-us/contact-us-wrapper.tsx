import React from 'react'
import BackgroundContactUs from './background-contact-us'
import { nav4leftLinks } from "@/utils/stores";
import Navbar4Left from "../../navbars/Navbar4Left";

export default function ContactUsContentWrapper({children, openedLink = ""}: {children: React.ReactNode, openedLink?: string }) {
    return (
    <div className="flex w-screen h-screen bg-primary-yellow relative overflow-hidden">
      {/* Sidebar */}
      <Navbar4Left openedLink={nav4leftLinks.contactUs} />

      {/* Main content area */}
      <div className="w-full relative">
        {/* Background between yellow and children */}
        <div className="absolute inset-0 z-0">
          <BackgroundContactUs />
        </div>

        <div className="h-[80.8vh] flex justify-center items-end relative z-10 pt-16"> {/* Add padding-top */}
          <div className="w-[84.7%] relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}