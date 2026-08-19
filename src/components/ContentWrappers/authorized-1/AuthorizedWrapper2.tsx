"use client";

import React from "react";
import Footer4 from "../../footers/Footer4";
import Navbar4Left from "../../navbars/Navbar4Left";
import Image from "next/image";

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
    <div className="flex w-[100vw] h-[100vh] bg-[#F5E8FF] overflow-hidden">
      <Navbar4Left openedLink={openedLink} />

      {/* Main Column */}
      <div className="w-full flex flex-col h-full overflow-hidden">
        {/* Fixed Header */}
        <div className="relative z-40 h-[9.7vh] shrink-0 border-b border-[#ECD6FE] flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div
          id="wrapper-content-scroll"
          className="h-[80.8vh] flex justify-center overflow-y-auto scroll-smooth"
        >
          <div className="w-[84.7%] relative py-6">{children}</div>
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0">
          <Footer4 />
        </div>
      </div>

      {/* Background Decorator */}
      <div className="absolute h-[20vh] w-[12vw] top-0 right-0 pointer-events-none">
        <Image
          src="/background-icons/authorized-wrapper-2/top-right.svg"
          fill
          alt=""
        />
      </div>
    </div>
  );
}