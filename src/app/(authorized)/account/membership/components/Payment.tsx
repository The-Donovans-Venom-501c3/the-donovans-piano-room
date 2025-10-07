import Image from "next/image";
import { useRouter } from "next/navigation";
import { PaymentMethodSummary, PaymentMethodBrand, Plan, PaymentMethod } from "@/interfaces/membershipInterface";
import { getPaymentMethodIcon, formatRenewalDate, ButtonConfig } from "@/app/(authorized)/account/membership/config";

type PaymentMode = 'membership' | 'upgrade';

interface PaymentProps {
  mode: PaymentMode;
  membershipId: string;
  nextRenewalAt?: string;
  autoRenew?: boolean;
  membershipStatus?: string; // for determining if membership is cancelled
  paymentMethodSummary?: PaymentMethodSummary;
  selectedPaymentMethod?: PaymentMethod;
  buttons?: ButtonConfig[];
  selectedPlan?: Plan; // for upgrade mode
  onEditClick?: () => void; // for custom edit behavior
  errorMessage?: string; // for displaying error messages
  transactionId?: string; // for displaying transaction ID with error
  onRetry?: () => void; // for retry functionality
}

export default function Payment({
  mode,
  membershipId,
  nextRenewalAt,
  autoRenew,
  membershipStatus,
  paymentMethodSummary,
  selectedPaymentMethod,
  selectedPlan,
  buttons,
  onEditClick,
  errorMessage,
  transactionId,
  onRetry,
}: PaymentProps) {
  const router = useRouter();
  const formattedDate = formatRenewalDate(nextRenewalAt);
  const brandImageSrc = getPaymentMethodIcon(paymentMethodSummary?.brand || '');

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl bg-primary-skin p-6 h-full">
      <h1 className={`font-montserrat text-3xl font-semibold md:text-3xl flex items-center ${
        errorMessage ? 'text-red-500' : 'text-primary-brown'
      }`}>
        {errorMessage ? (
          'Oops! Something went wrong with your payment.'
        ) : mode === 'membership' ? (
          <>
            <Image src="/memberships/Payment/ic_round-autorenew.svg" alt="Auto renew payment" width={20} height={20} />
            <span className="ml-2">Auto renew payment</span>
          </>
        ) : (
          'Select Payment Method'
        )}
      </h1>

{errorMessage ? (
        <div className="text-primary-black text-2xl">
          <p className="mb-4">
            We couldn&apos;t process your payment this time. Don&apos;t worry—this happens sometimes.
          </p>
          <p className="mb-3">Here are a few things you can try:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Double-check your card details (number, expiry, CVV).</li>
            <li>Make sure your bank or card provider hasn&apos;t blocked the payment.</li>
            <li>Try another payment method if you have one.</li>
          </ul>
          
          <p className="mt-4">
            Transaction ID: {transactionId ? transactionId : "unknown"} {/* TODO: Fix transaction ID here */}
          </p>
          
        </div>
      ) : mode === 'membership' ? (
        membershipStatus === 'cancelled' ? (
          <p className="text-2xl font-semibold text-tertiary-orange">
            Cancelled
          </p>
        ) : autoRenew && formattedDate ? (
          <p className="text-2xl text-primary-black">
            Your Membership <span className="font-medium">#{membershipId}</span> will be
            auto renewed on <span className="font-semibold text-tertiary-orange">{formattedDate}</span>.
          </p>
        ) : (
          <p className="text-2xl font-semibold text-tertiary-orange">
            Cancelled
          </p>
        )
      ) : (
        <p className="text-2xl text-primary-black">
          Select a payment method or add new to change your membership to a <span className="font-semibold text-tertiary-orange">{selectedPlan?.planName || 'Yearly'} Plan</span>.
        </p>
      )}


      {/* Payment method card - only show when there's no error */}
      {!errorMessage && (
        <div className="rounded-2xl border border-[#F6E2D1] bg-[#FFEBD5] p-4 shadow-custom">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`relative flex h-[38px] w-[58px] items-center justify-center ${
                paymentMethodSummary?.brand?.toLowerCase() === 'paypal' 
                  ? '' 
                  : 'rounded-3xl border-[#CCCCCC] bg-white'
              }`}>
                <Image
                  src={brandImageSrc}
                  fill
                  alt={paymentMethodSummary?.brand || 'Card'}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                {paymentMethodSummary?.brand?.toLowerCase() === 'paypal' ? (
                  <>
                    <div className="text-2xl font-semibold text-primary-brown leading-6">
                      PayPal Account
                    </div>
                    <div className="text-xl text-primary-gray">
                      {selectedPaymentMethod?.maskedDetails?.paypal_account || '@unknown paypal account'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-semibold text-primary-brown leading-6">
                      Ending in <span className="text-tertiary-orange">{paymentMethodSummary?.last4 || '----'}</span>
                    </div>
                    <div className="text-xl text-primary-gray">
                      Expires {paymentMethodSummary?.expMonth?.toString().padStart(2, '0') || '--'}/{paymentMethodSummary?.expYear || '----'}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button type="button" className="inline-flex items-center gap-2 text-primary-purple" onClick={onEditClick || (() => router.push('/account/payments'))}>
              <span className="text-xl font-medium">Edit</span>
              <Image
                src="/memberships/Payment/pencil-outline.svg"
                width={14}
                height={14}
                alt="Edit payment method"
              />
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      {errorMessage && onRetry ? (
        <div className="mt-4 flex w-full justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white font-semibold text-3xl hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : buttons && buttons.length > 0 && (
        <div className="mt-4 flex w-full flex-col items-center text-3xl gap-4 md:flex-row font-semibold">
          {buttons.map((button, index) => (
            <div key={index} className="w-full md:flex-1">
              {/* Button Message */}
              {button.message && (
                <p className="mb-2 text-sm text-gray-600 text-center">
                  {button.message}
                </p>
              )}
              
              {/* Button */}
              <button
                type="button"
                disabled={button.disabled || button.loading}
                className={button.style || `w-full rounded-full px-6 py-5 text-center ${
                  (button.disabled || button.loading)
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-primary-purple text-white'
                }`}
                onClick={button.onClick}
              >
                {button.loading ? (
                  button.loadingText || 'Loading...'
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {button.icon && (
                      <Image
                        src={button.icon}
                        alt=""
                        width={22}
                        height={22}
                        className="shrink-0 brightness-0 invert"
                      />
                    )}
                    <span>{button.text || 'Button'}</span>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
