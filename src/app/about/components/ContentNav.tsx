import { aboutNavigationPages } from "@/utils/general";
import Link from "next/link";
import React from "react";

export default function ContentNav({ page }: { page: string }) {
  return (
    <div className="flex h-fit w-full gap-px mt-36 sm:w-[80%] md:w-[70%]">
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] sm:rounded-tl-xl laptop:text-[16px] desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutNavigationPages.whyChooseUs ? "#FFEBD5" : "#D8BCFD",
        }}
        href="/about/why-choose-us"
      >
        <p className="font-bold text-primary-brown" style={{}}>
          Why Choose Us
        </p>
      </Link>
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 font-montserrat text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutNavigationPages.whoWeServe ? "#FFEBD5" : "#D8BCFD",
        }}
        href="/about/who-we-serve"
      >
        <p style={{}} className="font-bold text-primary-brown">
          Who We Serve
        </p>
      </Link>
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 font-montserrat text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutNavigationPages.membership ? "#FFEBD5" : "#D8BCFD",
        }}
        href="/about/membership"
      >
        <p style={{}} className="font-bold text-primary-brown">
          Membership
        </p>
      </Link>
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 font-montserrat text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutNavigationPages.scholarship ? "#FFEBD5" : "#D8BCFD",
        }}
        href="/about/scholarship/what-is-included"
      >
        <p style={{}} className="font-bold text-primary-brown">
          Scholarship
        </p>
      </Link>
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 font-montserrat text-[12px] sm:rounded-tr-xl laptop:text-[16px] desktop:text-[18px]"
        style={{
          backgroundColor:
            page !== aboutNavigationPages.FAQs ? "#FFEBD5" : "#D8BCFD",
        }}
        href="/about/faqs"
      >
        <p style={{}} className="font-bold text-primary-brown">
          FAQs
        </p>
      </Link>
    </div>
  );
}
