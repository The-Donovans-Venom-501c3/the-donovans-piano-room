export interface BillingAddressData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

async function apiFetch<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type CheckoutProvider = "paypal" | "venmo";

export interface CartCheckoutItem {
  bookId?: string | number;
  title?: string;
  price: number;
  quantity: number;
}

export interface CartQuoteResponse {
  itemTotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string | null;
}

export interface CheckoutResponse {
  message?: string;
  approvalUrl?: string;
  orderId?: string;
  amount?: number;
  total?: number;
  currency?: string;
}

export const CART_CHECKOUT_RECEIPT_STORAGE_KEY = "cart_checkout_receipt";

export async function quoteCart(
  items: CartCheckoutItem[],
  couponCode?: string
): Promise<CartQuoteResponse> {
  return apiFetch<CartQuoteResponse>("/api/cart/quote", {
    method: "POST",
    body: JSON.stringify({
      items,
      couponCode: couponCode || undefined,
    }),
  });
}

export async function checkoutCart(
  provider: CheckoutProvider,
  items: CartCheckoutItem[],
  couponCode?: string,
  billingAddress?: BillingAddressData
): Promise<CheckoutResponse> {
  return apiFetch<CheckoutResponse>("/api/cart/checkout", {
    method: "POST",
    body: JSON.stringify({
      provider,
      items,
      couponCode: couponCode || undefined,
      billingAddress: billingAddress || undefined,
    }),
  });
}