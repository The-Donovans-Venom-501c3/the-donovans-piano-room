export type CouponApplicableTo = "book" | "all" | "membership";

export interface ApplyCouponRequestBody {
  applicableTo?: CouponApplicableTo;
  bookId?: string;
  memberId?: string;
  totalAmt?: string | number;
}

export interface CouponResponse {
  couponCode: string;
  bookId?: string | null;
  memberId?: string | null;
  applicableTo?: CouponApplicableTo;
  discount: string | number;
  discountType: string;
  maximumDiscount: string | number | null;
  minimumPurchase: string | number;
  expiration?: string | null;
  status?: string;
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

  let data: any = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to apply coupon");
  }

  return data as ApplyCouponResponse;
}