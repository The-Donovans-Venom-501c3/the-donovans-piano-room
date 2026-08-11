"use client";

import { useEffect, useState } from "react";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import {
  authorizedWrapperTitles,
  settingsNavigation,
} from "@/utils/general";
import { getUserMembership } from "@/lib/api/membershipService";
import { UserMembership, MembershipLevelId, Plan } from "@/interfaces/membershipInterface";
import PlanCard from "../components/PlanCard";
import "@/styles/primary-purple-scrollbar.css";

export default function Page() {
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPlanSelection, setShowPlanSelection] = useState<boolean>(true);

  const availablePlans = [
    {
      levelId: MembershipLevelId.YEAR,
      name: "Yearly",
      planName: "Yearly",
      price: 19.99,
      formattedPrice: "19.99",
      period: "annually",
      yearlyPrice: "239.88",
      isPopular: true,
      isCurrent: false,
      benefits: [
        "Best value, biggest savings",
        "Save $120 every year",
        "No monthly billing hassle",
        "Commit once, enjoy worry-free",
      ],
      moreBenefits: [],
    },
    {
      levelId: MembershipLevelId.MONTH,
      name: "Monthly",
      planName: "Monthly",
      price: 29.99,
      formattedPrice: "29.99",
      period: "monthly",
      yearlyPrice: "359.88",
      isRecommended: true,
      isCurrent: false,
      benefits: [
        "No long-term commitment",
        "Save $40 vs daily pass",
        "Pay monthly, less upfront",
        "Full access, zero lock-in",
      ],
      moreBenefits: [],
    },
    {
      levelId: MembershipLevelId.DAY,
      name: "Day Pass",
      planName: "Day Pass",
      price: 1.99,
      formattedPrice: "1.99",
      period: "one day",
      yearlyPrice: "726.35",
      isCurrent: false,
      benefits: [
        "Try before you commit",
        "24 hours, full access",
        "One day, no strings",
        "Perfect for testing first",
      ],
      moreBenefits: [],
    },
    {
      levelId: MembershipLevelId.FREE,
      name: "Scholarship",
      planName: "Scholarship",
      price: 0,
      formattedPrice: "FREE",
      period: "Scholarship",
      isCurrent: true,
      benefits: [
        "100% cost covered",
        "For eligible low-income families",
        "Renewed annually if qualified",
        "Apply once, enjoy all year",
      ],
      moreBenefits: [],
    },
  ];

  const scholarshipPlan = availablePlans.find(
    (p) => p.levelId === MembershipLevelId.FREE
  )!;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const userMembership = await getUserMembership().catch(() => null);
        if (!isMounted) return;
        setMembership(userMembership);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <div className="h-full overflow-y-auto primary-purple-scrollbar pb-12 bg-[#FFF8F3]">
        <AccountAndSettingsNav currentPage={settingsNavigation.membership} />

        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 mt-8">
          {showPlanSelection ? (
            /* VIEW 1: SELECT YOUR PLAN GRID */
            <div className="w-full">
              {/* BUMPED TOP BACK BUTTON */}
              <button
                onClick={() => setShowPlanSelection(false)}
                className="flex items-center gap-2 text-[#6B21A8] font-black mb-4 hover:underline text-lg sm:text-xl cursor-pointer"
              >
                ← Back to Your Membership
              </button>

              {/* BUMPED TOP TITLE & SUBTITLE */}
              <h1 className="font-montserrat text-4xl sm:text-5xl font-black text-[#292524] tracking-tight">
                Select your plan
              </h1>
              <p className="mt-3 text-[#3B3531] font-bold text-lg sm:text-2xl leading-snug">
                You may choose from one of our multiple membership plans: select the one that best suits your interests.
              </p>

              <div className="mt-6 border-b-2 border-[#F5E1C8] w-full mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full items-stretch min-h-[680px]">
                {availablePlans.map((planItem) => {
                  const isScholarshipPlan = planItem.levelId === MembershipLevelId.FREE;

                  return (
                    <div
                      key={planItem.name}
                      className={`h-full flex flex-col justify-between ${
                        isScholarshipPlan ? "transform scale-[1.02] z-10" : ""
                      }`}
                    >
                      <PlanCard
                        plan={planItem as unknown as Plan}
                        isScholarship={isScholarshipPlan}
                        showCurrentInHeader={isScholarshipPlan}
                        showChooseButton={!isScholarshipPlan}
                        chooseButton={{
                          text: isScholarshipPlan ? "Apply for Scholarship" : "Choose plan",
                          onClick: () => console.log(`Selected ${planItem.name}`),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW 2: CURRENT PLAN DASHBOARD */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-stretch min-h-[580px]">
              {/* Left Column: Scholarship Card Display */}
              <div className="lg:col-span-5 bg-[#FFF3E8] p-8 rounded-3xl border-2 border-[#FDE2C6] flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Current Plan</h2>
                  <PlanCard
                    plan={scholarshipPlan as unknown as Plan}
                    isScholarship={true}
                    showExpirationMessage={false}
                  />
                </div>
              </div>

              {/* Right Column: Management Options (Renew Membership & Change Plan) */}
              <div className="lg:col-span-7 flex flex-col gap-8 justify-between">
                {/* RENEW MEMBERSHIP BOX - BUMPED SIZES */}
                <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-gray-100 shadow-md flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900">Renew Membership</h3>
                  <p className="text-lg sm:text-xl text-gray-700 mt-3 font-bold">
                    Your membership active status is managed annually.
                  </p>
                  <button className="mt-8 w-full py-4 sm:py-5 rounded-full bg-[#6B21A8] text-white text-xl sm:text-2xl font-black hover:bg-[#581C87] transition-all cursor-pointer shadow-md">
                    Renew Membership
                  </button>
                </div>

                {/* CHANGE PLAN BOX - BUMPED SIZES */}
                <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-gray-100 shadow-md flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900">Change Plan</h3>
                  <p className="text-lg sm:text-xl text-gray-700 mt-3 font-bold">
                    Want to switch to Yearly or Monthly plan?
                  </p>
                  <button
                    onClick={() => setShowPlanSelection(true)}
                    className="mt-8 w-full py-4 sm:py-5 rounded-full border-3 border-[#6B21A8] text-[#6B21A8] text-xl sm:text-2xl font-black hover:bg-[#F7F0FC] transition-all cursor-pointer"
                  >
                    Select Different Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthorizedWrapper1>
  );
}