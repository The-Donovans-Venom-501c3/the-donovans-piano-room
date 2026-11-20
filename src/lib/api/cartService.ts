import { bookCartItemInterface } from "@/interfaces/bookInterface";

export type CheckoutProvider = "card" | "paypal" | "venmo";

export interface CartQuoteItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  discount: number;
}

export interface CartQuoteResponse {
  success?: boolean;
  items?: CartQuoteItem[];
  itemTotal?: number;
  subtotal?: number;
  discount?: number;
  discountAmt?: number;
  shipping?: number;
  total?: number;
  totalAmt?: number;
  couponCode?: string | null;
  message?: string;
  error?: string;
}

export interface CheckoutResponse extends CartQuoteResponse {
  orderId?: string;
  approvalUrl?: string;
  amount?: number;
  currency?: string;
}

function toCartPayload(items: bookCartItemInterface[]) {
  return {
    items: items.map((item) => ({
      product_id: item.id,
      name: item.title,
      quantity: item.quantity,
      // Display hint only - the backend re-prices the book before charging.
      price: item.price,
    })),
  };
}

export async function quoteCart(
  items: bookCartItemInterface[],
  couponCode?: string,
): Promise<CartQuoteResponse> {
  try {
    const response = await fetch("/api/cart/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cart: toCartPayload(items),
        couponCode: couponCode?.trim() || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
      throw new Error(data.error || data.message || "Could not apply coupon");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Could not apply coupon");
  }
}

export async function checkoutCart(
  provider: CheckoutProvider,
  items: bookCartItemInterface[],
  couponCode?: string,
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
        cart: toCartPayload(items),
        couponCode: couponCode?.trim() || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
      throw new Error(data.error || data.message || "Checkout failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during checkout");
  }
}
