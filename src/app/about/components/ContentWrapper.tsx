import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentNav from "../components/ContentNav";

export default function ContentWrapper({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {
  return (
    <>
      <div className="relative z-40 flex w-full flex-col items-center justify-center max-md:mb-10 min-h-screen">
        <ContentNav page={page} />
        <div className="h-fit w-[84.7%] rounded-b-xl border border-primary-purple bg-[#FEF8EE] py-10 sm:rounded-xl">
          {children}
        </div>
      </div>
      <BackgroundLayout />
    </>
  );
}
