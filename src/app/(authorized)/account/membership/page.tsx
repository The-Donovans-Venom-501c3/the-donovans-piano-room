"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import {
  authorizedWrapperTitles,
  settingsNavigation,
} from "@/utils/general";
import { getUserMembership } from "@/lib/api/membershipService";
import { UserMembership, MembershipLevelId, Plan } from "@/interfaces/membershipInterface";
import PlanCard from "./components/PlanCard";
import PaymentReceipt from "@/components/payment/PaymentReceipt";
import "@/styles/primary-purple-scrollbar.css";

// Normalize backend plan identifier (levelId, membershipId, slug, etc.)
function resolveMembershipLevelId(membership: any): MembershipLevelId {
  if (!membership) return MembershipLevelId.FREE;

  const rawId = String(
    membership.levelId ??
      membership.membershipLevelId ??
      membership.planId ??
      membership.membershipId ??
      ""
  )
    .toLowerCase()
    .trim();

  if (
    rawId === MembershipLevelId.YEAR.toLowerCase() ||
    rawId === "yearly" ||
    rawId === "year" ||
    rawId === "004"
  ) {
    return MembershipLevelId.YEAR;
  }

  if (
    rawId === MembershipLevelId.MONTH.toLowerCase() ||
    rawId === "monthly" ||
    rawId === "month" ||
    rawId === "002"
  ) {
    return MembershipLevelId.MONTH;
  }

  if (
    rawId === MembershipLevelId.DAY.toLowerCase() ||
    rawId === "daily" ||
    rawId === "day" ||
    rawId === "day pass" ||
    rawId === "001"
  ) {
    return MembershipLevelId.DAY;
  }

  return MembershipLevelId.FREE;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPlanSelection, setShowPlanSelection] = useState<boolean>(false);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);

  // Derive the user's current level from their membership
  const currentLevelId = resolveMembershipLevelId(membership);

  const availablePlans = [
    {
      levelId: MembershipLevelId.YEAR,
      slug: "yearly",
      name: "Yearly",
      planName: "Yearly",
      price: 19.99,
      formattedPrice: "19.99",
      period: "annually",
      yearlyPrice: "239.88",
      isPopular: true,
      isCurrent: currentLevelId === MembershipLevelId.YEAR,
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
      slug: "monthly",
      name: "Monthly",
      planName: "Monthly",
      price: 29.99,
      formattedPrice: "29.99",
      period: "monthly",
      yearlyPrice: "359.88",
      isRecommended: true,
      isCurrent: currentLevelId === MembershipLevelId.MONTH,
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
      slug: "daily",
      name: "Day Pass",
      planName: "Day Pass",
      price: 1.99,
      formattedPrice: "1.99",
      period: "one day",
      yearlyPrice: "726.35",
      isCurrent: currentLevelId === MembershipLevelId.DAY,
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
      slug: "free",
      name: "Scholarship",
      planName: "Scholarship",
      price: 0,
      formattedPrice: "FREE",
      period: "Scholarship",
      isCurrent: currentLevelId === MembershipLevelId.FREE,
      benefits: [
        "100% cost covered",
        "For eligible low-income families",
        "Renewed annually if qualified",
        "Apply once, enjoy all year",
      ],
      moreBenefits: [],
    },
  ];

  // Dynamically resolve the active plan (no hardcoded Scholarship override)
  const currentPlan =
    availablePlans.find((p) => p.levelId === currentLevelId) ||
    availablePlans[3];

  useEffect(() => {
    if (searchParams?.get("payment") === "success") {
      setShowPaymentReceipt(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const userMembership = await getUserMembership().catch(() => null);
        if (!isMounted) return;
        setMembership(userMembership);

        if (userMembership && resolveMembershipLevelId(userMembership)) {
          setShowPlanSelection(false); // Show Dashboard (View 2)
        } else {
          setShowPlanSelection(true); // Show Selection Grid (View 1) for non-members
        }
      } catch (error) {
        console.error("Failed to load membership status", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRenewClick = () => {
    if (currentPlan.levelId === MembershipLevelId.FREE) {
      setShowPlanSelection(true);
    } else {
      router.push(`/account/membership/upgrade/${currentPlan.slug}`);
    }
  };

  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <div className="h-full overflow-y-auto primary-purple-scrollbar pb-8 bg-[#FFEBD5]">
        <AccountAndSettingsNav currentPage={settingsNavigation.membership} />
        <div className="w-full max-w-[1112px] mx-auto px-4 sm:px-6 mt-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className="text-base sm:text-lg font-bold text-gray-700">
                Loading membership details...
              </p>
            </div>
          ) : showPlanSelection ? (
            /* VIEW 1: SELECT YOUR PLAN GRID */
            <div className="w-full">
              <button
                onClick={() => setShowPlanSelection(false)}
                className="flex items-center gap-1.5 text-[#6B21A8] font-bold mb-3 hover:underline text-base cursor-pointer"
              >
                ← Back to Your Membership
              </button>

              <h1 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-[#292524] tracking-tight">
                Select your plan
              </h1>
              <p className="mt-1.5 text-[#3B3531] font-semibold text-base sm:text-lg leading-relaxed">
                You may choose from one of our multiple membership plans: select the one that best suits your interests.
              </p>

              <div className="mt-4 border-b border-[#F5E1C8] w-full mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {availablePlans.map((planItem) => {
                  const isCurrent = planItem.levelId === currentLevelId;
                  const isScholarshipPlan =
                    planItem.levelId === MembershipLevelId.FREE;

                  return (
                    <div
                      key={planItem.name}
                      className={isCurrent ? "transform scale-[1.02] z-10" : ""}
                    >
                      <PlanCard
                        plan={planItem as unknown as Plan}
                        isScholarship={isScholarshipPlan}
                        showCurrentInHeader={isCurrent}
                        chooseButton={{
                          text: isCurrent
                            ? "Current plan"
                            : isScholarshipPlan
                            ? "Apply for Scholarship"
                            : "Choose plan",
                          onClick: () =>
                            router.push(
                              `/account/membership/upgrade/${planItem.slug}`
                            ),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW 2: CURRENT PLAN DASHBOARD */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
              {/* Left Column: Current Plan Card Display */}
              <div className="lg:col-span-5 bg-[#FFEBD5] p-6 rounded-2xl border border-[#FDE2C6] flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Current Plan
                  </h2>
                  <PlanCard
                    plan={currentPlan as unknown as Plan}
                    isScholarship={
                      currentPlan.levelId === MembershipLevelId.FREE
                    }
                    showExpirationMessage={false}
                  />
                </div>
              </div>

              {/* Right Column: Management Options */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                {/* RENEW MEMBERSHIP BOX */}
                <div className="bg-[#FFEBD5] p-6 sm:p-8 rounded-2xl border border-[#FDE2C6] flex-1 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Renew Membership
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
                    Your membership active status is managed annually.
                  </p>
                  <button
                    onClick={handleRenewClick}
                    className="mt-6 w-full py-3.5 rounded-full bg-[#6B21A8] text-white text-base sm:text-lg font-bold hover:bg-[#581C87] transition-all cursor-pointer shadow-sm"
                  >
                    Renew Membership
                  </button>
                </div>

                {/* CHANGE PLAN BOX */}
                <div className="bg-[#FFEBD5] p-6 sm:p-8 rounded-2xl border border-[#FDE2C6] flex-1 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Change Plan
                  </h3>
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

          {showPaymentReceipt ? (
            <PaymentReceipt
              open={true}
              category="membership"
              title={`${currentPlan.planName} membership payment`}
              amount={
                currentPlan.levelId === MembershipLevelId.YEAR
                  ? Number(currentPlan.yearlyPrice || currentPlan.price)
                  : currentPlan.price
              }
              currency="USD"
              effectiveDate={searchParams?.get("effectiveDate")}
              onClose={() => {
                setShowPaymentReceipt(false);
                router.replace("/account/membership");
              }}
            />
          ) : null}
        </div>
      </div>
    </AuthorizedWrapper1>
  );
}