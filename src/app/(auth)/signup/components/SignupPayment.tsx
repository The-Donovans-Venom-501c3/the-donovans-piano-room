"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import SignupHeader from "./SignupHeader";
import Button1 from "@/components/atoms/Button1";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "@/components/payment/PaymentMethodForm";
import { addPaymentMethod } from "@/lib/api/membershipService";
import {
  membershipChoiceAtom,
  membershipTypes,
  signupPaymentMethodAtom,
  signupStepAtom,
} from "@/utils/stores";

// Memberships that do not require a payment method during signup
const FREE_MEMBERSHIPS: string[] = [
  membershipTypes["scholarship"],
  membershipTypes["basic-access"],
];

export default function SignupPayment() {
  const setSignupStep = useSetAtom(signupStepAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const setPaymentMethod = useSetAtom(signupPaymentMethodAtom);
  const [isSaving, setIsSaving] = useState(false);

  const isFreeMembership = FREE_MEMBERSHIPS.includes(membershipChoice);

  const handleNextStep = () => {
    setSignupStep(5);
  };

  const handleBackStep = () => {
    setSignupStep(3); // Navigates Jotai state directly back to Step 3 (Membership)
  };

  const handlePaymentSubmit = async (data: PaymentMethodFormData) => {
    setIsSaving(true);
    try {
      if (data.paymentMethodType === "paypal") {
        // TODO(backend): POST /api/payment-methods should create a PayPal billing
        // agreement and return { approvalUrl } to redirect the user to PayPal for
        // authorization. Until it does, don't mark a method as saved.
        const result = await addPaymentMethod({
          paymentMethodType: "paypal",
          paypalEmail: data.paypalEmail,
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