"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import SignupHeader from "./SignupHeader";
import Button1 from "@/components/atoms/Button1";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "@/components/payment/PaymentMethodForm";
import {
  membershipChoiceAtom,
  membershipTypes,
  signupPaymentMethodAtom,
  signupStepAtom,
} from "@/utils/stores";

const FREE_MEMBERSHIPS: string[] = [
  membershipTypes["scholarship"],
  membershipTypes["basic-access"],
];

export default function SignupPayment() {
  const setSignupStep = useSetAtom(signupStepAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const setPaymentMethod = useSetAtom(signupPaymentMethodAtom);
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
        setPaymentMethod({
          paymentMethodType: "paypal",
          paypalEmail: data.paypalEmail,
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