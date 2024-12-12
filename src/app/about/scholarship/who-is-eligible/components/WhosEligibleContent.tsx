import React from "react";
import AboutMembershipNav from "../../components/AboutMembershipNav";
import { aboutScholarshipNavigation } from "@/utils/general";
import Image from "next/image";
import Link from "next/link";

export default function WhosEligibleContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-10">
      <h2 className="text-center font-montserrat text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-8xl">
        Unlock Potential with Scholarship Power!
      </h2>
      <AboutMembershipNav page={aboutScholarshipNavigation.whosEligible} />
      <div className="flex flex-col sm:flex-row h-[56%] w-full items-center justify-around laptop:h-[60%]">
        <div
          className="flex h-full flex-1 flex-col items-center justify-center"
          style={{ position: "relative" }}
        >
          <Image
            src="/about/scholarship/who-is-eligible/Icon1.svg"
            alt=""
            fill
          />
        </div>
        <div className="flex flex-1 flex-col p-4 max-sm:items-center">
          <p className="ml-6 mt-4 w-[85%] text-lg laptop:mt-8 laptop:text-[14px] desktop:text-3xl">
            Scholarships are currently focused on two specific age groups:
            individuals aged 21 and younger, and those aged 60 and older.
          </p>
          <p className="ml-6 mt-4 w-[85%] text-lg laptop:mt-8 laptop:text-[14px] desktop:text-3xl">
            Eligibility for the scholarships is based on family income being
            within the Federal Poverty Level (FPL).
          </p>
          <p className="ml-6 mt-4 w-[85%] text-lg laptop:mt-8 laptop:text-[14px] desktop:text-3xl">
            Even if your income exceeds the FPL, you may still be eligible for
            partial scholarships for music education. Applicants are encouraged
            to inquire for more information about this option.
          </p>
          <div
            className="ml-6 mt-4 flex w-[85%] items-center justify-start rounded-lg p-4 text-lg font-semibold text-black laptop:mt-8 laptop:text-[14px]"
            style={{ backgroundColor: "#FFEBD5" }}
          >
            <div className="ml-6 flex items-center">
              <Image
                src="/about/scholarship/who-is-eligible/Cat.svg"
                alt=""
                width={55}
                height={55}
              />
            </div>
            <div className="ml-6 flex flex-1 flex-col items-start p-4">
              <p>
                Learn more about out scholarships and eligibility on The
                Donovan&apos;s Venom:{" "}
                <Link
                  href="https://www.thedonovan.org"
                  className="text-primary-purple underline"
                >
                  Visit the site
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
