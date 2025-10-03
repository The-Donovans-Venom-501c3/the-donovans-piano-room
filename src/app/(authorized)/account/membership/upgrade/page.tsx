"use client";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import {
  authorizedWrapperTitles,
  settingsNavigation,
} from "@/utils/general";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PlanCard from "../components/PlanCard";
import BenefitAccessCard from "../components/BenefitAccessCard";
import Popup from "../components/Popup";
import { getPlanInfo, getUserMembership } from "@/lib/api/membershipService";
import { UserMembership, MembershipLevelId, MembershipStatus, Plan } from "@/interfaces/membershipInterface";
import { MEMBERSHIP_UI_CONFIG, ButtonConfig, PopupType, getYearlyPriceMultiplier } from "@/app/(authorized)/account/membership/config";

export default function UpgradePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<MembershipLevelId | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [plans, setPlans] = useState<Record<MembershipLevelId, Plan | undefined>>({} as Record<MembershipLevelId, Plan | undefined>);
  const [showScholarshipPopup, setShowScholarshipPopup] = useState<boolean>(false);

  const handleBenefitCardToggle = (levelId: MembershipLevelId) => {
    // If this plan is already open, close it. Otherwise, open it.
    setSelectedPlan(selectedPlan === levelId ? null : levelId);
  };

  const handleScholarshipApply = () => {
    // Redirect to The Donovan organization website
    const scholarshipFormUrl = "https://www.thedonovan.org";
    window.open(scholarshipFormUrl, '_blank', 'noopener,noreferrer');
    setShowScholarshipPopup(false);
  };

  // Button configuration for back button
  const backButton: ButtonConfig = {
    onClick: () => router.push('/account/membership'),
    text: 'Your membership',
    disabled: false,
    loading: false,
    style: 'mb-6 flex items-center gap-2 text-primary-purple'
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [m, free, day, month, year] = await Promise.all([
          getUserMembership(),
          getPlanInfo(MembershipLevelId.FREE),
          getPlanInfo(MembershipLevelId.DAY),
          getPlanInfo(MembershipLevelId.MONTH),
          getPlanInfo(MembershipLevelId.YEAR),
        ]);
        if (!isMounted) return;
        setMembership(m);
        setPlans({
          [MembershipLevelId.FREE]: free,
          [MembershipLevelId.DAY]: day,
          [MembershipLevelId.MONTH]: month,
          [MembershipLevelId.YEAR]: year,
        });
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load plans");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const expirationDays = useMemo(() => {
    if (!membership?.nextRenewalAt) return undefined;
    const now = new Date();
    const end = new Date(membership.nextRenewalAt);
    const ms = end.getTime() - now.getTime();
    if (Number.isNaN(ms)) return undefined;
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [membership?.nextRenewalAt]);

  // Helper function to render a single plan
  const renderPlan = (levelId: MembershipLevelId) => {
    const planInfo = plans[levelId];
    if (!planInfo) return null;

    // Create the plan data with current status and yearly price
    const plan: Plan = {
      ...planInfo,
      isPopular: planInfo.levelId === MembershipLevelId.YEAR,
      isRecommended: planInfo.levelId === MembershipLevelId.MONTH,
      isCurrent: planInfo.levelId === membership?.levelId,
      expirationDays: planInfo.levelId === membership?.levelId ? expirationDays : undefined,
      yearlyPrice: (planInfo.price * getYearlyPriceMultiplier(levelId)).toFixed(2)
    };

    const chooseButton: ButtonConfig = {
      onClick: () => {
        if (plan.planName === "Scholarship") {
          setShowScholarshipPopup(true);
        } else {
          // Navigate to confirmation page based on plan type
          const planIdMap: Record<string, string> = {
            'Yearly': 'yearly',
            'Monthly': 'monthly', 
            'Day Pass': 'daily',
            // Note: Scholarship plan handled separately via popup, not through planIdMap
          };
          const planId = planIdMap[plan.planName];
          if (planId) {
            router.push(`/account/membership/upgrade/${planId}`);
          }
        }
      },
      text: plan.planName === "Scholarship" ? "Apply for Scholarship" : "Choose plan",
      disabled: false,
      loading: false,
      style: "relative z-10 mt-3 rounded-full border border-primary-purple px-6 py-3 text-center font-medium bg-primary-purple text-white"
    };
    
    return (
      <>
        {/* Plan Card */}
        <div className="flex-shrink-0 w-80 md:w-96">
          <PlanCard
            plan={plan}
            uiConfig={{
              ...MEMBERSHIP_UI_CONFIG[levelId],
              useSingleColumn: true,
              priceBlockSize: "py-14"
            }}
            showCurrentInHeader={false}
            showExpirationMessage={plan.isCurrent}
            showChooseButton={!plan.isCurrent}
            chooseButton={chooseButton}
            useBenefitAccessCard={true}
            onBenefitAccessCardToggle={() => handleBenefitCardToggle(levelId)}
          />
        </div>

        {/* Benefit Access Card */}
        {selectedPlan === levelId && (
          <div className="flex-shrink-0 w-80 md:w-96">
            <BenefitAccessCard 
              planName={plan.planName}
              headerColor={MEMBERSHIP_UI_CONFIG[levelId].benefitCardColors?.headerColor || 'bg-gray-500'}
              textColor={MEMBERSHIP_UI_CONFIG[levelId].benefitCardColors?.textColor || 'text-white'}
              benefits={plan.moreBenefits}
              closeButton={{
                onClick: () => setSelectedPlan(null),
                text: "×"
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <AuthorizedWrapper1 
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <AccountAndSettingsNav currentPage={settingsNavigation.membership} />

      <div className="mt-4 w-full">
        {/* Back button */}
        <button 
          className={backButton.style}
          disabled={backButton.disabled || backButton.loading}
          onClick={backButton.onClick}
        >
          <Image
            className="h-5 w-5 shrink-0"
            src="/memberships/upgrade/arrow_back_FILL0_wght400_GRAD0_opsz24 1.svg"
            alt="Back arrow"
            width={20}
            height={20}
          />
          {backButton.loading 
            ? (backButton.loadingText || 'Loading...')
            : backButton.text
          }
        </button>

        <h1 className="font-montserrat text-5xl font-medium text-primary-brown 3xl:text-6xl 4xl:text-7xl">
          Select your plan
        </h1>
        
        {loading && (
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">Loading plans...</p>
        )}
        {!loading && error && (
          <p className="text-red-600 text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">{error}</p>
        )}
        {!loading && !error && (
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">
            There are multiple membership you can choose from, select the one that best suits your interests.
          </p>
        )}
        <div className='mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1'></div>
        
        <div className="mt-8 overflow-x-auto">
          <div className="flex gap-6 min-w-fit">
            {Object.values(MembershipLevelId).map((levelId) => renderPlan(levelId))}
          </div>
        </div>

        {/* Horizontal Scroller Indicators */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3">
            {Object.values(MembershipLevelId).map((levelId) => (
            <div
              key={levelId}
              className={`h-3 rounded-full transition-all duration-300 ${
                selectedPlan === levelId 
                ? "bg-[#6F219E] w-12" 
                : "bg-[#B457F5] w-3"
              }`}
            />
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship Popup */}
      <Popup
        isOpen={showScholarshipPopup}
        type={PopupType.APPLY_SCHOLARSHIP}
        primaryButton={{
          onClick: handleScholarshipApply,
          text: "Apply for Scholarship"
        }}
        secondaryButton={{
          onClick: () => setShowScholarshipPopup(false),
          text: "Go Back"
        }}
      />
    </AuthorizedWrapper1>
  );
}
