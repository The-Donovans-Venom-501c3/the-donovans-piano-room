"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, settingsNavigation } from "@/utils/general";
import {
  addPaymentMethod,
  getPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "@/lib/api/membershipService";
import { PaymentMethod } from "@/interfaces/membershipInterface";
import { getPaymentMethodIcon } from "@/app/(authorized)/account/membership/config";
import PaymentMethodForm, {
  PaymentMethodFormData,
} from "@/components/payment/PaymentMethodForm";
import "@/styles/primary-purple-scrollbar.css";

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [busyToken, setBusyToken] = useState<string | null>(null);
  const [confirmRemoveToken, setConfirmRemoveToken] = useState<string | null>(null);

  const loadPaymentMethods = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getPaymentMethods();
      setPaymentMethods(Array.isArray(res?.data) ? res.data : []);
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load payment methods");
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPaymentMethods();
  }, [loadPaymentMethods]);

  const resetFeedback = () => {
    setActionError(null);
    setActionMessage(null);
  };

  const handleAdd = async (data: PaymentMethodFormData) => {
    setSaving(true);
    resetFeedback();
    try {
      const result = await addPaymentMethod({
        ...data,
        setAsDefault: paymentMethods.length === 0,
      });
      // PayPal requires a redirect to finish authorizing the billing agreement.
      // If the backend doesn't return an approvalUrl yet, surface a clear error
      // instead of claiming the method was saved.
      if (result?.approvalUrl) {
        window.location.href = result.approvalUrl;
        return;
      }
      if (data.paymentMethodType === "paypal" && !result?.vaultTokenId && !result?.data?.vaultTokenId) {
        throw new Error(
          "PayPal authorization isn't available yet — the backend must return an approvalUrl."
        );
      }
      setShowAddForm(false);
      setActionMessage("Payment method added.");
      await loadPaymentMethods();
    } catch (e: any) {
      setActionError(e?.message || "Could not add the payment method");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (vaultTokenId: string) => {
    setBusyToken(vaultTokenId);
    resetFeedback();
    try {
      await setDefaultPaymentMethod(vaultTokenId);
      setActionMessage("Default payment method updated.");
      await loadPaymentMethods();
    } catch (e: any) {
      setActionError(e?.message || "Could not update the default payment method");
    } finally {
      setBusyToken(null);
    }
  };

  const handleRemove = async (vaultTokenId: string) => {
    setBusyToken(vaultTokenId);
    resetFeedback();
    try {
      await removePaymentMethod(vaultTokenId);
      setConfirmRemoveToken(null);
      setActionMessage("Payment method removed.");
      await loadPaymentMethods();
    } catch (e: any) {
      setActionError(e?.message || "Could not remove the payment method");
    } finally {
      setBusyToken(null);
    }
  };

  const isPaypal = (method: PaymentMethod) =>
    method.paymentMethodType?.toLowerCase() === "paypal";

  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <div className="h-full overflow-y-auto primary-purple-scrollbar pb-12 bg-[#FFF8F3]">
        <AccountAndSettingsNav currentPage={settingsNavigation.paymentMethods} />

        <div className="w-full max-w-[1112px] mx-auto px-4 sm:px-6 mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-[#292524] tracking-tight">
                Payment methods
              </h1>
              <p className="mt-1.5 text-[#3B3531] font-semibold text-base sm:text-lg">
                Add, remove, and choose the default payment method used for membership charges.
              </p>
            </div>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => {
                  resetFeedback();
                  setShowAddForm(true);
                }}
                className="rounded-full bg-primary-purple px-6 py-3 text-white text-base font-bold hover:bg-[#601D86] transition-colors cursor-pointer shadow-md"
              >
                + Add payment method
              </button>
            )}
          </div>

          <div className="mt-6 border-b-2 border-[#F5E1C8] w-full mb-6" />

          {actionError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 font-semibold">
              {actionError}
            </div>
          )}
          {actionMessage && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 font-semibold">
              {actionMessage}
            </div>
          )}

          {showAddForm && (
            <div className="mb-8 rounded-2xl bg-[#FFF9F0] border border-[#F6E2D1] p-6 shadow-sm max-w-xl">
              <h2 className="text-2xl font-bold text-primary-brown mb-4">
                Add a payment method
              </h2>
              <PaymentMethodForm
                onSubmit={handleAdd}
                onCancel={() => {
                  setShowAddForm(false);
                  resetFeedback();
                }}
                isLoading={saving}
              />
            </div>
          )}

          {loading ? (
            <p className="text-primary-gray text-xl font-medium">Loading payment methods...</p>
          ) : loadError ? (
            <div className="rounded-2xl bg-white border border-[#F6E2D1] p-8 text-center">
              <p className="text-red-600 text-xl font-semibold mb-2">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadPaymentMethods()}
                className="text-primary-purple text-lg font-bold underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#F6E2D1] p-10 text-center">
              <p className="text-2xl font-bold text-primary-brown mb-2">
                No payment methods yet
              </p>
              <p className="text-lg text-primary-gray mb-6">
                Add a card or link your PayPal account to pay for memberships and shop orders.
              </p>
              {!showAddForm && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="rounded-full bg-primary-purple px-8 py-3.5 text-white text-lg font-bold hover:bg-[#601D86] transition-colors cursor-pointer shadow-md"
                >
                  Add your first payment method
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const busy = busyToken === method.vaultTokenId;
                const confirming = confirmRemoveToken === method.vaultTokenId;
                return (
                  <div
                    key={method.vaultTokenId}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 bg-white p-5 transition-all ${
                      method.isDefault ? "border-primary-purple shadow-md" : "border-[#F6E2D1]"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`relative flex h-[38px] w-[58px] shrink-0 items-center justify-center ${
                          isPaypal(method) ? "" : "rounded-3xl border-[#CCCCCC] bg-white"
                        }`}
                      >
                        <Image
                          src={getPaymentMethodIcon(
                            isPaypal(method) ? "paypal" : method.maskedDetails?.brand || ""
                          )}
                          fill
                          alt={isPaypal(method) ? "PayPal" : method.maskedDetails?.brand || "Card"}
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-black text-xl">
                            {isPaypal(method)
                              ? "PayPal Account"
                              : method.maskedDetails?.displayName || "Payment Method"}
                          </p>
                          {method.isDefault && (
                            <span className="rounded-lg bg-primary-purple px-2 py-0.5 text-xs font-black text-white">
                              Default
                            </span>
                          )}
                          {method.isExpired && (
                            <span className="rounded-lg bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                              Expired
                            </span>
                          )}
                        </div>
                        <p className="text-lg text-primary-gray">
                          {isPaypal(method)
                            ? method.maskedDetails?.paypal_account || "Linked PayPal account"
                            : method.maskedDetails?.last4
                            ? `Ending in ${method.maskedDetails.last4}${
                                method.maskedDetails?.expiryMonth
                                  ? ` · Expires ${method.maskedDetails.expiryMonth}/${method.maskedDetails.expiryYear || "----"}`
                                  : ""
                              }`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {!method.isDefault && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handleSetDefault(method.vaultTokenId)}
                          className="rounded-full border border-primary-purple px-5 py-2 text-primary-purple font-bold hover:bg-[#FBF5FF] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {busy && !confirming ? "Working..." : "Set as default"}
                        </button>
                      )}
                      {confirming ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleRemove(method.vaultTokenId)}
                            className="rounded-full bg-red-600 px-5 py-2 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60"
                          >
                            {busy ? "Removing..." : "Confirm remove"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirmRemoveToken(null)}
                            className="rounded-full border border-gray-300 px-5 py-2 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                          >
                            Keep
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            resetFeedback();
                            setConfirmRemoveToken(method.vaultTokenId);
                          }}
                          className="rounded-full border border-red-300 px-5 py-2 text-red-600 font-bold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthorizedWrapper1>
  );
}
