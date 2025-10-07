"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import {
  authorizedWrapperTitles,
  settingsNavigation,
} from "@/utils/general";
import { 
  getPlanInfo, 
  getUserMembership, 
  getPaymentMethods, 
  previewMembershipUpgrade, 
  requestMembershipUpgrade,
  getUpgradeStatus 
} from "@/lib/api/membershipService";
import Payment from "../../components/Payment";
import PlanCard from "../../components/PlanCard";
import Popup from "../../components/Popup";
import PaymentMethodSelectionPopup from "../../components/PaymentMethodSelectionPopup";
import { 
  UserMembership, 
  MembershipStatus, 
  MembershipLevelId, 
  Plan, 
  PaymentMethod, 
  UpgradePreview, 
  UpgradeResponse 
} from "@/interfaces/membershipInterface";
import { MEMBERSHIP_UI_CONFIG, PopupType, ButtonConfig, getYearlyPriceMultiplier } from "../../config";
import "../../../../../../styles/primary-purple-scrollbar.css";
import Image from "next/image";

// Map planId from URL to MembershipLevelId
const PLAN_ID_MAP: Record<string, MembershipLevelId> = {
  'yearly': MembershipLevelId.YEAR,
  'monthly': MembershipLevelId.MONTH,
  'daily': MembershipLevelId.DAY,
  'free': MembershipLevelId.FREE,
};

export default function UpgradeConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId as string;
  
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackConfirmationPopup, setShowBackConfirmationPopup] = useState(false);
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState(false);
  const [showScholarshipWarningPopup, setShowScholarshipWarningPopup] = useState(false);
  const [switching, setSwitching] = useState<boolean>(false);
  const [switchSuccess, setSwitchSuccess] = useState<boolean>(false);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string | null>(null);

  // Get the MembershipLevelId from the URL parameter
  const levelId = PLAN_ID_MAP[planId];

  useEffect(() => {
    let isMounted = true;
    
    // Validate planId
    if (!levelId) {
      setError("Invalid plan selected");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const [userMembership, planDetails, paymentMethodsData] = await Promise.all([
          getUserMembership(),
          getPlanInfo(levelId),
          getPaymentMethods()
        ]);
        
        if (!isMounted) return;
        
        setMembership(userMembership);
        setSelectedPlan({ 
          ...planDetails, 
          isCurrent: false, // This is a selected plan, not current
          isPopular: planDetails.levelId === MembershipLevelId.YEAR,
          yearlyPrice: (planDetails.price * getYearlyPriceMultiplier(levelId)).toFixed(2)
        });

        // Check if user already has the target membership level (successful upgrade)
        if (userMembership.levelId === levelId) {
          // User already has this membership level, likely from a recent successful upgrade
          // Redirect them to the membership page instead of showing upgrade options
          setTimeout(() => {
            router.push('/account/membership');
          }, 1000);
          return;
        }

        // Check if user is switching from scholarship plan
        if (userMembership.levelId === MembershipLevelId.FREE && levelId !== MembershipLevelId.FREE) {
          setShowScholarshipWarningPopup(true);
        }
        
        // Set payment methods and select default
        const methods = paymentMethodsData.data || [];
        setPaymentMethods(methods);
        const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault) || methods[0];
        setSelectedPaymentMethod(defaultMethod);
        
        // Get switch preview if we have the required data
        if (planDetails?.levelId) {
          const memberIdMap = {
            [MembershipLevelId.FREE]: '003',
            [MembershipLevelId.DAY]: '001', 
            [MembershipLevelId.MONTH]: '002',
            [MembershipLevelId.YEAR]: '004'
          };
          
          const newMembershipId = memberIdMap[planDetails.levelId as keyof typeof memberIdMap];
          if (newMembershipId) {
            try {
              const preview = await previewMembershipUpgrade(newMembershipId);
              if (!isMounted) return;
              setUpgradePreview(preview);
            } catch (previewError) {
              console.warn('Failed to load switch preview:', previewError);
            }
          }
        }
        
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load plan details");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [levelId, router]);

  const handleBackButton = () => {
    router.push('/account/membership/upgrade');
  };

  const handleBackClick = () => {
    setShowBackConfirmationPopup(true);
  };

  const handleConfirmBack = () => {
    setShowBackConfirmationPopup(false);
    handleBackButton();
  };

  const handleCancelBack = () => {
    setShowBackConfirmationPopup(false);
  };

  const handleSwitch = async () => {
    if (!selectedPaymentMethod || !selectedPlan || switching) {
      return;
    }

    try {
      setSwitching(true);
      setSwitchError(null);

      const memberIdMap = {
        [MembershipLevelId.FREE]: '003',
        [MembershipLevelId.DAY]: '001', 
        [MembershipLevelId.MONTH]: '002',
        [MembershipLevelId.YEAR]: '004'
      };

      const newMembershipId = memberIdMap[selectedPlan.levelId];
      if (!newMembershipId) {
        throw new Error('Invalid membership plan selected');
      }

      const response: UpgradeResponse = await requestMembershipUpgrade(
        newMembershipId,
        selectedPaymentMethod.vaultTokenId,
        'immediate'
      );

      if (response.success) {
        // Check if approval is needed (e.g., PayPal wallet)
        if (response.approvalUrl) {
          // Redirect to PayPal for approval
          window.location.href = response.approvalUrl;
          return;
        }

        // Immediate success
        setSwitchSuccess(true);
        setEffectiveDate(response.effectiveDate || null);
        
        // Refresh membership data and redirect after a brief delay
        setTimeout(async () => {
          try {
            const updatedMembership = await getUserMembership();
            setMembership(updatedMembership);
          } catch (error) {
            console.warn('Failed to refresh membership:', error);
          }
          // Redirect to membership page after successful switch
          router.push('/account/membership');
        }, 2000); // Give users time to see the success message

      } else {
        // Create an error object that includes the transaction ID from the response
        const error = new Error(response.error || 'Switch failed');
        (error as any).transactionId = response.membershipHistoryId;
        throw error;
      }

    } catch (error: any) {
      setSwitchError(error.message || 'Failed to switch membership');
      // Extract transaction ID from error response or error object
      let transactionId = null;
      
      // Try to get transaction ID from different possible sources
      if (error.transactionId) {
        transactionId = error.transactionId;
      } else if (error.response?.data?.membershipHistoryId) {
        transactionId = error.response.data.membershipHistoryId;
      } else if (error.response?.membershipHistoryId) {
        transactionId = error.response.membershipHistoryId;
      }
      
      setTransactionId(transactionId);
    } finally {
      setSwitching(false);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleScholarshipWarningConfirm = () => {
    setShowScholarshipWarningPopup(false);
    // Continue with the plan change
  };

  const handleScholarshipWarningCancel = () => {
    setShowScholarshipWarningPopup(false);
    // Go back to the upgrade page
    router.push('/account/membership/upgrade');
  };

  const handleRetry = () => {
    // Reset error states and allow user to try again
    setSwitchError(null);
    setTransactionId(null);
    setSwitching(false);
    // User can now click the "Confirm Plan Selection" button again
  };

  // Button configuration for Payment component
  const paymentButtons: ButtonConfig[] = [
    {
      onClick: () => router.push('/account/payments'),
      text: 'Add payment method',
      disabled: false,
      loading: false,
      style: 'w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white'
    },
    {
      onClick: handleBackClick,
      text: 'Back',
      disabled: false,
      loading: false,
      style: 'w-full rounded-full px-6 py-5 text-center border border-primary-purple text-primary-purple'
    }
  ];

  if (loading) {
    return (
      <AuthorizedWrapper1
        pageTitle={authorizedWrapperTitles.AccountAndSettings}
        openedLink=""
      >
        <AccountAndSettingsNav currentPage={settingsNavigation.membership} />
        <div className="mt-4 w-full">
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            Loading plan details...
          </p>
        </div>
      </AuthorizedWrapper1>
    );
  }

  if (error || !selectedPlan) {
    return (
      <AuthorizedWrapper1
        pageTitle={authorizedWrapperTitles.AccountAndSettings}
        openedLink=""
      >
        <AccountAndSettingsNav currentPage={settingsNavigation.membership} />
        <div className="mt-4 w-full">
          <p className="text-red-600 text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            {error || "Plan not found"}
          </p>
          <button 
            onClick={handleBackButton}
            className="mt-4 text-primary-purple text-xl underline"
          >
            ← Back to membership
          </button>
        </div>
      </AuthorizedWrapper1>
    );
  }

  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <AccountAndSettingsNav currentPage={settingsNavigation.membership} />

      <div className="mt-4 w-full">
        {/* Back button */}
        <button 
          className="mb-6 flex items-center gap-2 text-primary-purple" 
          onClick={handleBackButton}
        >
          <Image
            className="h-5 w-5 shrink-0"
            src="../../../../memberships/upgrade/arrow_back_FILL0_wght400_GRAD0_opsz24 1.svg"
            alt="Back arrow"
            width={20}
            height={20}
          />
          Your membership
        </button>

        {switchSuccess ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/memberships/Payment/charm_circle-tick.svg"
                alt="Success"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <h1 className="font-montserrat text-5xl font-medium text-primary-brown 3xl:text-6xl 4xl:text-7xl">
                Payment Successful
              </h1>
            </div>
            <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">
              Great news! You&apos;re now on the {selectedPlan?.planName} Plan and have access to brand-new features waiting for you. {effectiveDate && (
                <>Effective date: {new Date(effectiveDate).toLocaleDateString()}</>
              )}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-montserrat text-5xl font-medium text-primary-brown 3xl:text-6xl 4xl:text-7xl">
              Select your plan
            </h1>
            <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">
              There are multiple membership you can choose from, select the one that best suits your interests.
            </p>
          </>
        )}
        
        
        <div className='mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1'></div>

        <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-9 md:max-w-[1000px]">
          <div className="flex flex-1 flex-col gap-6 rounded-xl bg-primary-skin p-6">
            <h1 className="font-montserrat text-2xl font-semibold text-primary-brown md:text-3xl">
              Selected plan
            </h1>

            <PlanCard
              plan={selectedPlan}
              uiConfig={MEMBERSHIP_UI_CONFIG[levelId]}
            />
            
            {/* Switch Preview */}
            {upgradePreview && upgradePreview.proration && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Switch Summary</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>Proration credit: ${upgradePreview.proration.prorationCredit.toFixed(2)}</div>
                  <div>Switch charge: ${upgradePreview.proration.upgradeCharge.toFixed(2)}</div>
                  <div className="font-semibold">Net amount: ${upgradePreview.proration.netAmount.toFixed(2)}</div>
                  <div>Effective date: {new Date(upgradePreview.effectiveDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            
            {/* Confirm Plan Selection Button */}
            {!switchSuccess && !switching && !switchError && (
              <div className="mt-4 flex w-full justify-end text-3xl gap-4 font-semibold">
                <button
                  type="button"
                  className="w-auto rounded-full bg-primary-purple px-6 py-5 text-center text-white"
                  onClick={handleSwitch}
                >
                  Confirm Plan Selection
                </button>
              </div>
            )}
            
          </div>

          <Payment
            mode="upgrade"
            membershipId={membership?.membershipId || ""}
            nextRenewalAt={membership?.nextRenewalAt}
            autoRenew={Boolean(membership?.autoRenew)}
            paymentMethodSummary={selectedPaymentMethod ? {
              brand: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 'paypal' : selectedPaymentMethod.maskedDetails.brand,
              last4: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 'paypal' : selectedPaymentMethod.maskedDetails.last4,
              expMonth: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 0 : (selectedPaymentMethod.maskedDetails.expiryMonth ? parseInt(selectedPaymentMethod.maskedDetails.expiryMonth) : 0),
              expYear: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 0 : (selectedPaymentMethod.maskedDetails.expiryYear ? parseInt(selectedPaymentMethod.maskedDetails.expiryYear) : 0)
            } : membership?.paymentMethodSummary}
            selectedPaymentMethod={selectedPaymentMethod || undefined}
            selectedPlan={selectedPlan}
            buttons={paymentButtons}
            onEditClick={() => setShowPaymentMethodPopup(true)}
            errorMessage={switchError || undefined}
            transactionId={transactionId || undefined}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {/* Back Confirmation Popup */}
      <Popup
        isOpen={showBackConfirmationPopup}
        type={PopupType.CANCEL_SWITCH}
        primaryButton={{
          onClick: handleConfirmBack,
          text: "Go Back"
        }}
        secondaryButton={{
          onClick: handleCancelBack,
          text: "Continue with Transaction"
        }}
      />

      {/* Payment Method Selection Popup */}
      <PaymentMethodSelectionPopup
        isOpen={showPaymentMethodPopup}
        onClose={() => setShowPaymentMethodPopup(false)}
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodSelect={handlePaymentMethodChange}
      />

      {/* Scholarship Warning Popup */}
      <Popup
        isOpen={showScholarshipWarningPopup}
        type={PopupType.SWITCH_FROM_SCHOLARSHIP}
        primaryButton={{
          onClick: handleScholarshipWarningCancel,
          text: "Stay on Scholarship"
        }}
        secondaryButton={{
          onClick: handleScholarshipWarningConfirm,
          text: "Change Plan"
        }}
      />
    </AuthorizedWrapper1>
  );
}
