import { bookCartItemInterface } from "@/interfaces/bookInterface";
import type { BillingAddressData } from "@/app/cart/components/PaymentForm";

export type CheckoutProvider = "card" | "paypal" | "venmo";

export interface CheckoutResponse {
  success?: boolean;
  orderId?: string;
  approvalUrl?: string; // redirect target for PayPal/Venmo authorization
  message?: string;
}

// TODO(backend): implement POST /api/cart/checkout — price the cart server-side,
// create the order (including billingAddress), and charge/authorize via the PSP.
// Return { approvalUrl } when the provider requires a redirect (PayPal/Venmo),
// or { orderId } on successful card capture.
export async function checkoutCart(
  provider: CheckoutProvider,
  items: bookCartItemInterface[],
  billingAddress?: BillingAddressData | null,
): Promise<CheckoutResponse> {
  try {
    const response = await fetch("/api/cart/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        provider,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        ...(billingAddress ? { billingAddress } : {}),
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Checkout failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during checkout");
  }
}