"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import {
  authorizedWrapperTitles,
  settingsNavigation,
} from "@/utils/general";
import { getPlanInfo, getUserMembership, cancelUserMembership, toggleAutoRenew, getPaymentMethods, reactivateMembership } from "@/lib/api/membershipService";
import Payment from "./components/Payment";
import Popup from "./components/Popup";
import PlanCard from "./components/PlanCard";
import PaymentMethodSelectionPopup from "./components/PaymentMethodSelectionPopup";
import RenewMembership from "./components/RenewMembership";
import { UserMembership, MembershipStatus, MembershipLevelId, Plan, PaymentMethod } from "@/interfaces/membershipInterface";
import { formatRenewalDate, MEMBERSHIP_UI_CONFIG, ButtonConfig, PopupType } from "./config";
import "../../../../styles/primary-purple-scrollbar.css";

export default function Page() {
  const router = useRouter();
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isUpdatingAuto, setIsUpdatingAuto] = useState<boolean>(false);
  const [showCancelPopup, setShowCancelPopup] = useState<boolean>(false);
  const [showCancelAutopayPopup, setShowCancelAutopayPopup] = useState<boolean>(false);
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isReactivating, setIsReactivating] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [userMembership, paymentMethodsData] = await Promise.all([
          getUserMembership(),
          getPaymentMethods()
        ]);
        if (!isMounted) return;
        setMembership(userMembership);
        
        // Set payment methods and select default
        const methods = paymentMethodsData.data || [];
        setPaymentMethods(methods);
        const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault) || methods[0];
        setSelectedPaymentMethod(defaultMethod);
        
        if (userMembership?.levelId) {
          const planDetails = await getPlanInfo(userMembership.levelId);
          if (!isMounted) return;
          setPlan({ 
            ...planDetails, 
            isCurrent: true,
            isPopular: planDetails.levelId === MembershipLevelId.YEAR,
            yearlyPrice: (planDetails.price * (userMembership.levelId === MembershipLevelId.DAY ? 365 : (userMembership.levelId === MembershipLevelId.MONTH || userMembership.levelId === MembershipLevelId.YEAR ? 12 : 0))).toFixed(2)
          });
        }
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load membership info");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = async () => {
    try {
      const userMembership = await getUserMembership();
      setMembership(userMembership);
      if (userMembership?.levelId) {
        const planDetails = await getPlanInfo(userMembership.levelId);
        setPlan({ 
          ...planDetails, 
          isCurrent: true,
          isPopular: planDetails.levelId === MembershipLevelId.YEAR
        });
      }
    } catch (e) {}
  };

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await cancelUserMembership();
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to cancel membership');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelClick = () => {
    const isActive = membership?.status === MembershipStatus.ACTIVE;
    if (!isActive || isCancelling) return;
    setShowCancelPopup(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelPopup(false);
    handleCancel();
  };

  const handleKeepMembership = () => {
    setShowCancelPopup(false);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    // Here you could also update the payment method on the backend if needed
  };

  const handleToggleAutoRenew = async () => {
    try {
      setIsUpdatingAuto(true);
      await toggleAutoRenew();
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to update auto renew');
    } finally {
      setIsUpdatingAuto(false);
    }
  };

  const handleToggleClick = () => {
    if (!membership || isUpdatingAuto) return;
    
    if (membership.autoRenew) {
      // Show popup when trying to cancel autopay
      setShowCancelAutopayPopup(true);
    } else {
      // Enable autopay directly
      handleToggleAutoRenew();
    }
  };

  const handleConfirmCancelAutopay = () => {
    setShowCancelAutopayPopup(false);
    handleToggleAutoRenew();
  };

  const handleKeepAutopay = () => {
    setShowCancelAutopayPopup(false);
  };

  const handleReactivate = async () => {
    if (!membership || isReactivating) {
      return;
    }

    try {
      setIsReactivating(true);
      setError(null);

      const membershipId = membership.membershipId;
      const vaultTokenId = selectedPaymentMethod?.vaultTokenId || '';

      await reactivateMembership(membershipId, vaultTokenId);
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to reactivate membership');
    } finally {
      setIsReactivating(false);
    }
  };

  const formattedNextRenewal = useMemo(() => {
    return formatRenewalDate(membership?.nextRenewalAt);
  }, [membership?.nextRenewalAt]);

  const uiConfig = membership?.levelId ? MEMBERSHIP_UI_CONFIG[membership.levelId] : null;
  const isActive = membership?.status === MembershipStatus.ACTIVE;

  // Button configuration for Payment component
  const paymentButtons: ButtonConfig[] = membership?.status === MembershipStatus.CANCELLED ? [
    {
      onClick: handleReactivate,
      text: 'Reactivate Membership',
      disabled: isReactivating,
      loading: isReactivating,
      loadingText: 'Reactivating...',
      style: 'w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white'
    }
  ] : membership?.autoRenew ? [
    {
      onClick: () => router.push('/account/payments'),
      text: 'Add payment method',
      disabled: false,
      loading: false,
      style: 'w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white'
    },
    {
      onClick: handleToggleClick,
      text: 'Cancel auto pay',
      disabled: !isActive || isUpdatingAuto,
      loading: isUpdatingAuto,
      loadingText: 'Updating...',
      style: `w-full rounded-full px-6 py-5 text-center border ${
        (!isActive || isUpdatingAuto)
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-primary-purple text-primary-purple'
      }`
    }
  ] : [
    {
      onClick: handleToggleClick,
      text: 'Reactivate Autopay',
      icon: '/memberships/Payment/ic_round-autorenew.svg',
      disabled: !isActive || isUpdatingAuto,
      loading: isUpdatingAuto,
      loadingText: 'Updating...',
      style: 'w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white'
    }
  ];

  // Button configuration for membership actions
  const membershipButtons: ButtonConfig[] = [
    {
      onClick: () => router.push('/account/membership/upgrade'),
      text: 'Upgrade membership',
      disabled: false,
      loading: false,
      style: 'w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white md:flex-1'
    },
    {
      onClick: handleCancelClick,
      text: isCancelling ? 'Cancelling...' : (isActive ? 'Cancel Membership' : 'Cancelled'),
      disabled: !isActive || isCancelling,
      loading: isCancelling,
      loadingText: 'Cancelling...',
      style: `w-full rounded-full border px-6 py-5 text-center md:flex-1 ${
        isActive && !isCancelling
          ? "border-primary-purple text-primary-purple"
          : "border-gray-300 text-gray-400 cursor-not-allowed"
      }`
    }
  ];

  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <AccountAndSettingsNav currentPage={settingsNavigation.membership} />

      <div className="w-full">
        <h1 className="mt-[3vh] font-montserrat text-5xl font-medium text-primary-brown 3xl:text-6xl 4xl:text-7xl">
          {!loading && !error && membership && membership.status === MembershipStatus.CANCELLED 
            ? "Your Membership Has Been Canceled" 
            : "Your membership"
          }
        </h1>

        {loading && (
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            Loading your membership...
          </p>
        )}
        {!loading && error && (
          <p className="text-red-600 text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            {error}
          </p>
        )}
        {!loading && !error && membership && membership.status === MembershipStatus.CANCELLED && (
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            Your membership will remain active until <span className="font-semibold text-primary-orange">{formattedNextRenewal}</span>. After that, you&apos;ll lose access to member benefits.
          </p>
        )}

        {!loading && !error && membership && membership.status !== MembershipStatus.CANCELLED && (
          <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl font-medium pt-[1%]">
            {membership.autoRenew && formattedNextRenewal ? (
              <>
                As a valued member, your membership #{membership.membershipId} will be auto renewed on <span className="font-semibold text-primary-orange">{formattedNextRenewal}.</span>
              </>
            ) : (
              <>
                Renew your membership #{membership.membershipId} before <span className="font-semibold text-primary-orange">{formattedNextRenewal}</span> to enjoy uninterrupted fun and learning!
              </>
            )}
          </p>
        )}
        <div className='mt-[4vh] mb-[4vh] bg-[#FED2AA] h-1'></div>

        <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-9 md:max-w-[1000px]">
          {plan && uiConfig && (
            <div className="flex flex-1 flex-col gap-6 rounded-xl bg-primary-skin p-6">
              <h1 className="font-montserrat text-2xl font-semibold text-primary-brown md:text-3xl">
                Current membership
              </h1>

              <PlanCard
                plan={plan}
                uiConfig={uiConfig}
              />
              
              {/* Actions - Hide when auto-renew/autopay is off or membership is canceled */}
              {membership?.autoRenew && membership?.status === MembershipStatus.ACTIVE && (
                <div className="mt-4 flex w-full flex-col items-center text-3xl gap-4 md:flex-row font-semibold">
                  {membershipButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={button.disabled || button.loading}
                      className={button.style}
                      onClick={button.onClick}
                    >
                      {button.loading 
                        ? (button.loadingText || 'Loading...')
                        : button.text
                      }
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-6">
            {!membership?.autoRenew && (
              <RenewMembership
                nextRenewalAt={membership?.nextRenewalAt}
                onRenewClick={() => router.push('/account/membership/upgrade')}
              />
            )}
            <Payment
              mode="membership"
              membershipId={membership?.membershipId || ""}
              nextRenewalAt={membership?.nextRenewalAt}
              autoRenew={Boolean(membership?.autoRenew)}
              membershipStatus={membership?.status}
              paymentMethodSummary={selectedPaymentMethod ? {
                brand: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 'paypal' : selectedPaymentMethod.maskedDetails.brand,
                last4: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 'paypal' : selectedPaymentMethod.maskedDetails.last4,
                expMonth: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 0 : (selectedPaymentMethod.maskedDetails.expiryMonth ? parseInt(selectedPaymentMethod.maskedDetails.expiryMonth) : 0),
                expYear: selectedPaymentMethod.paymentMethodType?.toLowerCase() === 'paypal' ? 0 : (selectedPaymentMethod.maskedDetails.expiryYear ? parseInt(selectedPaymentMethod.maskedDetails.expiryYear) : 0)
              } : membership?.paymentMethodSummary}
              selectedPaymentMethod={selectedPaymentMethod || undefined}
              buttons={paymentButtons}
              onEditClick={() => setShowPaymentMethodPopup(true)}
            />
            
          </div>
        </div>
      </div>

      {/* Cancel Membership Popup */}
      <Popup
        isOpen={showCancelPopup}
        type={PopupType.CANCEL_MEMBERSHIP}
        primaryButton={{
          onClick: handleKeepMembership,
          text: "Keep Membership"
        }}
        secondaryButton={{
          onClick: handleConfirmCancel,
          text: "Cancel Anyway"
        }}
      />

      {/* Cancel Autopay Popup */}
      <Popup
        isOpen={showCancelAutopayPopup}
        type={PopupType.CANCEL_AUTOPAY}
        primaryButton={{
          onClick: handleKeepAutopay,
          text: "Keep Autopay"
        }}
        secondaryButton={{
          onClick: handleConfirmCancelAutopay,
          text: "Cancel Autopay"
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
    </AuthorizedWrapper1>
  );
}