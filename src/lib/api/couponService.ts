export type CouponApplicableTo = "book" | "all";

export interface ApplyCouponRequestBody {
  applicableTo?: CouponApplicableTo;
  bookId?: string;
  totalAmt?: string | number;
}

export interface CouponResponse {
  couponCode: string;
  discount: number;
  discountType: string;
  maximumDiscount: number | null;
  minimumPurchase: number;
}

export interface ApplyCouponResponse {
  coupon: CouponResponse;
}

export async function applyCouponToCartItem(
  couponCode: string,
  body: ApplyCouponRequestBody
): Promise<ApplyCouponResponse> {
  const trimmedCouponCode = couponCode.trim();

  if (!trimmedCouponCode) {
    throw new Error("Coupon code required");
  }

  const response = await fetch(
    `/api/coupon/apply-coupon/${encodeURIComponent(trimmedCouponCode)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to apply coupon");
  }

  return data;
}