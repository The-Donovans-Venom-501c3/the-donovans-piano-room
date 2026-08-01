import React from "react";
import Link from "next/link";
import { aboutNavigationPages } from "@/utils/general";

export default function ContentNav({ page }: { page: string }) {
  const isWhyChooseUs = page.includes("why-choose-us") || page === aboutNavigationPages.whyChooseUs;
  const isWhoWeServe = page.includes("who-we-serve") || page === aboutNavigationPages.whoWeServe;
  const isMembership = page.includes("membership") || page === aboutNavigationPages.membership;
  const isScholarship = page.includes("scholarship") || page === aboutNavigationPages.scholarship;
  const isFAQs = page.includes("faqs") || page === aboutNavigationPages.FAQs;

  return (
    <div className="flex h-fit w-full gap-px">
      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] rounded-tl-xl laptop:text-[16px] desktop:text-[18px]"
        style={{ backgroundColor: isWhyChooseUs ? "#D8BCFD" : "#FFEBD5" }}
        href="/about/why-choose-us"
      >
        <p className="font-bold text-primary-brown">Why Choose Us</p>
      </Link>

      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{ backgroundColor: isWhoWeServe ? "#D8BCFD" : "#FFEBD5" }}
        href="/about/who-we-serve"
      >
        <p className="font-bold text-primary-brown">Who We Serve</p>
      </Link>

      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{ backgroundColor: isMembership ? "#D8BCFD" : "#FFEBD5" }}
        href="/about/membership"
      >
        <p className="font-bold text-primary-brown">Membership</p>
      </Link>

      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] laptop:text-[16px] desktop:text-[18px]"
        style={{ backgroundColor: isScholarship ? "#D8BCFD" : "#FFEBD5" }}
        href="/about/scholarship/what-is-included"
      >
        <p className="font-bold text-primary-brown">Scholarship</p>
      </Link>

      <Link
        className="flex flex-1 items-center justify-center px-3 py-3 text-[12px] rounded-tr-xl laptop:text-[16px] desktop:text-[18px]"
        style={{ backgroundColor: isFAQs ? "#D8BCFD" : "#FFEBD5" }}
        href="/about/faqs"
      >
        <p className="font-bold text-primary-brown">FAQs</p>
      </Link>
    </div>
  );
}