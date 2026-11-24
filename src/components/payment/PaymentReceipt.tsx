"use client";

import { useEffect, useState } from "react";
import {
  getPaymentHistory,
  type PaymentHistoryItem,
} from "@/lib/api/paymentHistoryService";

export interface PaymentReceiptItem {
  title: string;
  quantity: number;
  totalPrice?: number | null;
}

export interface PaymentReceiptProps {
  open: boolean;
  category: "membership" | "cart";
  title?: string;
  amount?: number | null;
  currency?: string;
  status?: string;
  transactionId?: string | null;
  effectiveDate?: string | null;
  items?: PaymentReceiptItem[];
  onClose: () => void;
}

function formatAmount(amount: number | string | null | undefined, currency = "USD") {
  const parsedAmount = amount == null ? null : Number(amount);
  const value = parsedAmount != null && Number.isFinite(parsedAmount) ? parsedAmount : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  } catch {
    return `$${value.toFixed(2)} ${currency || "USD"}`;
  }
}

export default function PaymentReceipt({
  open,
  category,
  title,
  amount,
  currency,
  status = "completed",
  transactionId,
  effectiveDate,
  items,
  onClose,
}: PaymentReceiptProps) {
  const [latest, setLatest] = useState<PaymentHistoryItem | null>(null);

  const shouldLoadLatest =
    amount == null && !transactionId && (!items || items.length === 0);

  useEffect(() => {
    if (!open) return;

    if (shouldLoadLatest) {
      void getPaymentHistory()
        .then((history) => {
          const match = history.find((entry) => entry.category === category);
          setLatest(match || null);
        })
        .catch(() => setLatest(null));
    } else {
      setLatest(null);
    }
  }, [open, category, amount, transactionId, shouldLoadLatest]);

  if (!open) return null;

  const receipt = latest;
  const receiptTitle = title || (category === "membership" ? "Membership payment" : "Cart order");
  const receiptAmount = amount ?? receipt?.amount ?? null;
  const receiptCurrency = currency || receipt?.currency || "USD";
  const receiptStatus = status || receipt?.status || "completed";
  const receiptTransactionId = transactionId || receipt?.transactionId || null;
  const receiptItems = items?.length
    ? items
    : receipt?.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })) || [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-receipt-heading"
    >
      <div className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary-purple">Payment receipt</p>
            <h2 id="payment-receipt-heading" className="mt-1 text-2xl font-extrabold text-primary-brown">
              Payment successful
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#D9CFC6] px-3 py-1 text-lg font-bold text-primary-brown hover:bg-[#FFF8F3]"
            aria-label="Close receipt"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[#F1DFC9] bg-[#FFF8F3] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-black">{receiptTitle}</p>
              <p className="mt-1 text-sm font-semibold capitalize text-primary-gray">
                {receiptStatus}
              </p>
            </div>
            <p className="text-2xl font-extrabold text-primary-brown">
              {formatAmount(receiptAmount, receiptCurrency)}
            </p>
          </div>

          {effectiveDate && (
            <p className="mt-3 text-sm font-semibold text-primary-gray">
              Effective date: {new Date(effectiveDate).toLocaleDateString()}
            </p>
          )}

          {receiptItems.length > 0 && (
            <div className="mt-4 border-t border-[#E8D4BC] pt-3">
              <p className="mb-2 text-sm font-bold text-primary-brown">Items</p>
              {receiptItems.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex items-center justify-between gap-3 py-1 text-sm text-primary-gray"
                >
                  <span>{item.quantity} × {item.title}</span>
                  {typeof item.totalPrice === "number" && (
                    <span className="font-semibold">
                      {formatAmount(item.totalPrice, receiptCurrency)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {receiptTransactionId && (
            <p className="mt-4 break-all border-t border-[#E8D4BC] pt-3 text-sm text-primary-gray">
              Transaction ID: <span className="font-semibold">{receiptTransactionId}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-primary-purple px-6 py-3 font-bold text-white hover:bg-[#601D86]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
