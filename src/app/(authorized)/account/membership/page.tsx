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
import PlanCard from "./components/PlanCard";
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
        "Save $29.70 vs daily pass",
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
      <div className="h-full overflow-y-auto primary-purple-scrollbar pb-8 bg-[#FFEBD5]">
        <AccountAndSettingsNav currentPage={settingsNavigation.membership} />

        <div className="w-full max-w-[1112px] mx-auto px-4 sm:px-6 mt-6">
          {showPlanSelection ? (
            /* VIEW 1: SELECT YOUR PLAN GRID */
            <div className="w-full">
              {/* BACK BUTTON - Slightly bumped from text-sm to text-base */}
              <button
                onClick={() => setShowPlanSelection(false)}
                className="flex items-center gap-1.5 text-[#6B21A8] font-bold mb-3 hover:underline text-base cursor-pointer"
              >
                ← Back to Your Membership
              </button>

              {/* TOP HEADINGS - Slightly bumped from text-2xl/3xl to text-3xl/4xl */}
              <h1 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-[#292524] tracking-tight">
                Select your plan
              </h1>
              {/* SUBTEXT - Slightly bumped from text-sm/base to text-base/lg */}
              <p className="mt-1.5 text-[#3B3531] font-semibold text-base sm:text-lg leading-relaxed">
                You may choose from one of our multiple membership plans: select the one that best suits your interests.
              </p>

              <div className="mt-4 border-b border-[#F5E1C8] w-full mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {availablePlans.map((planItem) => {
                  const isScholarshipPlan = planItem.levelId === MembershipLevelId.FREE;

                  return (
                    <div
                      key={planItem.name}
                      className={isScholarshipPlan ? "transform scale-[1.02] z-10" : ""}
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
            /* VIEW 2: CURRENT SCHOLARSHIP PLAN DASHBOARD */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
              {/* Left Column: Scholarship Card Display */}
              <div className="lg:col-span-5 bg-[#FFEBD5] p-6 rounded-2xl border border-[#FDE2C6] flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Current Plan</h2>
                  <PlanCard
                    plan={scholarshipPlan as unknown as Plan}
                    isScholarship={true}
                    showExpirationMessage={false}
                  />
                </div>
              </div>

              {/* Right Column: Management Options */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                {/* RENEW MEMBERSHIP BOX */}
                <div className="bg-[#FFEBD5] p-6 sm:p-8 rounded-2xl border border-[#FDE2C6] flex-1 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Renew Membership</h3>
                  <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
                    Your membership active status is managed annually.
                  </p>
                  <button className="mt-6 w-full py-3.5 rounded-full bg-[#6B21A8] text-white text-base sm:text-lg font-bold hover:bg-[#581C87] transition-all cursor-pointer shadow-sm">
                    Renew Membership
                  </button>
                </div>

                {/* CHANGE PLAN BOX */}
                <div className="bg-[#FFEBD5] p-6 sm:p-8 rounded-2xl border border-[#FDE2C6] flex-1 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Change Plan</h3>
                  <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
                    Want to switch to Yearly or Monthly plan?
                  </p>
                  <button
                    onClick={() => setShowPlanSelection(true)}
                    className="mt-6 w-full py-3.5 rounded-full border-2 border-[#6B21A8] text-[#6B21A8] text-base sm:text-lg font-bold hover:bg-[#F7F0FC] transition-all cursor-pointer"
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