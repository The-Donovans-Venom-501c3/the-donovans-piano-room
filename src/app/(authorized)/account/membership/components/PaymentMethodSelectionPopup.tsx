"use client";
import Image from "next/image";
import { PaymentMethod } from "@/interfaces/membershipInterface";
import { getPaymentMethodIcon } from "../config";

interface PaymentMethodSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  isBeta?: boolean; // Controls Beta UI state
}

export default function PaymentMethodSelectionPopup({
  isOpen,
  onClose,
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  isBeta = true, // Default to true for Beta Launch
}: PaymentMethodSelectionPopupProps) {
  // Removed unused `useRouter` import and declaration

  if (!isOpen) return null;

  // Filter valid payment methods safely
  const validMethods = paymentMethods ? paymentMethods.filter((method) => method && method.maskedDetails) : [];

  const handleMethodSelect = (method: PaymentMethod) => {
    onPaymentMethodSelect(method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-[#FFF2E5] rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Select Payment Method</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Image src="/Close.svg" alt="Close" width={24} height={24} />
          </button>
        </div>
        
        {/* Payment Methods List */}
        <div className="space-y-4 mb-8">
          {isBeta || validMethods.length === 0 ? (
            /* Empty State / Beta Notice */
            <div className="py-8 text-center text-primary-gray text-xl bg-white/50 rounded-xl p-6 border border-[#F6E2D1]">
              <p className="font-semibold text-primary-brown mb-1">No Saved Payment Methods</p>
              <p className="text-lg">Payment methods are not collected or required during <span className="font-medium text-tertiary-orange">The Piano Room Beta</span>.</p>
            </div>
          ) : (
            validMethods.map((method) => (
              <div
                key={method.vaultTokenId}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPaymentMethod?.vaultTokenId === method.vaultTokenId
                    ? 'border-primary-purple bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod?.vaultTokenId === method.vaultTokenId}
                        onChange={() => handleMethodSelect(method)}
                        className="w-5 h-5 text-primary-purple"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`relative flex h-[38px] w-[58px] items-center justify-center ${
                        method.paymentMethodType?.toLowerCase() === 'paypal' 
                          ? '' 
                          : 'rounded-3xl border-[#CCCCCC] bg-white'
                      }`}>
                        <Image
                          src={getPaymentMethodIcon(method.paymentMethodType?.toLowerCase() === 'paypal' ? 'paypal' : (method.maskedDetails?.brand || ''))}
                          fill
                          alt={method.paymentMethodType?.toLowerCase() === 'paypal' ? 'PayPal' : (method.maskedDetails?.brand || 'Card')}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-black text-xl">
                          {method.paymentMethodType?.toLowerCase() === 'paypal' ? 'PayPal Account' : (method.maskedDetails?.displayName || 'Payment Method')}
                        </div>
                        <div className="text-lg text-primary-gray">
                          {method.paymentMethodType?.toLowerCase() === 'paypal' ? (
                            method.maskedDetails?.paypal_account || '@unknown paypal account'
                          ) : (method.maskedDetails?.last4 ? `Ending in ${method.maskedDetails.last4}` : '')}
                        </div>
                        {method.isDefault && (
                          <div className="text-xl text-primary-purple font-medium">Default</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {method.isExpired && (
                    <div className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">Expired</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}