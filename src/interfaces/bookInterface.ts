import type { CouponResponse } from "@/lib/api/couponService";

export interface bookInterface {
  id: string;
  title: string;
  color: string;
  imageSrc: string;
  coverImageSrc: string;
  titleColor: string;
  type: string;
  price: number;
  description: string;
}

export interface backendBookInterface {
  id: string;
  title: string;
  level: string;
  price: number;
  color: string;
  tdprColor: string;
  picture: string;
  picture2: string;
  intro: string;
  comments: string;
}

export interface bookCartItemInterface {
  id: string;
  title: string;
  color: string;
  imageSrc: string;
  coverImageSrc: string;
  titleColor: string;
  type: string;
  price: number;
  description: string;
  quantity: number;
  appliedCoupon?: CouponResponse;
  discountAmount?: number;
}