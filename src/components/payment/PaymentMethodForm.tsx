"use client";

import { FormEvent, useState } from "react";

/**
 * Reusable payment-method entry form (credit/debit card or PayPal).
 *
 * TODO(backend/payments): This form currently collects raw card data for UI
 * development only. Before going live, swap the card inputs for a PSP-hosted
 * solution (Stripe PaymentElement, Braintree Hosted Fields, PayPal Buttons, ...)
 * so raw PAN/CVV never touches our servers. The submit handler should then emit
 * the PSP token/nonce instead of `cardNumber`/`cvv`.
 */

export interface CardPaymentData {
  paymentMethodType: "card";
  cardholderName: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  billingZip: string;
  cardNumber: string; // TODO(backend/payments): replace with PSP token/nonce
  cvv: string; // TODO(backend/payments): replace with PSP token/nonce
}

export interface PaypalPaymentData {
  paymentMethodType: "paypal";
  paypalEmail: string;
}

export type PaymentMethodFormData = CardPaymentData | PaypalPaymentData;

export function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^6/.test(digits)) return "discover";
  return "default";
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

type FormErrors = Partial<Record<string, string>>;

interface PaymentMethodFormProps {
  onSubmit: (data: PaymentMethodFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  allowPayPal?: boolean;
  /** Show the credit/debit card entry form. Disabled by default — the raw card
   *  inputs are NOT PCI-compliant and must be replaced with PSP-hosted fields
   *  (Stripe PaymentElement, Braintree Hosted Fields, ...) before enabling. */
  allowCard?: boolean;
}

const inputClasses =
  "w-full rounded-xl border border-[#391f0f]/30 bg-[#FFFDF5] px-4 py-3 text-[15px] font-medium text-[#391f0f] placeholder:text-[#391f0f]/40 focus:outline-none focus:border-primary-purple transition-colors";

export default function PaymentMethodForm({
  onSubmit,
  onCancel,
  submitLabel = "Save payment method",
  isLoading = false,
  allowPayPal = true,
  allowCard = false,
}: PaymentMethodFormProps) {
  const [methodType, setMethodType] = useState<"card" | "paypal">(
    allowCard ? "card" : "paypal"
  );
  const showMethodToggle = allowCard && allowPayPal;
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateCard = (): FormErrors => {
    const next: FormErrors = {};
    const digits = cardNumber.replace(/\D/g, "");

    if (!cardholderName.trim()) {
      next.cardholderName = "Name on card is required";
    }
    if (!/^\d{15,16}$/.test(digits) || !luhnCheck(digits)) {
      next.cardNumber = "Enter a valid card number";
    }

    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      next.expiry = "Use MM/YY";
    } else {
      const month = parseInt(match[1], 10);
      const year = 2000 + parseInt(match[2], 10);
      const now = new Date();
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);
      if (month < 1 || month > 12) {
        next.expiry = "Invalid month";
      } else if (endOfMonth < now) {
        next.expiry = "Card is expired";
      }
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      next.cvv = "3–4 digits";
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9\- ]{2,9}$/.test(billingZip.trim())) {
      next.billingZip = "Enter a valid ZIP/postal code";
    }
    return next;
  };

  const validatePaypal = (): FormErrors => {
    const next: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail.trim())) {
      next.paypalEmail = "Enter a valid PayPal email";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (methodType === "paypal") {
      const next = validatePaypal();
      setErrors(next);
      if (Object.keys(next).length > 0) return;
      await onSubmit({ paymentMethodType: "paypal", paypalEmail: paypalEmail.trim() });
      return;
    }

    const next = validateCard();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const digits = cardNumber.replace(/\D/g, "");
    await onSubmit({
      paymentMethodType: "card",
      cardholderName: cardholderName.trim(),
      brand: detectCardBrand(digits),
      last4: digits.slice(-4),
      expiryMonth: expiry.slice(0, 2),
      expiryYear: `20${expiry.slice(3, 5)}`,
      billingZip: billingZip.trim(),
      cardNumber: digits,
      cvv,
    });
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="mt-1 text-xs font-semibold text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {showMethodToggle && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMethodType("card");
              setErrors({});
            }}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all cursor-pointer ${
              methodType === "card"
                ? "bg-primary-purple text-white shadow-md"
                : "bg-white text-primary-purple border border-primary-purple hover:bg-[#FBF5FF]"
            }`}
          >
            Card
          </button>
          <button
            type="button"
            onClick={() => {
              setMethodType("paypal");
              setErrors({});
            }}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all cursor-pointer ${
              methodType === "paypal"
                ? "bg-primary-purple text-white shadow-md"
                : "bg-white text-primary-purple border border-primary-purple hover:bg-[#FBF5FF]"
            }`}
          >
            PayPal
          </button>
        </div>
      )}

      {methodType === "card" && allowCard ? (
        <>
          <div>
            <label htmlFor="pm-cardholder" className="mb-1 block text-xs font-bold text-[#391f0f]">
              Name on card
            </label>
            <input
              id="pm-cardholder"
              type="text"
              autoComplete="cc-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Full name"
              className={inputClasses}
            />
            {fieldError("cardholderName")}
          </div>

          <div>
            <label htmlFor="pm-cardnumber" className="mb-1 block text-xs font-bold text-[#391f0f]">
              Card number
            </label>
            <input
              id="pm-cardnumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className={inputClasses}
            />
            {fieldError("cardNumber")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pm-expiry" className="mb-1 block text-xs font-bold text-[#391f0f]">
                Expiry (MM/YY)
              </label>
              <input
                id="pm-expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                className={inputClasses}
              />
              {fieldError("expiry")}
            </div>
            <div>
              <label htmlFor="pm-cvv" className="mb-1 block text-xs font-bold text-[#391f0f]">
                Security code (CVV)
              </label>
              <input
                id="pm-cvv"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                className={inputClasses}
              />
              {fieldError("cvv")}
            </div>
          </div>

          <div>
            <label htmlFor="pm-zip" className="mb-1 block text-xs font-bold text-[#391f0f]">
              Billing ZIP / postal code
            </label>
            <input
              id="pm-zip"
              type="text"
              autoComplete="postal-code"
              value={billingZip}
              onChange={(e) => setBillingZip(e.target.value)}
              placeholder="ZIP code"
              className={inputClasses}
            />
            {fieldError("billingZip")}
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="pm-paypal-email" className="mb-1 block text-xs font-bold text-[#391f0f]">
              PayPal email
            </label>
            <input
              id="pm-paypal-email"
              type="email"
              autoComplete="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
            {fieldError("paypalEmail")}
          </div>
          <p className="text-sm text-[#391f0f]/70 font-medium">
            You&apos;ll be redirected to PayPal to authorize this payment method.
          </p>
        </>
      )}

      <div className="mt-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-full py-3.5 text-center text-base font-bold transition-all ${
            isLoading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-primary-purple text-white hover:bg-[#601D86] cursor-pointer"
          }`}
        >
          {isLoading ? "Saving..." : methodType === "paypal" ? "Continue with PayPal" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full rounded-full border border-primary-purple py-3.5 text-center text-base font-bold text-primary-purple hover:bg-[#FBF5FF] transition-all cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
