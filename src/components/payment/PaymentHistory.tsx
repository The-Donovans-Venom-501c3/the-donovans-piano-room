"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPaymentHistory,
  type PaymentHistoryItem,
} from "@/lib/api/paymentHistoryService";

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function formatAmount(amount: number | null, currency: string) {
  const value = typeof amount === "number" ? amount : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  } catch {
    return `$${value.toFixed(2)} ${currency || "USD"}`;
  }
}

export default function PaymentHistory() {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getPaymentHistory());
    } catch (loadError: any) {
      setItems([]);
      setError(loadError?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <section className="mt-12" aria-labelledby="payment-history-heading">
      <h2
        id="payment-history-heading"
        className="font-montserrat text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight mb-4"
      >
        Payment history
      </h2>

      {loading ? (
        <p className="text-primary-gray text-xl font-medium">Loading payment history...</p>
      ) : error ? (
        <div className="rounded-2xl bg-white border border-[#F6E2D1] p-8 text-center">
          <p className="text-red-600 text-xl font-semibold mb-2">{error}</p>
          <button
            type="button"
            onClick={() => void loadHistory()}
            className="text-primary-purple text-lg font-bold underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#F6E2D1] p-10 text-center">
          <p className="text-2xl font-bold text-primary-brown mb-2">
            No payment history yet
          </p>
          <p className="text-lg text-primary-gray">
            Your payment history will appear here after membership payments or shop orders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border-2 border-[#F6E2D1] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-black text-xl">
                      {item.category === "membership"
                        ? "Membership payment"
                        : item.category === "cart"
                          ? "Cart order"
                          : "Payment"}
                    </p>
                    <span className="rounded-lg bg-[#F1E8FF] px-2 py-0.5 text-xs font-black text-primary-purple capitalize">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-xs font-bold capitalize ${
                        item.status?.toLowerCase() === "completed" ||
                        item.status?.toLowerCase() === "captured"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status || "Unknown"}
                    </span>
                  </div>
                  <p className="mt-1 text-primary-gray font-semibold">
                    {formatDate(item.date)}
                    {item.paymentMethod
                      ? ` · ${item.paymentMethod.replaceAll("_", " ")}`
                      : ""}
                  </p>
                </div>
                <p className="text-xl font-bold text-black shrink-0">
                  {formatAmount(item.amount, item.currency)}
                </p>
              </div>

              {item.category === "cart" && item.items.length > 0 && (
                <div className="mt-4 rounded-xl bg-[#FFF8F3] px-4 py-3">
                  <p className="text-sm font-bold text-primary-brown mb-1">Items</p>
                  {item.items.map((cartItem, index) => (
                    <p
                      key={`${item.id}-${cartItem.title}-${index}`}
                      className="text-sm text-primary-gray"
                    >
                      {cartItem.quantity} × {cartItem.title}
                      {typeof cartItem.totalPrice === "number" &&
                        ` · ${formatAmount(cartItem.totalPrice, item.currency)}`}
                    </p>
                  ))}
                </div>
              )}

              {item.transactionId && (
                <p className="mt-3 text-sm text-primary-gray break-all">
                  Transaction ID:{" "}
                  <span className="font-semibold">{item.transactionId}</span>
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
