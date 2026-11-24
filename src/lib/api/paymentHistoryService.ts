export interface PaymentHistoryItem {
  id: string;
  date: string | Date;
  amount: number | string | null;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentType: string | null;
  category: "membership" | "cart" | "other";
  transactionId: string | null;
  comments: string | null;
  taxAmount: number | null;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
  }>;
}

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const response = await fetch("/api/payment-methods/history", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to retrieve payment history");
  }

  return Array.isArray(data?.data) ? data.data : [];
}
