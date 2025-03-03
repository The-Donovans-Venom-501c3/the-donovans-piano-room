import { aboutScholarshipNavigation } from "@/utils/general";
import Link from "next/link";
import React from "react";

export default function AboutMembershipNav({ page }: { page: string }) {
  return (
    <div className="flex h-24 md:h-12 gap-px w-full [@media(min-width:356px)]:w-[80%] sm:w-[60%] md:w-[45%]">
      <Link
        className="flex flex-1 items-center justify-center rounded-l-xl p-8 text-[12px] laptop:text-[14px] desktop:py-10 desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutScholarshipNavigation.whatsIncluded
              ? "#FFEBD5"
              : "#D8BCFD",
        }}
        href="/about/scholarship/what-is-included"
      >
        <p
          className="font-montserrat font-bold text-primary-brown laptop:font-semibold w-full text-center"
          style={{}}
        >
          What’s included in a scholarship
        </p>
      </Link>
      <Link
        className="flex flex-1 items-center justify-center rounded-r-xl p-8 text-[12px] laptop:text-[14px] desktop:py-10 desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutScholarshipNavigation.whosEligible
              ? "#FFEBD5"
              : "#D8BCFD",
        }}
        href="/about/scholarship/who-is-eligible"
      >
        <p
          style={{}}
          className="font-montserrat font-bold text-primary-brown laptop:font-semibold w-full text-center"
        >
          Who is eligible for a scholarship
        </p>
      </Link>
    </div>
  );
}
