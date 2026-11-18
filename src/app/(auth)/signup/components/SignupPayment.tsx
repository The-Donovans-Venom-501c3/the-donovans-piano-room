"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import SignupHeader from "./SignupHeader";
import Button1 from "@/components/atoms/Button1";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "@/components/payment/PaymentMethodForm";
import { addPaymentMethod } from "@/lib/api/membershipService";
import { completeSignup } from "@/lib/api/authService";
import {
  membershipChoiceAtom,
  membershipTypes,
  signupPaymentMethodAtom,
  signupStepAtom,
  profileAtom,
} from "@/utils/stores";

// Memberships that do not require a payment method during signup
const FREE_MEMBERSHIPS: string[] = [
  membershipTypes["scholarship"],
  membershipTypes["basic-access"],
];

// Membership IDs used by the backend when starting paid checkout / signup.
const MEMBERSHIP_IDS: Record<string, string | number> = {
  [membershipTypes["24-hours"]]: 1,
  [membershipTypes["monthly-access"]]: 2,
  [membershipTypes["scholarship"]]: "local-scholarship-001",
  [membershipTypes["yearly-access"]]: 4,
  [membershipTypes["basic-access"]]: 5,
};

export default function SignupPayment() {
  const setSignupStep = useSetAtom(signupStepAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const setPaymentMethod = useSetAtom(signupPaymentMethodAtom);
  const profile = useAtomValue(profileAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFreeMembership = FREE_MEMBERSHIPS.includes(membershipChoice);

  const handleNextStep = () => {
    setSignupStep(5);
  };

  const handleBackStep = () => {
    setSignupStep(3); // Navigates Jotai state directly back to Step 3 (Membership)
  };

  const handlePaymentSubmit = async (data: PaymentMethodFormData) => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      if (data.paymentMethodType === "paypal") {
        // Start the PayPal subscription approval for the selected plan. The
        // account/membership is created on the backend when PayPal redirects
        // back, so there is nothing to save locally before redirecting.
        const membershipId = MEMBERSHIP_IDS[membershipChoice];
        const signupEmail = profile?.email || data.paypalEmail;

        if (membershipId !== undefined && signupEmail) {
          const result = await completeSignup(signupEmail, membershipId);
          const payload = result?.data;

          if (!result.ok) {
            setErrorMessage(
              payload?.message ||
                "We couldn't start PayPal checkout. Please try again."
            );
            return;
          }

          if (payload?.approvalUrl) {
            window.location.href = payload.approvalUrl;
            return;
          }

          // Free/coupon signup completed without PayPal approval: the account
          // already exists and a session was started.
          window.location.href = "/dashboard?signup=success";
          return;
        }

        // Fallback for plans that don't use a PayPal subscription approval:
        // keep the legacy behaviour and continue to the summary step.
        const result = await addPaymentMethod({
          paymentMethodType: "paypal",
          paypalEmail: data.paypalEmail,
          email: signupEmail,
        });
        if (result?.approvalUrl) {
          window.location.href = result.approvalUrl;
          return;
        }
        setPaymentMethod({
          paymentMethodType: "paypal",
          paypalEmail: data.paypalEmail,
          vaultTokenId: result?.vaultTokenId || result?.data?.vaultTokenId,
        });
      } else {
        setPaymentMethod({
          paymentMethodType: "card",
          cardholderName: data.cardholderName,
          brand: data.brand,
          last4: data.last4,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          billingZip: data.billingZip,
        });
      }
      setSignupStep(5);
    } catch (error: any) {
      console.error("Payment step failed:", error);
      setErrorMessage(
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-[26vw] min-w-[420px] max-w-[560px] mx-auto py-6 flex flex-col justify-center">
      <SignupHeader
        navName="Membership"
        onBack={handleBackStep}
        stepNum={4}
        totalSteps={5}
        stepName={
          isFreeMembership ? "Payment method" : "Add your payment method"
        }
      />

      {/* Payment Form Area */}
      <div className="my-6">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 p-4 text-sm font-semibold text-red-200">
            {errorMessage}
          </div>
        )}
        {isFreeMembership ? (
          <div className="rounded-2xl bg-white/10 border border-white/20 p-6 text-white space-y-2">
            <p className="font-bold text-lg">No payment method required</p>
            <p className="text-sm text-purple-100">
              Your selected membership is free, so you can skip this step and
              continue to the summary.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#FFF9F0] p-6 shadow-lg">
            <PaymentMethodForm
              onSubmit={handlePaymentSubmit}
              isLoading={isSaving}
              submitLabel="Save & Continue"
            />
          </div>
        )}
      </div>

      {isFreeMembership && (
        <div className="pt-2 text-center">
          <Button1
            type="button"
            text="Continue to Summary"
            onClick={handleNextStep}
          />
        </div>
      )}
    </section>
  );
}